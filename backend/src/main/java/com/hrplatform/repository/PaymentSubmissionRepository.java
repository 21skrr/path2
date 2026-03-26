package com.hrplatform.repository;

import com.hrplatform.model.PaymentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentSubmissionRepository extends JpaRepository<PaymentSubmission, Long> {
    List<PaymentSubmission> findByStatus(PaymentSubmission.PaymentStatus status);
    Optional<PaymentSubmission> findByTransactionReference(String reference);
    List<PaymentSubmission> findByUserId(Long userId);
}
