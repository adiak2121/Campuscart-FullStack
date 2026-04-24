package com.ssn.campuscart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlists")
public class Wishlist {

    @Id
    private String id;
    private String userEmail;
    private String listingId;

    public Wishlist() {}

    public Wishlist(String userEmail, String listingId) {
        this.userEmail = userEmail;
        this.listingId = listingId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getListingId() { return listingId; }
    public void setListingId(String listingId) { this.listingId = listingId; }
}