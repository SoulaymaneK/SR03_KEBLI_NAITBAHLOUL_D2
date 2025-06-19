package com.example.sr03_kebli_naitbahloul_d2.controller;


import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.services.EmailService;
import com.example.sr03_kebli_naitbahloul_d2.services.ServicesRequest;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ApiController {

    @Autowired
    private EmailService emailService;

    @Resource
    private ServicesRequest servicesRequest;


    @PostMapping(value = "/create")
    public void create(){
        Users user = new Users();
        user.setFirstname("Cédric");
        user.setLastname("Martinet");
        user.setEmail("cedric.martinet@utc.fr");
        servicesRequest.addUser(user);
    }

    @GetMapping(value = "/liste")
    public List<Users> getUsers(){
        return servicesRequest.getUsers();
    }

    @GetMapping(value = "/testmail")
    public ResponseEntity<String> testMail(@RequestParam String email) {
        emailService.sendEmail(email, "Test SR03", "<strong>Bonjour !</strong> Ceci est un test.");
        return ResponseEntity.ok("Email envoyé !");
    }


}
