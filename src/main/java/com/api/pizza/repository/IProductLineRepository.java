package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.ProductLine;

public interface IProductLineRepository extends JpaRepository<ProductLine, Integer> {

}
