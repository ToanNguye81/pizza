package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.OrderDetail;

public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

}
