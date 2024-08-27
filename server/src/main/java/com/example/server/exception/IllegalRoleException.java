package com.example.server.exception;

public class IllegalRoleException extends RuntimeException{
    public IllegalRoleException(String message) {
        super(message);
    }
}
