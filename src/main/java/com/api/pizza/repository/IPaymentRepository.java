package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.Payment;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

}
