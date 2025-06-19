package com.example.sr03_kebli_naitbahloul_d2.controller;


import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.services.ServicesRequest;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
public class WebController {

    @Resource
    private ServicesRequest servicesRequest;

    @RequestMapping(value = "/index")
    public String index() {
        return "index";
    }

    @RequestMapping(value = "/users")
    public String users(Model model) {
        model.addAttribute("myusers",servicesRequest.getUsers());
        return "users";
    }

    @RequestMapping(value = "/test_create")
    public String create(){


        Users user = new Users();
        user.setFirstname("Cédric");
        user.setLastname("Martinet");
        user.setEmail("cedric.martinet@utc.fr");
        user.setPassword("monMotDePasse");
       // user.setInvite(0);
        servicesRequest.addUser(user);

        return "users";
    }

    @RequestMapping(value = "/remove_first_test")
    public String remove_test(){
        servicesRequest.deleteFirstUser();
        return "users";
    }



}