package com.carecompanion.backendspringboot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    // Use get request for now to test
    @GetMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {
        if (username.equals("admin") && password.equals("admin")) {
            return "Welcome Admin";
        }
        return "Wrong username or password";
    }
}
