package com.ssn.campuscart.repository;

import com.ssn.campuscart.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order, String> {
}
