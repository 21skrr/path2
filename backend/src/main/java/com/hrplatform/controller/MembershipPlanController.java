package com.hrplatform.controller;

import com.hrplatform.model.MembershipPlan;
import com.hrplatform.service.MembershipPlanService;
import com.hrplatform.dto.MembershipPlanDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MembershipPlanController {
    private final MembershipPlanService planService;

    @GetMapping
    public ResponseEntity<List<MembershipPlanDTO>> getAllPlans() {
        List<MembershipPlanDTO> plans = planService.getAllPlans()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipPlanDTO> getPlan(@PathVariable Long id) {
        MembershipPlan plan = planService.getPlanById(id);
        return ResponseEntity.ok(convertToDTO(plan));
    }

    @PostMapping
    public ResponseEntity<MembershipPlanDTO> createPlan(@RequestBody MembershipPlan plan) {
        MembershipPlan created = planService.createPlan(plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlanDTO> updatePlan(@PathVariable Long id, @RequestBody MembershipPlan plan) {
        MembershipPlan updated = planService.updatePlan(id, plan);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    private MembershipPlanDTO convertToDTO(MembershipPlan plan) {
        return new MembershipPlanDTO(
                plan.getId(),
                plan.getName(),
                plan.getPriceMad().toString(),
                plan.getDescription(),
                plan.getBillingPeriod()
        );
    }
}
