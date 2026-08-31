package com.hrplatform.controller;

import com.hrplatform.dto.ReferralStatsDTO;
import com.hrplatform.service.ReferralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    private final ReferralService referralService;

    @Autowired
    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    /**
     * GET /api/referrals/stats/{userId}
     * Returns the full referral stats for a user: code, referredCount, credits, freeMonths.
     * Used by MyAccount.tsx to populate the referral card.
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<ReferralStatsDTO> getStats(@PathVariable Long userId) {
        return ResponseEntity.ok(referralService.getReferralStats(userId));
    }

    /**
     * GET /api/referrals/validate?code=PATH-XXXX
     * Returns { valid: true/false, discount: 10 } — used during registration
     * to show the user they got a discount for entering a valid referral code.
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCode(@RequestParam String code) {
        int discount = referralService.validateCode(code);
        return ResponseEntity.ok(Map.of(
                "valid", discount > 0,
                "discount", discount
        ));
    }
}
