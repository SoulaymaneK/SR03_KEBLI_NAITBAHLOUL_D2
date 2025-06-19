package com.example.sr03_kebli_naitbahloul_d2.interceptor;

import com.example.sr03_kebli_naitbahloul_d2.services.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.stereotype.Component;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    @Autowired
    private SessionService sessionService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);

        if (session == null || !sessionService.isLoggedIn(session) || !sessionService.isAdmin(session)) {
            response.sendRedirect("/login");
            return false;
        }

        return true;
    }
}
