package com.example.server.service;


import com.example.server.entities.User;
import com.example.server.exception.InvalidTokenException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.ResetPasswordRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final UserDetailsService userDetailsService;

    private final UserService userService;
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



    public void resetPassword(@NonNull String token,@NonNull String password){

        User user = userRepository.findByResetPasswordToken(token).orElseThrow(()->new EntityNotFoundException("User not found"));

        if(!user.getResetPasswordTokenExpiry().isAfter(LocalDateTime.now())){
            throw new InvalidTokenException("The provided token is invalid or has expired");
        }
        user.setPassword(passwordEncoder.encode(password));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }
    public void resetPassword(@NonNull ResetPasswordRequest request){
        if(request.getCode()!=null){
            resetPassword(request.getCode(),request.getNewPassword());
        }
        User user=userService.loadAuthenticatedUser();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getCredentials()!=null){
            if(authentication.getCredentials().equals(request.getCurrentPassword())){
                throw new UnauthorizedAccessException("Current and Provided passwords don't match");
            }
        }
        else{
            throw new RuntimeException("auth null");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }



}
