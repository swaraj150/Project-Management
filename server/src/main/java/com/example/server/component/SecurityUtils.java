package com.example.server.component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
@Component
public class SecurityUtils {
    Logger logger= LoggerFactory.getLogger(SecurityUtils.class);
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new SecurityException("No authentication information found");
        }

        if (authentication instanceof AnonymousAuthenticationToken) {
            throw new SecurityException("User is not authenticated");
        }

        if (!authentication.isAuthenticated()) {
            throw new SecurityException("User is not authenticated");
        }

        String username = authentication.getName();
        if (username == null || username.isEmpty()) {
            throw new SecurityException("Username is null or empty");
        }
        logger.info("authorities: {}",authentication.getAuthorities().toString());



        return username;
    }
}
