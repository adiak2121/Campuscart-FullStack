package com.ssn.campuscart.model;

import java.util.Objects;

public class UserProfile {

    private String name;
    private String email;
    private String role;
    private String password;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public UserProfile() {
    }

    public UserProfile(String name, String email, String role, String password) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    // -------------------------------------------------------------------------
    // Builder
    // -------------------------------------------------------------------------

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String name;
        private String email;
        private String role;
        private String password; //

        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder password(String password) { this.password = password; return this; } // ✅ ADD

        public UserProfile build() {
            return new UserProfile(name, email, role, password); // ✅ UPDATE
        }
    }

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // -------------------------------------------------------------------------
    // equals / hashCode / toString
    // -------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProfile other)) return false;
        return Objects.equals(email, other.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
