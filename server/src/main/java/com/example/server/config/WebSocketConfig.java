package com.example.server.config;

import com.example.server.component.MyWebSocketHandler;
import com.example.server.component.WebSocketHandshakeInterceptor;
import com.example.server.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Objects;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
//    private final WebSocketHandshakeInterceptor webSocketHandshakeInterceptor;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue","/topic","/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws","/chat","/task")
                .setAllowedOrigins("*");
//                .setHandshakeHandler(new DefaultHandshakeHandler())
//                .addInterceptors(webSocketHandshakeInterceptor);
//                .withSockJS();
    }
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
//                log.info("Headers: {}", accessor);

                assert accessor != null;
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                    assert authorizationHeader != null;
                    String token = authorizationHeader.substring(7);

                    String username = jwtService.extractUsername(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    accessor.setUser(usernamePasswordAuthenticationToken);
                    if(accessor.getUser()!=null){
                        log.info("user connected : {}",accessor.getUser().getName());
                    }
                    else{
                        log.warn("accessor user is null");
                    }
                }
                else {
                    Principal user = accessor.getUser();

                    if(user==null){
                        log.warn("No valid user in accessor: {}", user);
                        throw new RuntimeException("User is null");
                    }else{
                        log.info("principal user :{}",user.getName());
                        log.info("instanceof :{}",user.getClass().getName());
                        try {
                            UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) user;
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            log.info("here after setting it :{}",SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                        } catch (Exception e) {
                            log.error("Error setting authentication in SecurityContext: ", e);

                        }

                    }
                }

                return message;
            }


        });

    }

    @Bean
    WebSocketHandler webSocketHandler(){
        return new MyWebSocketHandler();
    }
}