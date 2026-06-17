package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.payload.AuthResponse;
import com.ssn.campuscart.payload.LoginRequest;
import com.ssn.campuscart.service.AuthService;
import com.ssn.campuscart.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        UserProfile user = authService.login(request);

String token = jwtService.generateToken(user);

return new AuthResponse(
        token,
        user.getEmail(),
        user.getRole(),
        user.getName()
);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException ex) {
        return Map.of("message", ex.getMessage());
    }
}
