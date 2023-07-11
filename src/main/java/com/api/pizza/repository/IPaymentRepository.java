package com.api.pizza.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Payment;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByCustomerId(Integer customerId);

}
