package com.hrplatform.service;

import com.hrplatform.dto.ReferralStatsDTO;
import com.hrplatform.model.Profile;
import com.hrplatform.model.ReferralEvent;
import com.hrplatform.model.User;
import com.hrplatform.repository.ProfileRepository;
import com.hrplatform.repository.ReferralEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class ReferralService {

    private static final BigDecimal CREDIT_PER_REFERRAL = new BigDecimal("250.00");
    private static final int FREE_MONTHS_EVERY_N_REFERRALS = 6;
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final ProfileRepository profileRepository;
    private final ReferralEventRepository referralEventRepository;

    @Autowired
    public ReferralService(ProfileRepository profileRepository,
                           ReferralEventRepository referralEventRepository) {
        this.profileRepository = profileRepository;
        this.referralEventRepository = referralEventRepository;
    }

    // ── Called at registration ────────────────────────────────
    /**
     * Creates a Profile for a newly registered user, assigns their unique referral code,
     * and if they provided someone else's referral code at signup, credits that referrer.
     */
    public Profile createProfileForNewUser(User newUser, String usedReferralCode) {
        Profile profile = new Profile();
        profile.setUser(newUser);
        profile.setReferralCode(generateUniqueCode());

        if (usedReferralCode != null && !usedReferralCode.isBlank()) {
            String code = usedReferralCode.toUpperCase().trim();
            Optional<Profile> referrerProfileOpt = profileRepository.findByReferralCode(code);

            if (referrerProfileOpt.isPresent()) {
                Profile referrerProfile = referrerProfileOpt.get();
                profile.setReferredBy(code);

                // Credit the referrer: +250 MAD
                BigDecimal current = referrerProfile.getReferralCredits() != null
                        ? referrerProfile.getReferralCredits() : BigDecimal.ZERO;
                referrerProfile.setReferralCredits(current.add(CREDIT_PER_REFERRAL));
                profileRepository.save(referrerProfile);

                // Log the referral event
                long referralCount = referralEventRepository.countByReferrerId(referrerProfile.getUserId());
                long freeMonths = (referralCount + 1) / FREE_MONTHS_EVERY_N_REFERRALS
                               -  referralCount        / FREE_MONTHS_EVERY_N_REFERRALS;

                ReferralEvent event = new ReferralEvent();
                event.setReferralCode(code);
                event.setReferrerUser(referrerProfile.getUser());
                event.setInviteeUser(newUser);
                event.setRewardType("CREDIT");
                event.setRewardValue(CREDIT_PER_REFERRAL);
                event.setCreatedAt(LocalDateTime.now());
                referralEventRepository.save(event);

                // If this referral unlocks a free month, log that event too
                if (freeMonths > 0) {
                    ReferralEvent freeMonthEvent = new ReferralEvent();
                    freeMonthEvent.setReferralCode(code);
                    freeMonthEvent.setReferrerUser(referrerProfile.getUser());
                    freeMonthEvent.setInviteeUser(newUser);
                    freeMonthEvent.setRewardType("FREE_MONTH");
                    freeMonthEvent.setRewardValue(BigDecimal.ONE);
                    freeMonthEvent.setCreatedAt(LocalDateTime.now());
                    referralEventRepository.save(freeMonthEvent);
                }
            }
        }

        return profileRepository.save(profile);
    }

    // ── Stats for MyAccount page ──────────────────────────────
    /**
     * Returns all referral stats for a user: their code, how many people they referred,
     * total MAD credits earned, and how many free months they've earned.
     */
    public ReferralStatsDTO getReferralStats(Long userId) {
        Optional<Profile> profileOpt = profileRepository.findById(userId);
        if (profileOpt.isEmpty()) {
            return new ReferralStatsDTO(null, 0, BigDecimal.ZERO, 0);
        }

        Profile profile = profileOpt.get();
        long referredCount = referralEventRepository.countByReferrerId(userId);
        BigDecimal credits = profile.getReferralCredits() != null
                ? profile.getReferralCredits() : BigDecimal.ZERO;
        long freeMonths = referredCount / FREE_MONTHS_EVERY_N_REFERRALS;

        return new ReferralStatsDTO(profile.getReferralCode(), referredCount, credits, freeMonths);
    }

    // ── Validate a code (for discount at signup) ──────────────
    /**
     * Returns the discount % this code entitles the new user to (10% if valid, 0 if not).
     */
    public int validateCode(String code) {
        if (code == null || code.isBlank()) return 0;
        boolean exists = profileRepository.findByReferralCode(code.toUpperCase().trim()).isPresent();
        return exists ? 10 : 0;
    }

    // ── Private helpers ───────────────────────────────────────
    private String generateUniqueCode() {
        Random random = new Random();
        String candidate;
        do {
            StringBuilder sb = new StringBuilder("PATH-");
            for (int i = 0; i < 6; i++) {
                sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            candidate = sb.toString();
        } while (profileRepository.findByReferralCode(candidate).isPresent());
        return candidate;
    }
}
