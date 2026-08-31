package com.hrplatform.dto;

public class PaymentRequestDTO {
    private Long planId;
    private String receiptImageUrl;

    public PaymentRequestDTO() {}

    public PaymentRequestDTO(Long planId, String receiptImageUrl) {
        this.planId = planId;
        this.receiptImageUrl = receiptImageUrl;
    }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getReceiptImageUrl() { return receiptImageUrl; }
    public void setReceiptImageUrl(String receiptImageUrl) { this.receiptImageUrl = receiptImageUrl; }
}
