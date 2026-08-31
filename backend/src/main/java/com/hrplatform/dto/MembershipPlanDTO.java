package com.hrplatform.dto;

public class MembershipPlanDTO {
    private Long id;
    private String name;
    private String priceMad;
    private String description;
    private String billingPeriod;

    public MembershipPlanDTO() {}

    public MembershipPlanDTO(Long id, String name, String priceMad, String description, String billingPeriod) {
        this.id = id;
        this.name = name;
        this.priceMad = priceMad;
        this.description = description;
        this.billingPeriod = billingPeriod;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPriceMad() { return priceMad; }
    public void setPriceMad(String priceMad) { this.priceMad = priceMad; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBillingPeriod() { return billingPeriod; }
    public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }
}
