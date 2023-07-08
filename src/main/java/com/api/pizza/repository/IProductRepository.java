package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Product;

public interface IProductRepository extends JpaRepository<Product, Integer> {

}
