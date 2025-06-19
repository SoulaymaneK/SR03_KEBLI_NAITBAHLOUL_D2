package com.example.sr03_kebli_naitbahloul_d2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatroom")
public class Chatroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="channel")
    private String channel;

    @Column(name="description")
    private String description;

    @Column(name = "date")
    private LocalDateTime date;  // Utilisation de LocalDateTime pour les dates

    @Column(name = "lifespan")
    private Integer lifespan;

    // Getters et Setters

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}

    public String getChannel() {return channel;}

    public void setChannel(String channel) {this.channel = channel;}

    public String getDescription() {return description;}

    public void setDescription(String description) {this.description = description;}

    public LocalDateTime getDate() {return date;}

    public void setDate(LocalDateTime date) {this.date = date;}

    public Integer getLifespan() {return lifespan;}

    public void setLifespan(Integer lifespan) {this.lifespan = lifespan;}
}
