package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.Wishlist;
import com.ssn.campuscart.repository.WishlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;

    public WishlistController(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    // POST /api/wishlist/add
    // Body: { "userEmail": "...", "listingId": "..." }
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Map<String, String> body) {
        String userEmail = body.get("userEmail");
        String listingId = body.get("listingId");

        Optional<Wishlist> existing = wishlistRepository.findByUserEmailAndListingId(userEmail, listingId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Already in wishlist");
        }

        Wishlist wishlist = new Wishlist(userEmail, listingId);
        return ResponseEntity.ok(wishlistRepository.save(wishlist));
    }

    // GET /api/wishlist/{email}
    @GetMapping("/{email}")
    public ResponseEntity<List<Wishlist>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(wishlistRepository.findByUserEmail(email));
    }

    // DELETE /api/wishlist/remove
    // Body: { "userEmail": "...", "listingId": "..." }
    @DeleteMapping("/remove")
    public ResponseEntity<?> remove(@RequestBody Map<String, String> body) {
        String userEmail = body.get("userEmail");
        String listingId = body.get("listingId");

        Optional<Wishlist> existing = wishlistRepository.findByUserEmailAndListingId(userEmail, listingId);
        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Not found in wishlist");
        }

        wishlistRepository.delete(existing.get());
        return ResponseEntity.ok("Removed from wishlist");
    }
}