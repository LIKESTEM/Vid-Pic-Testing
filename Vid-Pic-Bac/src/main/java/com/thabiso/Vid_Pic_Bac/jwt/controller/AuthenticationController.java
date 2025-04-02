package com.thabiso.Vid_Pic_Bac.jwt.controller;

import com.thabiso.Vid_Pic_Bac.jwt.model.ForgotPasswordRequest;
import com.thabiso.Vid_Pic_Bac.jwt.model.JwtResponse;
import com.thabiso.Vid_Pic_Bac.jwt.model.ResetPasswordRequest;
import com.thabiso.Vid_Pic_Bac.jwt.model.UserRegisterRequest;
import com.thabiso.Vid_Pic_Bac.mfa.model.MfaVerificationRequest;
import com.thabiso.Vid_Pic_Bac.users.repo.UserRepo;
import com.thabiso.Vid_Pic_Bac.jwt.service.AuthenticationService;
import com.thabiso.Vid_Pic_Bac.jwt.service.JwtService;
import com.thabiso.Vid_Pic_Bac.users.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        try {
            authService.registerUser(request.getUsername(), request.getPassword(), request.getEmail(),
                    request.getContactNumber(), request.getRole());
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    cookie.setValue(null);
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                }
            }
        }
        return ResponseEntity.ok("Logout successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String response = authService.authenticateUser(user.getUsername(), user.getPassword());

            if ("MFA_REQUIRED".equals(response)) {
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }

            return ResponseEntity.ok(new JwtResponse(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendResetToken(request.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<?> verifyMfa(@RequestBody MfaVerificationRequest request, HttpServletResponse response) {
        boolean isVerified = authService.verifyMfa(request.getUsername(), request.getMfaToken());

        if (!isVerified) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid MFA token");
        }

        User user = userRepo.findByUsername(request.getUsername()).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));

        // Generate JWT token
        String jwt = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new JwtResponse(jwt));
    }

}
