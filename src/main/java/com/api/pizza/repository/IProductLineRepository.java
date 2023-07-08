package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.ProductLine;

public interface IProductLineRepository extends JpaRepository<ProductLine, Integer> {

}
