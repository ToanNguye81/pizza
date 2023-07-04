package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.Order;

public interface IOrderRepository extends JpaRepository<Order, Integer> {

}
