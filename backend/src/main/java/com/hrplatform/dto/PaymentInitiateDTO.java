package com.hrplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInitiateDTO {
    private Long planId;
    private String transactionReference;
    private String ribDetails;
}
