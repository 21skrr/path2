package com.hrplatform.dto;

public class RegisterRequestDTO {
    private String name;
    private String email;
    private String password;
    private String referralCode; // optional — the code the new user was given by a friend

    public RegisterRequestDTO() {}

    public RegisterRequestDTO(String name, String email, String password, String referralCode) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.referralCode = referralCode;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }
}
