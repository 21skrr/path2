package com.hrplatform.controller;

import com.hrplatform.dto.LoginRequestDTO;
import com.hrplatform.dto.RegisterRequestDTO;
import com.hrplatform.dto.UserDTO;
import com.hrplatform.model.Profile;
import com.hrplatform.model.User;
import com.hrplatform.repository.ProfileRepository;
import com.hrplatform.repository.UserRepository;
import com.hrplatform.service.ReferralService;
import com.hrplatform.dto.ForgotPasswordRequestDTO;
import com.hrplatform.dto.ResetPasswordRequestDTO;
import com.hrplatform.model.PasswordResetToken;
import com.hrplatform.repository.PasswordResetTokenRepository;
import com.hrplatform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ReferralService referralService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    public UserController(UserRepository userRepository,
                          ProfileRepository profileRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          ReferralService referralService,
                          EmailService emailService,
                          PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.referralService = referralService;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    // ── POST /api/auth/register ──────────────────────────────
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.MEMBER);
        user.setMembershipStatus(User.MembershipStatus.FREE);

        User saved = userRepository.save(user);

        // Create profile + assign referral code; credit referrer if a code was provided
        referralService.createProfileForNewUser(saved, request.getReferralCode());

        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    // ── POST /api/auth/login ─────────────────────────────────
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        Optional<User> optUser = userRepository.findByEmail(request.getEmail());

        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }

        User user = optUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }

        return ResponseEntity.ok(toDTO(user));
    }

    // ── POST /api/auth/forgot-password ───────────────────────
    @PostMapping("/auth/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        Optional<User> optUser = userRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            return ResponseEntity.ok().build(); // Return 200 to prevent email enumeration
        }

        User user = optUser.get();
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        
        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok().build();
    }

    // ── POST /api/auth/reset-password ────────────────────────
    @PostMapping("/auth/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        Optional<PasswordResetToken> optToken = passwordResetTokenRepository.findByToken(request.getToken());
        
        if (optToken.isEmpty() || optToken.get().isExpired()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired token"));
        }

        PasswordResetToken resetToken = optToken.get();
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok().build();
    }

    // ── GET /api/users/{id} ──────────────────────────────────
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> (ResponseEntity<?>) ResponseEntity.ok(toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── PUT /api/users/{id}/membership ───────────────────────
    @PutMapping("/users/{id}/membership")
    public ResponseEntity<?> updateMembership(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = optUser.get();
        String status = body.get("membershipStatus");
        if (status != null) {
            user.setMembershipStatus(User.MembershipStatus.valueOf(status.toUpperCase()));
        }
        return ResponseEntity.ok(toDTO(userRepository.save(user)));
    }

    // ── GET /api/users ───────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream().map(this::toDTO).toList()
        );
    }

    // ── DELETE /api/users/{id} ───────────────────────────────
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ─── Helper ──────────────────────────────────────────────
    private UserDTO toDTO(User user) {
        // Load referral data from the profile if it exists
        Optional<Profile> profileOpt = profileRepository.findById(user.getId());
        String referralCode = null;
        BigDecimal credits = BigDecimal.ZERO;
        long referredCount = 0;
        long freeMonths = 0;

        if (profileOpt.isPresent()) {
            Profile p = profileOpt.get();
            referralCode = p.getReferralCode();
            credits = p.getReferralCredits() != null ? p.getReferralCredits() : BigDecimal.ZERO;
            // Count real referral events for accuracy
            referredCount = referralService.getReferralStats(user.getId()).getReferredCount();
            freeMonths = referralService.getReferralStats(user.getId()).getFreeMonthsEarned();
        }

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getMembershipStatus().name(),
                user.getCreatedAt(),
                referralCode,
                referredCount,
                credits,
                freeMonths
        );
    }
}
