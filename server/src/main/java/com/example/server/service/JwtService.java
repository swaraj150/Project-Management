package com.example.server.service;


import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    Logger logger= LoggerFactory.getLogger(JwtService.class);

    private SecretKey getSigningKey(){
        try {
            logger.debug("Decoding the secret key for signing.");
            byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            logger.error("Error while decoding the secret key.", e);
            throw e;
        }
    }

    private Claims extractAllClaims(String jwt){
        try {
            logger.info("Extracting all claims from the JWT.");
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.error("JWT is expired: {}", jwt, e);
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT is unsupported: {}", jwt, e);
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("JWT is malformed: {}", jwt, e);
            throw e;
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed: {}", jwt, e);
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", jwt, e);
            throw e;
        }
    }
    public <T> T extractClaim(String jwt, Function<Claims,T> claimsResolver){
        logger.debug("Extracting claim from JWT.");
        final Claims claims=extractAllClaims(jwt);
        return claimsResolver.apply(claims);
    }
    public String extractUsername(String jwt){
        logger.info("Extracting username from JWT.");
        return extractClaim(jwt,Claims::getSubject);
    }
    public String generateToken(Map<String,Object> extraClaims, UserDetails userDetails){
        try {
            logger.info("Generating JWT for user: {}", userDetails.getUsername());
            return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating JWT for user: {}", userDetails.getUsername(), e);
            throw e;
        }
    }
    public String generateToken(UserDetails userDetails){
        logger.debug("Generating JWT without extra claims for user: {}", userDetails.getUsername());
        return generateToken(new HashMap<>(), userDetails);
    }

    public boolean isTokenValid(String jwt,UserDetails userDetails){
        try {
            logger.info("Validating JWT for user: {}", userDetails.getUsername());
            final String username = extractUsername(jwt);
            return !isTokenExpired(jwt) && username.equals(userDetails.getUsername());
        } catch (Exception e) {
            logger.error("Error validating JWT for user: {}", userDetails.getUsername(), e);
            return false;
        }
    }
    public boolean isTokenExpired(String jwt){
        logger.debug("Checking if the JWT is expired.");
        return extractExpiration(jwt).before(new Date());
    }
    public Date extractExpiration(String jwt){
        logger.debug("Extracting expiration date from JWT.");
        return extractClaim(jwt, Claims::getExpiration);
    }

    public String extractToken(HttpServletRequest request) {
        String token = request.getParameter("token");
        if (token != null) {
            return token;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

}
