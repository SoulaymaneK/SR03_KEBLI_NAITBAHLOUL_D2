package com.example.sr03_kebli_naitbahloul_d2.controller.admin;

import com.example.sr03_kebli_naitbahloul_d2.services.SessionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class UserProfileController {

    @Autowired
    private SessionService sessionService;

    @ModelAttribute
    public void addGlobalAttributes(Model model, HttpSession session) {
        boolean isLoggedIn = sessionService.isLoggedIn(session);
        model.addAttribute("isLoggedIn", isLoggedIn);

        if (isLoggedIn) {
            model.addAttribute("userFullName", sessionService.getUserFullName(session));
            model.addAttribute("userEmail", sessionService.getUserEmail(session));
            model.addAttribute("isAdmin", sessionService.isAdmin(session));
        }
    }
}
