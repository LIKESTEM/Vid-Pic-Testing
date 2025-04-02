package com.thabiso.Vid_Pic_Bac.jwt.service;

import com.thabiso.Vid_Pic_Bac.mfa.service.MultiFactorAuthService;
import com.thabiso.Vid_Pic_Bac.users.model.Role;
import com.thabiso.Vid_Pic_Bac.users.model.User;
import com.thabiso.Vid_Pic_Bac.users.repo.RoleRepo;
import com.thabiso.Vid_Pic_Bac.users.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class AuthenticationService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MultiFactorAuthService mfaService;

    @Autowired
    private JavaMailSender mailSender;

    public User registerUser(
            String username,
            String password,
            String email,
            String contactNumber,
            String roleName
    ) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setContactNumber(contactNumber);
        user.getRoles().add(role);
        return userRepo.save(user);
    }

    public String authenticateUser(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if MFA is enabled
        if (user.getMfaEnabled()) {
            String mfaToken = mfaService.generateMfaToken();
            user.setMfaToken(mfaToken);
            userRepo.save(user);
            mfaService.sendMfaToken(user.getEmail(), mfaToken);
            return "MFA_REQUIRED";
        }

        // Generate JWT token
        return jwtService.generateToken(user);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepo.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);
    }

    public void sendResetToken(String email) {
        // Find the user by email
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with this email does not exist"));

        // Generate a unique reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15-minute expiry
        userRepo.save(user);

        // Send email with reset token
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Hi " + user.getUsername() + ",\n\n"
                + "You requested to reset your password. " +
                "Use the following link to reset your password: \n"
                + "http://localhost:3000/reset-password?token=" + resetToken + "\n\n "
                + "This link will expire in 15 minutes.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Best regards,\nLIKESTEM");

        mailSender.send(message);
    }

    public boolean verifyMfa(String username, String mfaToken) {
        // Find the user by username
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the provided MFA token matches the one stored in the database
        if (user.getMfaToken() == null || !user.getMfaToken().equals(mfaToken)) {
            return false;
        }

        // Clear the MFA token after successful verification
        user.setMfaToken(null);
        userRepo.save(user);

        return true;
    }
}
