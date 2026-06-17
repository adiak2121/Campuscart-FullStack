package com.ssn.campuscart.repository;

import com.ssn.campuscart.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {

    List<Wishlist> findByUserEmail(String userEmail);

    Optional<Wishlist> findByUserEmailAndListingId(String userEmail, String listingId);
}