package com.example.server.config;


import com.example.server.component.CustomOAuth2FailureHandler;
import com.example.server.component.CustomOAuth2SuccessHandler;
import com.example.server.entities.TokenBlacklist;
import com.example.server.filters.JwtAuthenticationFilter;
//import com.example.server.filters.RequestLoggingFilter;
//import com.example.server.filters.JwtBlacklistFilter;
import com.example.server.service.CustomOAuth2UserService;
import com.example.server.service.TokenBlacklistService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig{
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    private final JwtBlacklistFilter jwtBlacklistFilter;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
    private final CustomOAuth2FailureHandler customOAuth2FailureHandler;
    private final TokenBlacklistService tokenBlacklistService;
    private final Logger logger= LoggerFactory.getLogger(SecurityConfig.class);
//    private final RequestLoggingFilter requestLoggingFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((auth)-> auth
                            .requestMatchers("/task","/ws","/chat","/api/v1/users/signin","/api/v1/users/google","/api/v1/users/github","/api/v1/users/signup","/oauth2/**", "/login/**","/login").permitAll().anyRequest().authenticated()
                )
                .sessionManagement((session)->session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                        .maximumSessions(1)
                )
                .authenticationProvider(authenticationProvider)
//                .oauth2Login(oauth2->oauth2
//                        .authorizationEndpoint(authorization->authorization
//                                .authorizationRequestRepository(new HttpSessionOAuth2AuthorizationRequestRepository())
//                        )
//                        .successHandler(customOAuth2SuccessHandler)
//                        .failureHandler(customOAuth2FailureHandler)
////                        .defaultSuccessUrl("/")
//
//                )
//                .logout(logout->logout
//                        .logoutUrl("/api/v1/users/logout")
//                        .logoutSuccessHandler((request,response,authentication)->{
//                            logger.info("hit logout");
//                            Authentication authentication1=SecurityContextHolder.getContext().getAuthentication();
//                            SecurityContextHolder.getContext().setAuthentication(null);
//                            SecurityContextHolder.clearContext();
//                            HttpSession session=request.getSession(false);
//                            if (session != null) {
//                                session.invalidate();
//                            }
//                            for(Cookie cookie:request.getCookies()){
//
//                                String cookieName = cookie.getName();
//                                logger.info("cookie name:{}",cookieName);
//                                if(Objects.equals(cookieName, "jwt_token")){
//                                    tokenBlacklistService.addToken(cookie.getValue());
//                                }
//                                Cookie cookieToDelete = new Cookie(cookieName, null);
//                                cookieToDelete.setMaxAge(0);
//                                response.addCookie(cookieToDelete);
//                            }
//                            response.setStatus(HttpStatus.OK.value());
//                            response.getWriter().flush();
//                        })
//                        .invalidateHttpSession(true)
//                        .deleteCookies("jwt_token")
//                        .clearAuthentication(true)
//                )
//                .addFilterBefore(jwtBlacklistFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173","chrome-extension://cbcbkhdmedgianpaifchdaddpnmgnknn")); // Your React app's URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }







}


