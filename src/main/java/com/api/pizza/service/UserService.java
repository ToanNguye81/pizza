package com.api.pizza.service;

import com.api.pizza.entity.User;
import com.api.pizza.security.UserPrincipal;

public interface UserService {
    User createUser(User user);

    UserPrincipal findByUsername(String username);
}
