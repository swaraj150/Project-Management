package com.example.server.component;


import com.example.server.exception.InvalidPasswordException;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidator {
    private final UserRepository userRepository;
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$";


    public void validateRegisterRequest(RegisterRequest registerRequest) {
        validateEmail(registerRequest.getEmail());
        validatePassword(registerRequest.getPassword());
        validateUsername(registerRequest.getUsername());


    }

    private void validateEmail(String email) {
        if (email == null || !email.matches(EMAIL_REGEX)) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateKeyException("Email is already in use");
        }
    }

    private void validatePassword(String password) {
        if (password == null || !password.matches(PASSWORD_REGEX)) {
            throw new InvalidPasswordException("Password does not meet the required criteria");
        }
    }

    private void validateUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new DuplicateKeyException("Username is already taken");
        }
    }
}
