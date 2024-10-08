package com.example.server.service;


import com.example.server.entities.User;
import com.example.server.exception.InvalidTokenException;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    @Value("${reset-password-url}")
    private String resetPasswordUrl;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    // email service
    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }
    public void requestPasswordReset(String email){
        Optional<User> optionalUser=userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        User user=optionalUser.get();
        String token=generateResetToken();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        String text="Verify your email by clicking on this link\n"+resetPasswordUrl+token;
        emailService.sendMail(email,"Reset Password",text);
    }



    public void resetPassword(String token,String password){
        if(token==null || password==null){
            throw new IllegalArgumentException("password and token cannot be null");
        }
        Optional<User> optionalUser = userRepository.findByResetPasswordToken(token);
        if(optionalUser.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        User user=optionalUser.get();
        if(!user.getResetPasswordTokenExpiry().isAfter(LocalDateTime.now())){
            throw new InvalidTokenException("The provided token is invalid or has expired");
        }
        user.setPassword(passwordEncoder.encode(password));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }



}
