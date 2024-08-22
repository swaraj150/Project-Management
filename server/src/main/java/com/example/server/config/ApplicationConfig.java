package com.example.server.config;

import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.AuthenticationException;
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
            public UserDetails loadUserByUsername(String cred) throws UsernameNotFoundException {
                if(cred==null || cred.trim().isEmpty()){
                    logger.error("Attempt to load user details with null or empty credentials");
                    throw new IllegalArgumentException("Username or Email cannot be null or empty");
                }
                logger.info("Attempting to load user details for username: {}", cred);


                Optional<User> optionalUserByUsername=userRepository.findByUsername(cred);
                Optional<User> optionalUserByEmail=userRepository.findByEmail(cred);

                if(optionalUserByUsername.isEmpty() && optionalUserByEmail.isEmpty()){
                    logger.warn("User not found: {}",cred);
                    throw new UsernameNotFoundException("User not found");
                }

                if (optionalUserByUsername.isPresent() && optionalUserByEmail.isPresent()
                        && !optionalUserByUsername.get().equals(optionalUserByEmail.get())) {
                    logger.error("Multiple users found for credential: {}", cred);
                    throw new BadCredentialsException("Multiple users found for the given credential");
                }




                User user=optionalUserByUsername.isEmpty()?optionalUserByEmail.get():optionalUserByUsername.get();

                if (!user.isEnabled()) {
                    logger.warn("User found but is disabled: {}", cred);
                    throw new DisabledException("User account is disabled");
                }
                if (!user.isCredentialsNonExpired()) {
                    logger.warn("User found but credentials are expired: {}", cred);
                    throw new CredentialsExpiredException("User credentials are expired");
                }

                if (!user.isAccountNonLocked()) {
                    logger.warn("User found but account is locked: {}", cred);
                    throw new LockedException("User account is locked");
                }


                if (!user.isAccountNonExpired()) {
                    logger.warn("User found but account is expired: {}", cred);
                    try {
                        throw new AccountExpiredException("User account is expired");
                    } catch (AccountExpiredException e) {
                        throw new RuntimeException(e);
                    }
                }
                logger.info("User is valid : {}", cred);

                return user;
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
