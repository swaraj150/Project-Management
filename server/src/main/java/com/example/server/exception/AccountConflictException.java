package com.example.server.exception;

public class AccountConflictException extends RuntimeException {
    public AccountConflictException(String s) {
        super(s);
    }
}
