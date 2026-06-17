package com.ssn.campuscart.payload;

public class ListingRequest {

    private String title;
    private String category;
    private String description;
    private Double price;
    private String imageUrl;
    private String sellerName;
    private String sellerEmail;
    private String pickupLocation;
    private String pickupSlot;
    private Boolean dailySpecial;

    public ListingRequest() {
    }

    public ListingRequest(String title, String category, String description,
                          Double price, String imageUrl, String sellerName,
                          String sellerEmail, String pickupLocation,
                          String pickupSlot, Boolean dailySpecial) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.sellerName = sellerName;
        this.sellerEmail = sellerEmail;
        this.pickupLocation = pickupLocation;
        this.pickupSlot = pickupSlot;
        this.dailySpecial = dailySpecial;
    }

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

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getPickupSlot() { return pickupSlot; }
    public void setPickupSlot(String pickupSlot) { this.pickupSlot = pickupSlot; }

    public Boolean getDailySpecial() { return dailySpecial; }
    public void setDailySpecial(Boolean dailySpecial) { this.dailySpecial = dailySpecial; }

    @Override
    public String toString() {
        return "ListingRequest{title='" + title + "', category='" + category +
                "', sellerEmail='" + sellerEmail + "'}";
    }
}
