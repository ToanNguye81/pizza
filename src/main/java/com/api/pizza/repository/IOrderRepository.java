package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Order;

public interface IOrderRepository extends JpaRepository<Order, Integer> {

}
