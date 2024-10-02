package com.example.server.filters;

import com.example.server.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
@Order(1)
public class JwtBlacklistFilter extends OncePerRequestFilter {
    private final TokenBlacklistService tokenBlacklistService;
    private final Logger logger= LoggerFactory.getLogger(JwtBlacklistFilter.class);
    public static final String BLACKLISTED_TOKEN_ATTRIBUTE="blacklisted_token";
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token=extractToken(request);
//        logger.info("token extracted");

        if(token!=null && tokenBlacklistService.isTokenPresent(token)){

            logger.info("token is blacklisted:{}",request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            request.setAttribute(BLACKLISTED_TOKEN_ATTRIBUTE, true);
        }

        filterChain.doFilter(request, response);

    }
    private String extractToken(HttpServletRequest request) {
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
