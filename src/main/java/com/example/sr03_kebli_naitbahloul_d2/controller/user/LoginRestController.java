package com.example.sr03_kebli_naitbahloul_d2.controller.user;

import com.example.sr03_kebli_naitbahloul_d2.dto.LoginRequest;
import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import com.example.sr03_kebli_naitbahloul_d2.services.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class LoginRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Users user = usersRepository.findByEmail(loginRequest.getEmail());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()) && user.isStatus()) {
            sessionService.createSession(session, user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("firstname", user.getFirstname());
            response.put("lastname", user.getLastname());
            response.put("email", user.getEmail());
            response.put("isAdmin", user.isAdmin());
            response.put("avatarUrl", "/api/user/" + user.getId() + "/avatar");

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body("Successfully logged out");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Object idObj = session.getAttribute("userId");
        if (idObj == null) {
            return ResponseEntity.status(401).body("Not connected");
        }

        Long userId;
        try {
            userId = (idObj instanceof Long) ? (Long) idObj : ((Integer) idObj).longValue();
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid session userId type");
        }

        Users user = usersRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Map<String, Object> safeUserData = new HashMap<>();
        safeUserData.put("id", user.getId());
        safeUserData.put("firstname", user.getFirstname());
        safeUserData.put("lastname", user.getLastname());
        safeUserData.put("email", user.getEmail());
        safeUserData.put("isAdmin", user.isAdmin());
        safeUserData.put("avatarUrl", "/api/user/" + user.getId() + "/avatar");

        return ResponseEntity.ok(safeUserData);
    }

}
