package com.api.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.pizza.entity.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Token findByToken(String token);
}
