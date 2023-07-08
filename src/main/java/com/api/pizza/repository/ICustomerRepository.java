package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Customer;

public interface ICustomerRepository extends JpaRepository<Customer, Integer> {

}
