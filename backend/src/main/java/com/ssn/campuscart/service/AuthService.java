package com.ssn.campuscart.service;

import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.payload.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String ADMIN_EMAIL = "admin@ssn.edu.in";
    private static final String DOMAIN_SUFFIX = "@ssn.edu.in";

    public UserProfile login(LoginRequest request) {

    String normalizedEmail = request.getEmail() == null
            ? ""
            : request.getEmail().trim().toLowerCase();

    if (!normalizedEmail.endsWith("@ssn.edu.in")) {
        throw new IllegalArgumentException("Access denied. Please use a valid @ssn.edu.in email.");
    }

    if ("admin@ssn.edu.in".equals(normalizedEmail)) {
        if (request.getPassword() == null || !request.getPassword().equals("admin123")) {
            throw new IllegalArgumentException("Invalid admin password");
        }

        return UserProfile.builder()
                .name("Admin")
                .email(normalizedEmail)
                .role("ADMIN")
                .build();
    }

    return UserProfile.builder()
            .name(request.getName())
            .email(normalizedEmail)
            .role("STUDENT")
            .build();
}
}
