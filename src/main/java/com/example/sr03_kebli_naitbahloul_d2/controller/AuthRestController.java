package com.example.sr03_kebli_naitbahloul_d2.controller;

import com.example.sr03_kebli_naitbahloul_d2.dto.LoginRequest;
import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import com.example.sr03_kebli_naitbahloul_d2.services.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class AuthRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());


        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            sessionService.createSession(session, user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("email", user.getEmail());
            response.put("isAdmin", user.isAdmin());
            response.put("name", user.getFirstname() + " " + user.getLastname());
            response.put("id", user.getId());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
