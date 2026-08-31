package com.hrplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "referral_events")
@NoArgsConstructor
@AllArgsConstructor
public class ReferralEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "referral_code", nullable = false, length = 20)
    private String referralCode;

    @Column(name = "reward_type", length = 50)
    private String rewardType;

    @Column(name = "reward_value", precision = 10, scale = 2)
    private BigDecimal rewardValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_user_id", nullable = false)
    private User referrerUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_user_id", nullable = false)
    private User inviteeUser;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getRewardType() { return rewardType; }
    public void setRewardType(String rewardType) { this.rewardType = rewardType; }

    public BigDecimal getRewardValue() { return rewardValue; }
    public void setRewardValue(BigDecimal rewardValue) { this.rewardValue = rewardValue; }

    public User getReferrerUser() { return referrerUser; }
    public void setReferrerUser(User referrerUser) { this.referrerUser = referrerUser; }

    public User getInviteeUser() { return inviteeUser; }
    public void setInviteeUser(User inviteeUser) { this.inviteeUser = inviteeUser; }
}
