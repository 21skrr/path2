package com.hrplatform.dto;

import java.math.BigDecimal;

public class ReferralStatsDTO {
    private String referralCode;
    private long referredCount;
    private BigDecimal credits;
    private long freeMonthsEarned;

    public ReferralStatsDTO() {}

    public ReferralStatsDTO(String referralCode, long referredCount, BigDecimal credits, long freeMonthsEarned) {
        this.referralCode = referralCode;
        this.referredCount = referredCount;
        this.credits = credits;
        this.freeMonthsEarned = freeMonthsEarned;
    }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public long getReferredCount() { return referredCount; }
    public void setReferredCount(long referredCount) { this.referredCount = referredCount; }

    public BigDecimal getCredits() { return credits; }
    public void setCredits(BigDecimal credits) { this.credits = credits; }

    public long getFreeMonthsEarned() { return freeMonthsEarned; }
    public void setFreeMonthsEarned(long freeMonthsEarned) { this.freeMonthsEarned = freeMonthsEarned; }
}
