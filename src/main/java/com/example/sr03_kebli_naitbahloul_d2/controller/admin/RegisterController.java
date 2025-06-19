package com.example.sr03_kebli_naitbahloul_d2.controller.admin;

import com.example.sr03_kebli_naitbahloul_d2.dto.RegisterRequest;
import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
public class RegisterController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String RegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public String RegisterPost(
            @ModelAttribute("registerRequest") RegisterRequest request,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            Model model
    ) {
        if (usersRepository.findByEmail(request.getEmail()) != null) {
            model.addAttribute("error", "Email déjà utilisé.");
            return "register";
        }

        Users newUser = new Users();
        newUser.setFirstname(request.getFirstname());
        newUser.setLastname(request.getLastname());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setAdmin(false);  // ou true selon le rôle à créer
        newUser.setStatus(true);

        try {
            if (avatar != null && !avatar.isEmpty()) {
                newUser.setAvatar(avatar.getBytes());
            } else {
                ClassPathResource defaultImg = new ClassPathResource("static/img/default-profile.png");
                newUser.setAvatar(defaultImg.getInputStream().readAllBytes());
            }
        } catch (IOException e) {
            model.addAttribute("error", "Erreur lors du chargement de l'image.");
            return "register";
        }

        usersRepository.save(newUser);
        return "redirect:/admin";
    }
}
