package com.ssn.campuscart.service;

import com.ssn.campuscart.model.UserProfile;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserProfile user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("name", user.getName())
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validateAndGetClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header.");
        }
        return authorizationHeader.substring(7);
    }

    public UserProfile getUserFromBearerToken(String authorizationHeader) {
        Claims claims = validateAndGetClaims(extractBearerToken(authorizationHeader));
        return UserProfile.builder()
                .email(claims.getSubject())
                .name(String.valueOf(claims.get("name")))
                .role(String.valueOf(claims.get("role")))
                .build();
    }

    public boolean isAdmin(String authorizationHeader) {
        UserProfile user = getUserFromBearerToken(authorizationHeader);
        return "ADMIN".equals(user.getRole()) && "admin@ssn.edu.in".equalsIgnoreCase(user.getEmail());
    }
}
