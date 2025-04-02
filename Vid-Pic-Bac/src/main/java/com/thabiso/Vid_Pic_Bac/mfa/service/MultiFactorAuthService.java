package com.thabiso.Vid_Pic_Bac.mfa.service;

import com.thabiso.Vid_Pic_Bac.users.model.User;
import com.thabiso.Vid_Pic_Bac.users.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MultiFactorAuthService {
    @Autowired
    private UserRepo userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Generate a 6-digit MFA token
    public String generateMfaToken() {
        int token = 100000 + new Random().nextInt(900000); // Ensure a 6-digit token
        return String.valueOf(token);
    }

    // Send MFA token to user's email
    public void sendMfaToken(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Multi-Factor Authentication (MFA) Token");
        message.setText("Your MFA token is: " + token + ". Please use this to complete your login.");
        mailSender.send(message);
    }

    // Verify the MFA token
    public boolean verifyMfaToken(String username, String mfaToken) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getMfaToken().equals(mfaToken);
    }
}
