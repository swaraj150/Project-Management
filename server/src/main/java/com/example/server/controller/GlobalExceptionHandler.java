package com.example.server.controller;

import com.example.server.exception.InvalidPasswordException;
import com.example.server.exception.InvalidTokenException;
import com.example.server.exception.OrganizationNotFoundException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.response.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<?> handleInvalidTokenException(InvalidTokenException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","400");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);


    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<?> handleInvalidPasswordException(InvalidPasswordException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","400");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","400");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","401");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> handleDisabledException(DisabledException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","403");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<?> handleSecurityException(SecurityException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","401");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","500");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","404");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","404");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<?> handleUnauthorizedAccessException(UnauthorizedAccessException e) {
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","403");
        h.put("error",e.getMessage());
        return ResponseEntity.ok(h);
    }


}
