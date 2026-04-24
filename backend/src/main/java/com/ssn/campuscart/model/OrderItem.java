package com.ssn.campuscart.model;

import java.util.Objects;

public class OrderItem {

    private String listingId;
    private String title;
    private Integer quantity;
    private Double price;
    private String sellerName;
    private String imageUrl;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public OrderItem() {
    }

    public OrderItem(String listingId, String title, Integer quantity,
                     Double price, String sellerName, String imageUrl) {
        this.listingId = listingId;
        this.title = title;
        this.quantity = quantity;
        this.price = price;
        this.sellerName = sellerName;
        this.imageUrl = imageUrl;
    }

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public String getListingId() { return listingId; }
    public void setListingId(String listingId) { this.listingId = listingId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // -------------------------------------------------------------------------
    // equals / hashCode / toString
    // -------------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderItem other)) return false;
        return Objects.equals(listingId, other.listingId)
                && Objects.equals(quantity, other.quantity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(listingId, quantity);
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "listingId='" + listingId + '\'' +
                ", title='" + title + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                '}';
    }
}
