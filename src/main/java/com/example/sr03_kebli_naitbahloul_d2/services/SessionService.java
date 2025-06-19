package com.example.sr03_kebli_naitbahloul_d2.services;

import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    @Autowired
    private UsersRepository usersRepository;

    public void createSession(HttpSession session, Users user) {
        session.setAttribute("userId", user.getId());
        session.setAttribute("isAdmin", user.isAdmin());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userFullName", user.getFirstname() + " " + user.getLastname());
    }

    public void clearSession(HttpSession session) {
        session.invalidate();
    }

    public boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("userId") != null;
    }

    public boolean isAdmin(HttpSession session) {
        Boolean admin = (Boolean) session.getAttribute("isAdmin");
        return admin != null && admin;
    }

    public Integer getUserId(HttpSession session) {
        return (Integer) session.getAttribute("userId");
    }

    public Users getCurrentUser(HttpSession session) {
        Integer id = getUserId(session);
        return id != null ? usersRepository.findById(id.longValue()).orElse(null) : null;
    }

    public String getUserFullName(HttpSession session) {
        return (String) session.getAttribute("userFullName");
    }

    public String getUserEmail(HttpSession session) {
        return (String) session.getAttribute("userEmail");
    }
}
