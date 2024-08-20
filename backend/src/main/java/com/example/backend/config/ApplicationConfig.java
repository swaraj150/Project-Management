package com.example.backend.config;

import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.security.auth.login.AccountExpiredException;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private static final Logger logger= LoggerFactory.getLogger(ApplicationConfig.class);
    private final UserRepository userRepository;
    @Bean
    public UserDetailsService userDetailsService(){
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                if(username==null || username.trim().isEmpty()){
                    logger.error("Attempt to load user details with null or empty username");
                    throw new IllegalArgumentException("Username cannot be null or empty");
                }
                logger.info("Attempting to load user details for username: {}", username);
                Optional<User> optionalUser=userRepository.findByUsername(username);


                if(optionalUser.isEmpty()){
                    logger.warn("User not found: {}",username);
                    throw new UsernameNotFoundException("User not found");
                }
                User user=optionalUser.get();

                if (!user.isEnabled()) {
                    logger.warn("User found but is disabled: {}", username);
                    throw new DisabledException("User account is disabled");
                }
                if (!user.isCredentialsNonExpired()) {
                    logger.warn("User found but credentials are expired: {}", username);

                    throw new CredentialsExpiredException("User credentials are expired");
                }

                if (!user.isAccountNonLocked()) {
                    logger.warn("User found but account is locked: {}", username);
                    throw new LockedException("User account is locked");
                }


                if (!user.isAccountNonExpired()) {
                    logger.warn("User found but account is expired: {}", username);
                    try {
                        throw new AccountExpiredException("User account is expired");
                    } catch (AccountExpiredException e) {
                        throw new RuntimeException(e);
                    }
                }
                logger.info("User is valid : {}", username);

                return optionalUser.get();
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider=new DaoAuthenticationProvider();
        try {
            authenticationProvider.setUserDetailsService(userDetailsService());
            authenticationProvider.setPasswordEncoder(passwordEncoder());
        } catch (Exception e) {
            logger.error("Error configuring AuthenticationProvider", e);
            throw new BeanCreationException("Failed to create AuthenticationProvider bean", e);
        }

        return authenticationProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        try {
            return config.getAuthenticationManager();
        } catch (Exception e) {
            logger.error("Could not create AuthenticationManager", e);
            throw e;
        }
    }
}
