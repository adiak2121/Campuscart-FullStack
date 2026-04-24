package com.ssn.campuscart.service;

import com.ssn.campuscart.model.Order;
import com.ssn.campuscart.payload.OrderRequest;
import com.ssn.campuscart.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAll().stream()
                .sorted(Comparator.comparing(Order::getId).reversed())
                .toList();
    }

    public Order create(OrderRequest request) {
        Order order = new Order();
        order.setBuyerName(request.getBuyerName());
        order.setBuyerEmail(request.getBuyerEmail());
        order.setPickupPoint(request.getPickupPoint());
        order.setPickupSlot(request.getPickupSlot());
        order.setNote(request.getNote());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PENDING");
        order.setItems(request.getItems());

        return orderRepository.save(order);
    }
}
