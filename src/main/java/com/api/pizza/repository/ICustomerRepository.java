package com.api.pizza.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Customer;

public interface ICustomerRepository extends JpaRepository<Customer, Integer> {

    Page<Customer> findAllByCountryIn(List<String> countryList, Pageable pageable);

    long countCustomersByCountry(String country);

}
