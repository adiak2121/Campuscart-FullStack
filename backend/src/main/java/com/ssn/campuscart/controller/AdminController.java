package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.Listing;
import com.ssn.campuscart.model.Order;
import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.payload.LoginRequest;
import com.ssn.campuscart.repository.ListingRepository;
import com.ssn.campuscart.repository.OrderRepository;
import com.ssn.campuscart.service.AuthService;
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

    public AdminController(ListingRepository listingRepository,
                           OrderRepository orderRepository,
                           AuthService authService) {
        this.listingRepository = listingRepository;
        this.orderRepository = orderRepository;
        this.authService = authService;
    }

    // ── Admin Login ───────────────────────────────────────────────────────────

    /**
     * POST /api/admin/login
     * Reuses AuthService.login(); rejects non-ADMIN roles with 403.
     */
    @PostMapping("/login")
    public UserProfile adminLogin(@RequestBody LoginRequest request) {
        UserProfile profile;
        try {
            profile = authService.login(request);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
        if (!"ADMIN".equals(profile.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied. Admin credentials required.");
        }
        return profile;
    }

    // ── Role guard (shared helper) ────────────────────────────────────────────

    /**
     * Validates the X-Admin-Email header present on every /api/admin/* call.
     * Controllers call this at the top of each handler to enforce the role check.
     * A proper Spring Security setup would replace this, but this keeps the
     * project dependency-free.
     */
    private void requireAdmin(String adminEmail) {
        if (adminEmail == null || adminEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Missing admin credentials.");
        }
        // The admin email is always admin@ssn.edu.in (set by AuthService)
        if (!"admin@ssn.edu.in".equalsIgnoreCase(adminEmail.trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied. Admin credentials required.");
        }
    }

    // ── Listings ─────────────────────────────────────────────────────────────

    @GetMapping("/listings")
    public List<Listing> getAllListings(
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        requireAdmin(adminEmail);
        return listingRepository.findAll();
    }

    @DeleteMapping("/listings/{id}")
    public Map<String, String> deleteListing(
            @PathVariable String id,
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        requireAdmin(adminEmail);
        if (!listingRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found");
        }
        listingRepository.deleteById(id);
        return Map.of("message", "Listing deleted successfully");
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public List<Order> getAllOrders(
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        requireAdmin(adminEmail);
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
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        requireAdmin(adminEmail);
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
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        return updateOrderStatus(id, body, adminEmail);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics(
            @RequestHeader(value = "X-Admin-Email", required = false) String adminEmail) {
        requireAdmin(adminEmail);
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