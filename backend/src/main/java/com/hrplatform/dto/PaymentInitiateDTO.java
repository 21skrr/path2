package com.hrplatform.dto;

public class PaymentInitiateDTO {
    private Long planId;
    private String transactionReference;
    private String ribDetails;

    public PaymentInitiateDTO() {}

    public PaymentInitiateDTO(Long planId, String transactionReference, String ribDetails) {
        this.planId = planId;
        this.transactionReference = transactionReference;
        this.ribDetails = ribDetails;
    }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public String getRibDetails() { return ribDetails; }
    public void setRibDetails(String ribDetails) { this.ribDetails = ribDetails; }
}
