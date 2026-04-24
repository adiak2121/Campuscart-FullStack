package com.ssn.campuscart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private String buyerName;
    private String buyerEmail;
    private String pickupPoint;
    private String pickupSlot;
    private String note;
    private Double totalAmount;
    private String status;   // PENDING | CONFIRMED | DELIVERED
    private List<OrderItem> items;

    public Order() {
        this.status = "PENDING";   // PART 4: default status
    }

    public Order(String id, String buyerName, String buyerEmail, String pickupPoint,
                 String pickupSlot, String note, Double totalAmount,
                 String status, List<OrderItem> items) {
        this.id = id;
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.pickupPoint = pickupPoint;
        this.pickupSlot = pickupSlot;
        this.note = note;
        this.totalAmount = totalAmount;
        this.status = (status != null) ? status : "PENDING";  // PART 4: safe default
        this.items = items;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }

    public String getPickupPoint() { return pickupPoint; }
    public void setPickupPoint(String pickupPoint) { this.pickupPoint = pickupPoint; }

    public String getPickupSlot() { return pickupSlot; }
    public void setPickupSlot(String pickupSlot) { this.pickupSlot = pickupSlot; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}