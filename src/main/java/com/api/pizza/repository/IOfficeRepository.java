package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.Office;

public interface IOfficeRepository extends JpaRepository<Office, Integer> {

}
