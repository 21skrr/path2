package com.hrplatform.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String membershipStatus;
    private LocalDateTime createdAt;

    // Referral stats — populated from the user's Profile row
    private String referralCode;
    private long referredCount;
    private BigDecimal referralCredits;
    private long freeMonthsEarned;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, String role, String membershipStatus,
                   LocalDateTime createdAt, String referralCode, long referredCount,
                   BigDecimal referralCredits, long freeMonthsEarned) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.membershipStatus = membershipStatus;
        this.createdAt = createdAt;
        this.referralCode = referralCode;
        this.referredCount = referredCount;
        this.referralCredits = referralCredits;
        this.freeMonthsEarned = freeMonthsEarned;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMembershipStatus() { return membershipStatus; }
    public void setMembershipStatus(String membershipStatus) { this.membershipStatus = membershipStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public long getReferredCount() { return referredCount; }
    public void setReferredCount(long referredCount) { this.referredCount = referredCount; }

    public BigDecimal getReferralCredits() { return referralCredits; }
    public void setReferralCredits(BigDecimal referralCredits) { this.referralCredits = referralCredits; }

    public long getFreeMonthsEarned() { return freeMonthsEarned; }
    public void setFreeMonthsEarned(long freeMonthsEarned) { this.freeMonthsEarned = freeMonthsEarned; }
}
