package com.api.pizza.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Product;

public interface IProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByProductLineId(Integer productLineId);

}
