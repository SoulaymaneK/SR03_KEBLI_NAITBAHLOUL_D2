package com.example.sr03_kebli_naitbahloul_d2.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


@Service
public class EmailService {
    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String username;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendEmail(String to, String subject, String message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(username);
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);

        emailSender.send(email);
    }
}
