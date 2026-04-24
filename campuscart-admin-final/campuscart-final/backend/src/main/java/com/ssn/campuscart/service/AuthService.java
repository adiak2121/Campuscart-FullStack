package com.ssn.campuscart.service;

import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.payload.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String ADMIN_EMAIL = "admin@ssn.edu.in";
    private static final String DOMAIN_SUFFIX = "@ssn.edu.in";

    public UserProfile login(LoginRequest request) {

        if (request.getEmail() == null
                || !request.getEmail().toLowerCase().endsWith(DOMAIN_SUFFIX)) {
            throw new IllegalArgumentException(
                    "Access denied. Please use a valid @ssn.edu.in email.");
        }

        String normalizedEmail = request.getEmail().toLowerCase();

        // 🔐 ADMIN LOGIN WITH PASSWORD
        if (ADMIN_EMAIL.equals(normalizedEmail)) {

            if (request.getPassword() == null ||
                    !request.getPassword().equals("admin123")) {

                throw new IllegalArgumentException("Invalid admin password");
            }

            return UserProfile.builder()
                    .name("Admin")
                    .email(normalizedEmail)
                    .role("ADMIN")
                    .build();
        }

        // 👤 NORMAL USER (no password needed)
        return UserProfile.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .role("STUDENT")
                .build();
    }
}
