package com.hrplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe P@TH");
        message.setText("Bonjour,\n\nPour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :\n" 
                        + resetUrl + "\n\nCe lien expirera dans 24 heures.\n\nL'équipe P@TH");
        
        try {
            mailSender.send(message);
            System.out.println("Password reset email sent to " + toEmail + " with link: " + resetUrl);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ". This is likely because SMTP credentials are not configured in application.properties.");
            System.out.println("For development, use this reset link: " + resetUrl);
        }
    }
}
