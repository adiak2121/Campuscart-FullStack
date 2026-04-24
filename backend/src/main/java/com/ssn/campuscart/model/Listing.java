package com.ssn.campuscart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Objects;

@Document(collection = "listings")
public class Listing {

    @Id
    private String id;
    private String title;
    private String category;
    private String description;
    private Double price;
    private String imageUrl;
    private String sellerName;
    private String sellerEmail;
    private String sellerBadge;
    private Double rating;
    private String pickupLocation;
    private String pickupSlot;
    private Boolean dailySpecial;
    private Boolean featured;

    /**
     * Part 4 — Recently Added.
     * Stored as an ISO-8601 UTC instant string so it serialises cleanly to JSON
     * and requires no extra MongoDB codec configuration.
     */
    private Instant createdAt;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Listing() {
    }

    // -------------------------------------------------------------------------
    // Builder
    // -------------------------------------------------------------------------

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String id;
        private String title;
        private String category;
        private String description;
        private Double price;
        private String imageUrl;
        private String sellerName;
        private String sellerEmail;
        private String sellerBadge;
        private Double rating;
        private String pickupLocation;
        private String pickupSlot;
        private Boolean dailySpecial;
        private Boolean featured;
        private Instant createdAt;

        private Builder() {
        }

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder sellerName(String sellerName) { this.sellerName = sellerName; return this; }
        public Builder sellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; return this; }
        public Builder sellerBadge(String sellerBadge) { this.sellerBadge = sellerBadge; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder pickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; return this; }
        public Builder pickupSlot(String pickupSlot) { this.pickupSlot = pickupSlot; return this; }
        public Builder dailySpecial(Boolean dailySpecial) { this.dailySpecial = dailySpecial; return this; }
        public Builder featured(Boolean featured) { this.featured = featured; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Listing build() {
            Listing listing = new Listing();
            listing.id = this.id;
            listing.title = this.title;
            listing.category = this.category;
            listing.description = this.description;
            listing.price = this.price;
            listing.imageUrl = this.imageUrl;
            listing.sellerName = this.sellerName;
            listing.sellerEmail = this.sellerEmail;
            listing.sellerBadge = this.sellerBadge;
            listing.rating = this.rating;
            listing.pickupLocation = this.pickupLocation;
            listing.pickupSlot = this.pickupSlot;
            listing.dailySpecial = this.dailySpecial;
            listing.featured = this.featured;
            listing.createdAt = this.createdAt;
            return listing;
        }
    }

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerEmail() { return sellerEmail; }
    public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }

    public String getSellerBadge() { return sellerBadge; }
    public void setSellerBadge(String sellerBadge) { this.sellerBadge = sellerBadge; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getPickupSlot() { return pickupSlot; }
    public void setPickupSlot(String pickupSlot) { this.pickupSlot = pickupSlot; }

    public Boolean getDailySpecial() { return dailySpecial; }
    public void setDailySpecial(Boolean dailySpecial) { this.dailySpecial = dailySpecial; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    // -------------------------------------------------------------------------
    // equals / hashCode / toString
    // -------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Listing other)) return false;
        return Objects.equals(id, other.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Listing{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", sellerEmail='" + sellerEmail + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}