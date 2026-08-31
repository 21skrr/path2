package com.hrplatform.config;

import com.hrplatform.model.User;
import com.hrplatform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String email = "mohammedserrafi000@gmail.com";
        if (userRepository.findByEmail(email).isEmpty()) {
            User admin = new User();
            admin.setName("Mohammed Serrafi");
            admin.setEmail(email);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.UserRole.ADMIN);
            admin.setMembershipStatus(User.MembershipStatus.PREMIUM);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            System.out.println("Admin user created: " + email);
        } else {
            System.out.println("Admin user already exists: " + email);
            User admin = userRepository.findByEmail(email).get();
            admin.setRole(User.UserRole.ADMIN);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
        }
    }
}
