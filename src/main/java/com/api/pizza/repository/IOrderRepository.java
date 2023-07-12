package com.api.pizza.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Order;

public interface IOrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(Integer customerId);

}
