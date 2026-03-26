package com.hrplatform.service;

import com.hrplatform.model.MembershipPlan;
import com.hrplatform.repository.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MembershipPlanService {
    private final MembershipPlanRepository planRepository;

    public List<MembershipPlan> getAllPlans() {
        return planRepository.findAll();
    }

    public MembershipPlan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Transactional
    public MembershipPlan createPlan(MembershipPlan plan) {
        return planRepository.save(plan);
    }

    @Transactional
    public MembershipPlan updatePlan(Long id, MembershipPlan updated) {
        MembershipPlan plan = getPlanById(id);
        plan.setName(updated.getName());
        plan.setPriceMad(updated.getPriceMad());
        plan.setDescription(updated.getDescription());
        plan.setBillingPeriod(updated.getBillingPeriod());
        return planRepository.save(plan);
    }

    @Transactional
    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
