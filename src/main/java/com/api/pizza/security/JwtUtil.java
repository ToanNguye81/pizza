package com.api.pizza.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;

@Component
public class JwtUtil {

    private static Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    // Claim key để lưu trữ thông tin người dùng trong JWT
    private static final String USER = "user";
    // Khóa bí mật sử dụng để ký và giải mã JWT
    private static final String SECRET = "daycaidaynaychinhlachukycuabandungdelorangoaidaynhenguyhiemchetnguoidayhihihi";
    // Thời gian hết hạn của JWT, 10 ngày (864000000 milliseconds)
    private static final long EXPIRATION_TIME = 864000000;

    // Tạo mã JWT từ thông tin người dùng
    public String generateToken(UserPrincipal user) {
        String token = null;
        try {
            // Tạo các builder cho các phần của JWT
            JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder();

            // Lưu thông tin người dùng vào claim "user" của JWT
            builder.claim(USER, user);

            // Thiết lập thời gian hết hạn cho JWT
            builder.expirationTime(generateExpirationDate());

            // Tạo JWTClaimsSet từ các builder
            JWTClaimsSet claimsSet = builder.build();

            // Tạo SignedJWT với Header là thuật toán HS256 và JWTClaimsSet đã tạo
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

            // Tạo signer với khóa bí mật (SECRET) và ký SignedJWT
            JWSSigner signer = new MACSigner(SECRET.getBytes());
            signedJWT.sign(signer);

            // Serialize SignedJWT thành chuỗi JWT
            token = signedJWT.serialize();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return token;
    }

    // Tạo thời gian hết hạn cho JWT
    public Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + EXPIRATION_TIME);
    }

    // Lấy JWTClaimsSet từ chuỗi JWT
    private JWTClaimsSet getClaimsFromToken(String token) {
        JWTClaimsSet claims = null;
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET.getBytes());
            if (signedJWT.verify(verifier)) {
                claims = signedJWT.getJWTClaimsSet();
            }
        } catch (ParseException | JOSEException e) {
            logger.error(e.getMessage());
        }
        return claims;
    }

    // Lấy thông tin người dùng từ chuỗi JWT
    public UserPrincipal getUserFromToken(String token) {
        UserPrincipal user = null;
        try {
            // Lấy JWTClaimsSet từ chuỗi JWT
            JWTClaimsSet claims = getClaimsFromToken(token);

            // Nếu JWTClaimsSet không null và JWT chưa hết hạn
            if (claims != null && isTokenExpired(claims)) {
                // Lấy thông tin người dùng từ claim "user" và chuyển thành đối tượng
                // UserPrincipal
                JSONObject jsonObject = (JSONObject) claims.getClaim(USER);
                user = new ObjectMapper().readValue(jsonObject.toJSONString(), UserPrincipal.class);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return user;
    }

    // Lấy thời gian hết hạn từ JWTClaimsSet
    private Date getExpirationDateFromToken(JWTClaimsSet claims) {
        return claims != null ? claims.getExpirationTime() : new Date();
    }

    // Kiểm tra xem JWT đã hết hạn chưa
    private boolean isTokenExpired(JWTClaimsSet claims) {
        return getExpirationDateFromToken(claims).after(new Date());
    }

}
