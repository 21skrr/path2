package com.hrplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "profiles")
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "job_title", length = 255)
    private String jobTitle;

    @Column(name = "company", length = 255)
    private String company;

    @Column(name = "city", length = 255)
    private String city;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "referral_code", unique = true, length = 20)
    private String referralCode;

    @Column(name = "referred_by", length = 20)
    private String referredBy;

    @Column(name = "referral_credits", precision = 10, scale = 2)
    private BigDecimal referralCredits = BigDecimal.ZERO;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getReferredBy() { return referredBy; }
    public void setReferredBy(String referredBy) { this.referredBy = referredBy; }

    public BigDecimal getReferralCredits() { return referralCredits; }
    public void setReferralCredits(BigDecimal referralCredits) { this.referralCredits = referralCredits; }
}
