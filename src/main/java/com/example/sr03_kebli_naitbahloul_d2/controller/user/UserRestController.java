package com.example.sr03_kebli_naitbahloul_d2.controller.user;

import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.services.EmailService;
import com.example.sr03_kebli_naitbahloul_d2.services.ServicesRequest;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserRestController {

    @Resource
    private ServicesRequest servicesRequest;

    @Autowired
    private EmailService emailService;

    @GetMapping("/all")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "sortField", defaultValue = "id") String sortField,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir
    ) {
        Page<Users> users;
        if (search != null && !search.isBlank()) {
            users = servicesRequest.searchUsersSorted(search, page, size, sortField, sortDir);
        } else {
            users = servicesRequest.getUsersSorted(page, size, sortField, sortDir);
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        Users user = servicesRequest.getOneUser(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long id) throws IOException {
        Users user = servicesRequest.getOneUser(Math.toIntExact(id));
        byte[] imageBytes;

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (user.getAvatar() != null) {
            imageBytes = user.getAvatar();
        } else {
            ClassPathResource defaultImage = new ClassPathResource("static/img/default-profile.png");
            imageBytes = StreamUtils.copyToByteArray(defaultImage.getInputStream());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }


    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable int id,
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("email") String email,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            HttpSession session
    ) {
        Users existingUser = servicesRequest.getOneUser(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        Integer sessionId = (Integer) session.getAttribute("userId");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        if (sessionId == null || (!sessionId.equals(id) && (isAdmin == null || !isAdmin))) {
            return ResponseEntity.status(403).body("Accès refusé");
        }

        existingUser.setFirstname(firstname);
        existingUser.setLastname(lastname);
        existingUser.setEmail(email);

        // avatar optionnel
        if (avatar != null && !avatar.isEmpty()) {
            try {
                existingUser.setAvatar(avatar.getBytes());
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Erreur lors de l'upload de l'avatar");
            }
        }

        servicesRequest.updateUser(existingUser);
        return ResponseEntity.ok(existingUser);
    }



    private boolean idEqualsOrAdmin(Integer sessionId, int targetId, Boolean isAdmin) {
        return sessionId != null && (sessionId == targetId || Boolean.TRUE.equals(isAdmin));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        emailService.sendEmail(email, "Password reset", "Click this link to reset your password...");
        return ResponseEntity.ok().build();
    }
}
