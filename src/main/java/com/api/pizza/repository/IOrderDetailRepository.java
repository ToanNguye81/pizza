package com.api.pizza.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.OrderDetail;

public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrderId(Integer orderId);

}
