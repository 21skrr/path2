package com.hrplatform.dto;

import com.hrplatform.model.PaymentSubmission;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
