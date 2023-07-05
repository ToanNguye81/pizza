package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.model.Employee;

public interface IEmployeeRepository extends JpaRepository<Employee, Integer> {

}
