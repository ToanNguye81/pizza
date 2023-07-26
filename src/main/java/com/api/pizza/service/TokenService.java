package com.api.pizza.service;

import com.api.pizza.entity.Token;

public interface TokenService {

    Token createToken(Token token);

    Token findByToken(String token);
}
