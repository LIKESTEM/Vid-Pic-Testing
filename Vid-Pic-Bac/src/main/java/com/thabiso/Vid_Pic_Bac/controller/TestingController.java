package com.thabiso.Vid_Pic_Bac.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestingController {
    @GetMapping("/hello")
    public String getMessgae() {
        return "Hello World!";
    }

    @GetMapping("/user-infor")
    public Map<String, Object> user(
            @AuthenticationPrincipal OAuth2User principal
    ) {
        return principal.getAttributes();
    }
}
