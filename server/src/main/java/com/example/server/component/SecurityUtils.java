package com.example.server.component;

import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
@Component
public class SecurityUtils {
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

        return username;
    }
}
