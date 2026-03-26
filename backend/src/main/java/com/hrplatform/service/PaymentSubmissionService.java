package com.hrplatform.service;

import com.hrplatform.model.PaymentSubmission;
import com.hrplatform.model.User;
import com.hrplatform.model.MembershipPlan;
import com.hrplatform.repository.PaymentSubmissionRepository;
import com.hrplatform.repository.UserRepository;
import com.hrplatform.repository.MembershipPlanRepository;
import com.hrplatform.dto.PaymentInitiateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentSubmissionService {
    private final PaymentSubmissionRepository paymentRepository;
    private final UserRepository userRepository;
    private final MembershipPlanRepository planRepository;

    public PaymentInitiateDTO initiatePayment(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        String transactionRef = generateTransactionReference();
        
        PaymentSubmission submission = new PaymentSubmission();
        submission.setUser(user);
        submission.setPlan(plan);
        submission.setTransactionReference(transactionRef);
        submission.setStatus(PaymentSubmission.PaymentStatus.PENDING);
        submission.setSubmittedAt(LocalDateTime.now());

        paymentRepository.save(submission);

        return new PaymentInitiateDTO(
                planId,
                transactionRef,
                "RIB: XXXXX-XXXXX-XXXXX (Contact admin for full RIB details)"
        );
    }

    public PaymentSubmission uploadReceipt(Long userId, Long paymentId, String receiptImageUrl) {
        PaymentSubmission submission = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment submission not found"));

        if (!submission.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        submission.setReceiptImageUrl(receiptImageUrl);
        return paymentRepository.save(submission);
    }

    public PaymentSubmission approvePayment(Long paymentId, String reviewNotes) {
        PaymentSubmission submission = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment submission not found"));

        submission.setStatus(PaymentSubmission.PaymentStatus.APPROVED);
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewNotes(reviewNotes);

        // Upgrade user membership
        User user = submission.getUser();
        user.setMembershipStatus(User.MembershipStatus.PREMIUM);
        userRepository.save(user);

        return paymentRepository.save(submission);
    }

    public PaymentSubmission rejectPayment(Long paymentId, String reviewNotes) {
        PaymentSubmission submission = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment submission not found"));

        submission.setStatus(PaymentSubmission.PaymentStatus.REJECTED);
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewNotes(reviewNotes);

        return paymentRepository.save(submission);
    }

    public List<PaymentSubmission> getPendingPayments() {
        return paymentRepository.findByStatus(PaymentSubmission.PaymentStatus.PENDING);
    }

    public List<PaymentSubmission> getUserPaymentHistory(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    private String generateTransactionReference() {
        return String.format("HR%s-%s", 
                LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")),
                UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
