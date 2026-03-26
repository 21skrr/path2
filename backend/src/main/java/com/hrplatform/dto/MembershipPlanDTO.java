package com.hrplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipPlanDTO {
    private Long id;
    private String name;
    private String priceMad;
    private String description;
    private String billingPeriod;
}
