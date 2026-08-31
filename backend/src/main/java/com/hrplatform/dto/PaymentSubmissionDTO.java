package com.hrplatform.dto;

import com.hrplatform.model.PaymentSubmission;
import java.time.LocalDateTime;

public class PaymentSubmissionDTO {
    private Long id;
    private Long userId;
    private Long planId;
    private String transactionReference;
    private String receiptImageUrl;
    private PaymentSubmission.PaymentStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewNotes;

    public PaymentSubmissionDTO() {}

    public PaymentSubmissionDTO(Long id, Long userId, Long planId, String transactionReference,
                                 String receiptImageUrl, PaymentSubmission.PaymentStatus status,
                                 LocalDateTime submittedAt, LocalDateTime reviewedAt, String reviewNotes) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.transactionReference = transactionReference;
        this.receiptImageUrl = receiptImageUrl;
        this.status = status;
        this.submittedAt = submittedAt;
        this.reviewedAt = reviewedAt;
        this.reviewNotes = reviewNotes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPlanId() { return planId; }
    public void setPlanId(Long planId) { this.planId = planId; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public String getReceiptImageUrl() { return receiptImageUrl; }
    public void setReceiptImageUrl(String receiptImageUrl) { this.receiptImageUrl = receiptImageUrl; }

    public PaymentSubmission.PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentSubmission.PaymentStatus status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
}
