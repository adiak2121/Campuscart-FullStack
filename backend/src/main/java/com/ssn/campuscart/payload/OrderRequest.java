package com.ssn.campuscart.payload;

import com.ssn.campuscart.model.OrderItem;

import java.util.List;

public class OrderRequest {

    private String buyerName;
    private String buyerEmail;
    private String pickupPoint;
    private String pickupSlot;
    private String note;
    private Double totalAmount;
    private List<OrderItem> items;

    public OrderRequest() {
    }

    public OrderRequest(String buyerName, String buyerEmail, String pickupPoint,
                        String pickupSlot, String note, Double totalAmount,
                        List<OrderItem> items) {
        this.buyerName = buyerName;
        this.buyerEmail = buyerEmail;
        this.pickupPoint = pickupPoint;
        this.pickupSlot = pickupSlot;
        this.note = note;
        this.totalAmount = totalAmount;
        this.items = items;
    }

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

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    @Override
    public String toString() {
        return "OrderRequest{buyerEmail='" + buyerEmail +
                "', totalAmount=" + totalAmount + '}';
    }
}
