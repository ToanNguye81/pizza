package com.api.pizza.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        // Lấy thông tin xác thực (authentication) hiện tại được lưu trữ
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // xác thực có tồn tại và đã được xác thực hay chưa
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        // Nếu người dùng chưa đăng nhập (anonymousUser)
        // ==>giá trị mặc định để đại diện cho người dùng không xác định
        if (authentication.getPrincipal() == "anonymousUser") {
            return Optional.of(0l);
        }
        // trả về mã người dùng thông qua UserPrincipal
        return Optional.of(((UserPrincipal) authentication.getPrincipal()).getUserId());
    }

}
