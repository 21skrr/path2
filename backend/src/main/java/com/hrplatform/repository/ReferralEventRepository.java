package com.hrplatform.repository;

import com.hrplatform.model.ReferralEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralEventRepository extends JpaRepository<ReferralEvent, Long> {

    // All events where this user was the referrer
    List<ReferralEvent> findByReferrerUser_Id(Long referrerId);

    // Lookup by the referral code string (for validation)
    List<ReferralEvent> findByReferralCode(String referralCode);

    // Count distinct invitees referred by this user
    @Query("SELECT COUNT(r) FROM ReferralEvent r WHERE r.referrerUser.id = :referrerId")
    long countByReferrerId(@Param("referrerId") Long referrerId);
}
