# Frontend – Application de Chat (Whispy)

## 🎯 Introduction

Ce projet est l’interface web d’une application de salons de discussion en temps réel. Chaque utilisateur peut planifier un salon à une date et durée précises, inviter d’autres utilisateurs, et échanger en direct par messagerie instantanée.

L’interface est développée en **React** et communique avec un backend **Spring Boot** via des **API REST** et une **connexion WebSocket** personnalisée.  
📌 Aucun message n’est stocké : seuls les utilisateurs connectés au salon en cours reçoivent les messages échangés.

---

## 🧰 Technologies principales

- **React 18** : SPA moderne et fluide
- **React Router DOM** : gestion des pages (login, tableau de bord, chat...)
- **Axios** : requêtes HTTP vers le backend
- **Tailwind CSS** : design responsive pastel, inspiré de Messenger/Signal
- **WebSocket API (natif)** : échanges temps réel sans STOMP/Socket.io

---

## ✨ Fonctionnalités

- 🔐 **Inscription / Connexion sécurisées**
- 🧠 **Création et gestion de salons** : titre, description, date, durée
- 📩 **Invitation d’utilisateurs** : à la création ou modification d’un salon
- 📋 **Tableau de bord** : salons créés, salons rejoints, invitations reçues
- 💬 **Messagerie en temps réel** via WebSocket
- 📱 **Interface responsive** : desktop & mobile

---

## 🏗️ Architecture générale

- Les **API REST** permettent :
  - Authentification
  - Création et gestion des salons
  - Gestion des participants

- La **connexion WebSocket** :
  - Est établie à l’ouverture d’un salon
  - Permet d’envoyer/recevoir les messages instantanément

Le frontend est totalement dépendant du backend pour la logique métier. Les deux partagent le même modèle de données (utilisateurs, salons...).

---

## 🧩 Modèle de données (côté backend)

- **Users** : id, nom, prénom, email, mot de passe, booléen `admin`
- **Chatroom** : id, titre, description, date, durée, propriétaire
- **UserChat** : jointure (utilisateur ↔ salon)
- **Messages** : non stockés (temps réel uniquement)

---

## 🔄 Interaction React ↔ Backend

- **API REST** :
  - `POST /api/login`, `POST /api/register`
  - `POST /api/chats`, `GET /api/users/{id}/chats`, etc.

- **WebSocket** :
  - Connexion via `ws://localhost:8080/chat/{idSalon}/{pseudo}`
  - Envoi & réception des messages instantanés
  - Écouteur `onmessage` côté React

- **UI dynamique** :
  - Mise à jour automatique des vues en fonction du state
  - Gestion des erreurs (login invalide, accès refusé, etc.)

---

## 🚀 Installation et lancement en local

### 🔧 Prérequis

- Node.js (v14+ recommandé)
- npm ou Yarn

### 🛠️ Étapes


### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-repo/frontend.git
cd frontend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm start
```

## 🧪 Tests en conditions réelles

L’application sera accessible sur : [http://localhost:3000](http://localhost:3000)  
Le backend Spring Boot doit être lancé sur : [http://localhost:8080](http://localhost:8080)

### Étapes de test

- Créez plusieurs comptes utilisateurs
- Ouvrez deux navigateurs différents (ou une fenêtre de navigation privée)
- Connectez chaque compte avec des identifiants différents
- Rejoignez un même salon de discussion
- Échangez des messages : ils doivent s’afficher instantanément sur les deux interfaces

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
