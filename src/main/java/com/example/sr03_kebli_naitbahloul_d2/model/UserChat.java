package com.example.sr03_kebli_naitbahloul_d2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_chat")
public class UserChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iduc")
    private int iduc;

    @ManyToOne
    @JoinColumn(name = "idu")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "idc")
    private Chatroom chatroom;

    @ManyToOne
    @JoinColumn(name = "idinvit")
    private Users idinvit;

    // Getters et Setters

    public int getIduc() {return iduc;}

    public Users getUser() {return user;}

    public void setUser(Users user) {this.user = user;}

    public Chatroom getChatroom() {return chatroom;}

    public void setChatroom(Chatroom chatroom) {this.chatroom = chatroom;}

    public Users getIdinvit() {
        return idinvit;
    }

    public void setIdinvit(Users user) {this.idinvit = user;}
}
