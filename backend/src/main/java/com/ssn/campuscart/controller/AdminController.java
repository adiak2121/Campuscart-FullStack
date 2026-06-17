package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.Listing;
import com.ssn.campuscart.model.Order;
import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.payload.AuthResponse;
import com.ssn.campuscart.payload.LoginRequest;
import com.ssn.campuscart.repository.ListingRepository;
import com.ssn.campuscart.repository.OrderRepository;
import com.ssn.campuscart.service.AuthService;
import com.ssn.campuscart.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ListingRepository listingRepository;
    private final OrderRepository orderRepository;
    private final AuthService authService;
    private final JwtService jwtService;

    public AdminController(ListingRepository listingRepository,
                           OrderRepository orderRepository,
                           AuthService authService,
                           JwtService jwtService) {
        this.listingRepository = listingRepository;
        this.orderRepository = orderRepository;
        this.authService = authService;
        this.jwtService = jwtService;
    }

    // ── Admin Login ───────────────────────────────────────────────────────────

    /**
     * POST /api/admin/login
     * Reuses AuthService.login(); rejects non-ADMIN roles with 403.
     */
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
    // ── Role guard (shared helper) ────────────────────────────────────────────


/**
 * Validates the JWT token present on every protected /api/admin/* call.
 * The frontend sends it as: Authorization: Bearer <token>
 */
private void requireAdmin(String authorizationHeader) {
    try {
        if (!jwtService.isAdmin(authorizationHeader)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied. Admin token required.");
        }
    } catch (Exception ex) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Access denied. Admin token required.");
    }
}

    // ── Listings ─────────────────────────────────────────────────────────────

    @GetMapping("/listings")
    public List<Listing> getAllListings(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        requireAdmin(authorizationHeader);
        return listingRepository.findAll();
    }

    @DeleteMapping("/listings/{id}")
    public Map<String, String> deleteListing(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        requireAdmin(authorizationHeader);
        if (!listingRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found");
        }
        listingRepository.deleteById(id);
        return Map.of("message", "Listing deleted successfully");
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public List<Order> getAllOrders(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        requireAdmin(authorizationHeader);
        return orderRepository.findAll();
    }

    /**
     * PUT /api/admin/order/{id}/status   (Part 5 — Order Status)
     * Body: { "status": "PENDING" | "CONFIRMED" | "DELIVERED" }
     */
    @PutMapping("/order/{id}/status")
    public Order updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        requireAdmin(authorizationHeader);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status field required");
        }
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // Keep the old PATCH alias so existing callers don't break
    @PatchMapping("/orders/{id}/status")
    public Order updateOrderStatusLegacy(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return updateOrderStatus(id, body, authorizationHeader);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        requireAdmin(authorizationHeader);
        List<Listing> listings = listingRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        Map<String, Long> categoryCounts = new HashMap<>();
        for (Listing l : listings) {
            categoryCounts.merge(l.getCategory(), 1L, Long::sum);
        }

        Map<String, Long> statusCounts = new HashMap<>();
        for (Order o : orders) {
            statusCounts.merge(o.getStatus(), 1L, Long::sum);
        }

        double totalRevenue = orders.stream()
                .filter(o -> !"Cancelled".equals(o.getStatus()))
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        long uniqueSellers = listings.stream()
                .map(Listing::getSellerEmail)
                .distinct()
                .count();

        long uniqueBuyers = orders.stream()
                .map(Order::getBuyerEmail)
                .distinct()
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalListings", listings.size());
        result.put("totalOrders", orders.size());
        result.put("totalRevenue", totalRevenue);
        result.put("uniqueSellers", uniqueSellers);
        result.put("uniqueBuyers", uniqueBuyers);
        result.put("categoryCounts", categoryCounts);
        result.put("statusCounts", statusCounts);
        return result;
    }
}