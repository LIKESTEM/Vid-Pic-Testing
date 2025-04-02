package com.thabiso.Vid_Pic_Bac.oauth.service;

import com.thabiso.Vid_Pic_Bac.users.model.User;
import com.thabiso.Vid_Pic_Bac.users.repo.RoleRepo;
import com.thabiso.Vid_Pic_Bac.users.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private UserRepo userRepository;

    @Autowired
    private RoleRepo roleRepo;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // If user doesn't exist, create new user
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email);
                    newUser.setRoles(new HashSet<>());
                    newUser.getRoles().add(roleRepo.findByName("Customer").get());
                    return userRepository.save(newUser);
                });

        return new DefaultOAuth2User(
                (user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toSet())),
                oAuth2User.getAttributes(),
                "email"
        );
    }
}
