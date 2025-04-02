package com.thabiso.Vid_Pic_Bac.oauth.model;

import com.thabiso.Vid_Pic_Bac.users.model.User;
import com.thabiso.Vid_Pic_Bac.users.repo.RoleRepo;
import com.thabiso.Vid_Pic_Bac.users.repo.UserRepo;
import com.thabiso.Vid_Pic_Bac.jwt.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashSet;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService; // Utility to generate JWT token

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private RoleRepo roleRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Try to find the user, or create a new one if not found
        User user = userRepository.findByEmail(email).orElseGet(() -> createUser(oAuth2User));

        // Generate JWT token with user ID
        String token = jwtService.generateToken(user);

        // Send token to frontend via redirect
        response.sendRedirect("http://localhost:3000/oauth-success?token=" + token);
    }

    private User createUser(OAuth2User oAuth2User) {
        // Logic to create a new user from the OAuth2User attributes
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Create a new User object (adjust this based on your User class structure)
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(email);
        newUser.setRoles(new HashSet<>());
        newUser.getRoles().add(roleRepo.findByName("Customer").get());

        // Save the new user to the repository
        return userRepository.save(newUser);
    }
}
