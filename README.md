# Backend – Application de Chat (Whispy)
  👉 [Accéder au README du frontend](https://github.com/SoulaymaneK/SR03_KEBLI_NAITBAHLOUL_D2/blob/main/frontend/README.md)


## 🎯 Introduction

Ce backend constitue le cœur métier d’une application de salons de discussion en temps réel. Il est développé avec **Spring Boot** et expose des **API REST** pour l’authentification, la création de salons, l’invitation d’utilisateurs, ainsi que la gestion des participations.  
Il intègre également un **serveur WebSocket personnalisé** pour permettre l’échange de messages en direct entre utilisateurs connectés.  
📌 Conformément au cahier des charges, **aucun message n’est stocké** dans la base de données.

---

## 🧰 Technologies principales

- **Java 17**, **Spring Boot**
- **Spring Web / REST** : endpoints HTTP
- **Spring Data JPA** : accès base de données
- **WebSocket natif (TextWebSocketHandler)** : chat temps réel
- **Spring Security** : gestion des sessions et accès
- **Thymeleaf** : interface admin côté serveur

---

## ✨ Fonctionnalités

- 🔐 Authentification avec session
- 🧠 Création, modification, suppression de salons
- 📩 Invitations à des salons
- 💬 Échange de messages en direct via WebSocket
- 🛡️ Rôles utilisateur/admin
- 🖥️ Interface d’administration (Thymeleaf)

---

## 🧩 Modèle de données

- **Users** : id, nom, prénom, email, mot de passe, admin
- **Chatroom** : id, titre, description, date, durée, owner
- **UserChat** : lien many-to-many User ↔ Chatroom
- **Messages** : non stockés (temps réel uniquement)

---

## 🔄 Architecture & Composants

- **API REST** :
  - `/api/login`, `/api/register`, `/api/utilisateurs`
  - `/api/canaux`, `/api/invitations`
  - JSON uniquement
- **WebSocket** :
  - URL : `ws://localhost:8080/chat/{canalId}/{pseudo}`
  - Diffusion directe aux participants du salon
- **Interface Admin** :
  - Accessible uniquement aux admins
  - Gestion des utilisateurs (Thymeleaf + Spring MVC)

---

## 🚀 Installation & Lancement

### Prérequis

- Java 17
- Maven

### Étapes

```bash
git clone https://gitlab.utc.fr/keblisou/sr03_kebli_naitbahloul_d2/-/new/main
cd main
mvn spring-boot:run ou ./mvnw spring-boot:run
```

API disponible sur : http://localhost:8080

--- 

## 🧪 Tests en conditions réelles

- Créez plusieurs comptes via le frontend ou Postman
- Connectez-vous avec deux navigateurs
- Créez un salon, invitez un autre utilisateur
- Rejoignez le même salon
- Échangez des messages : ils s’affichent en temps réel dans les deux fenêtres

---

## 🔐 Sécurité

- Connexion avec session HTTP
- Rôles : utilisateur normal / admin
- Accès aux pages admin restreint
- Contrôles côté serveur + protections dans l’UI

---

## 🌿 Éco-index & éco-conception

**Score EcoIndex : B (77/100)**

### 🔎 Raisons du bon score

- Interface légère (peu d’images lourdes)
- Utilisation de Tailwind CSS avec purge automatique
- Application en SPA : aucune recharge de page complète

### 📈 Pistes d’amélioration

- Mise en place de **lazy loading** sur les composants volumineux
- Activation de la **compression** et **mise en cache** des ressources HTTP
- Chargement local des **polices web** pour limiter les requêtes externes
