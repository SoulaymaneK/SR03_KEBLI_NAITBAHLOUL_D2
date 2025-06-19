package com.example.sr03_kebli_naitbahloul_d2.controller.user;

import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
public class RegisterRestController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value="avatar", required = false) MultipartFile avatar
    ) {
        // Vérifier si email déjà utilisé
        if (usersRepository.findByEmail(email) != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email address already in use.");
        }

        Users newUser = new Users();
        newUser.setFirstname(firstname);
        newUser.setLastname(lastname);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setAdmin(false);  // Toujours false pour les users normaux
        newUser.setStatus(true);  // actif par défaut

        try {
            if (avatar != null && !avatar.isEmpty()) {
                newUser.setAvatar(avatar.getBytes());
            } else {
                ClassPathResource defaultImg = new ClassPathResource("static/img/default-profile.png");
                newUser.setAvatar(defaultImg.getInputStream().readAllBytes());
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to read avatar");

        }

        usersRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }
}
