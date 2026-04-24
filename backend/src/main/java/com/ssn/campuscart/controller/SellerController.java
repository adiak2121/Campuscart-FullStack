package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.Listing;
import com.ssn.campuscart.model.UserProfile;
import com.ssn.campuscart.repository.ListingRepository;
import com.ssn.campuscart.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final UserProfileRepository userProfileRepository;
    private final ListingRepository listingRepository;

    public SellerController(UserProfileRepository userProfileRepository,
                            ListingRepository listingRepository) {
        this.userProfileRepository = userProfileRepository;
        this.listingRepository = listingRepository;
    }

    // GET /api/seller/{email}
    @GetMapping("/{email}")
    public ResponseEntity<?> getSellerProfile(@PathVariable String email) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByEmail(email);

        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Listing> listings = listingRepository.findAll()
                .stream()
                .filter(l -> email.equalsIgnoreCase(l.getSellerEmail()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("seller", profileOpt.get());
        response.put("listings", listings);

        return ResponseEntity.ok(response);
    }
}