package com.hrplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "membership_plans")
@NoArgsConstructor
@AllArgsConstructor
public class MembershipPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "price_mad", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceMad;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "billing_period", length = 50)
    private String billingPeriod; // MONTHLY, ANNUAL

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPriceMad() { return priceMad; }
    public void setPriceMad(BigDecimal priceMad) { this.priceMad = priceMad; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBillingPeriod() { return billingPeriod; }
    public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }
}
