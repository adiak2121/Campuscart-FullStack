package com.ssn.campuscart.repository;

import com.ssn.campuscart.model.Listing;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ListingRepository extends MongoRepository<Listing, String> {
}
