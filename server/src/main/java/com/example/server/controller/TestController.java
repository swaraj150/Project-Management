package com.example.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class TestController {
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/")
    public String home() {
        return "home";
    }
}
