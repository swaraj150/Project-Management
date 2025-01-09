package com.example.server.exception;

public class InvalidDependencyException extends RuntimeException {
  public InvalidDependencyException(String message) {
    super(message);
  }
}
