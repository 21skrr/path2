package com.hrplatform.controller;

import com.hrplatform.dto.PaymentInitiateDTO;
import com.hrplatform.dto.PaymentSubmissionDTO;
import com.hrplatform.model.PaymentSubmission;
import com.hrplatform.service.PaymentSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentSubmissionService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateDTO> initiatePayment(
            @RequestParam Long userId,
            @RequestParam Long planId) {
        PaymentInitiateDTO result = paymentService.initiatePayment(userId, planId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{paymentId}/receipt")
    public ResponseEntity<PaymentSubmissionDTO> uploadReceipt(
            @PathVariable Long paymentId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {
        String receiptUrl = request.get("receiptImageUrl");
        PaymentSubmission submission = paymentService.uploadReceipt(userId, paymentId, receiptUrl);
        return ResponseEntity.ok(convertToDTO(submission));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentSubmissionDTO>> getUserPaymentHistory(@PathVariable Long userId) {
        List<PaymentSubmissionDTO> history = paymentService.getUserPaymentHistory(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    // Admin endpoints
    @GetMapping("/admin/pending")
    public ResponseEntity<List<PaymentSubmissionDTO>> getPendingPayments() {
        List<PaymentSubmissionDTO> pending = paymentService.getPendingPayments()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    @PutMapping("/admin/{paymentId}/approve")
    public ResponseEntity<PaymentSubmissionDTO> approvePayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request) {
        String notes = request.getOrDefault("reviewNotes", "");
        PaymentSubmission submission = paymentService.approvePayment(paymentId, notes);
        return ResponseEntity.ok(convertToDTO(submission));
    }

    @PutMapping("/admin/{paymentId}/reject")
    public ResponseEntity<PaymentSubmissionDTO> rejectPayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> request) {
        String notes = request.getOrDefault("reviewNotes", "");
        PaymentSubmission submission = paymentService.rejectPayment(paymentId, notes);
        return ResponseEntity.ok(convertToDTO(submission));
    }

    private PaymentSubmissionDTO convertToDTO(PaymentSubmission submission) {
        return new PaymentSubmissionDTO(
                submission.getId(),
                submission.getUser().getId(),
                submission.getPlan().getId(),
                submission.getTransactionReference(),
                submission.getReceiptImageUrl(),
                submission.getStatus(),
                submission.getSubmittedAt(),
                submission.getReviewedAt(),
                submission.getReviewNotes()
        );
    }
}
