package com.ssn.campuscart.payload;

public class LoginRequest {

    private String name;
    private String email;
    private String password; // ✅ ADD THIS

    public LoginRequest() {
    }

    public LoginRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // ✅ ADD THESE
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "LoginRequest{name='" + name + "', email='" + email + "', password='" + password + "'}";
    }
}