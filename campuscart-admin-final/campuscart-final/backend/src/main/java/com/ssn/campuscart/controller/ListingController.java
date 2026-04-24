package com.ssn.campuscart.controller;

import com.ssn.campuscart.model.Listing;
import com.ssn.campuscart.payload.ListingRequest;
import com.ssn.campuscart.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public ResponseEntity<List<Listing>> getAll() {
        return ResponseEntity.ok(listingService.getAll());
    }

    // PART 3: Price filter — GET /api/listings/filter?min=50&max=200
    @GetMapping("/filter")
    public ResponseEntity<List<Listing>> filterByPrice(
            @RequestParam Double min,
            @RequestParam Double max) {
        return ResponseEntity.ok(listingService.filterByPrice(min, max));
    }

    @PostMapping
    public ResponseEntity<Listing> create(@RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.create(request));
    }
}