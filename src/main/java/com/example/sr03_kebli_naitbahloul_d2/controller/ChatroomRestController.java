package com.example.sr03_kebli_naitbahloul_d2.controller;

import com.example.sr03_kebli_naitbahloul_d2.dto.ChatroomRequest;
import com.example.sr03_kebli_naitbahloul_d2.dto.UsersDTO;
import com.example.sr03_kebli_naitbahloul_d2.model.Chatroom;
import com.example.sr03_kebli_naitbahloul_d2.model.UserChat;
import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import com.example.sr03_kebli_naitbahloul_d2.services.ServicesRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatroom")
public class ChatroomRestController {

    @Autowired
    private ServicesRequest servicesRequest;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getChatroomDetails(@PathVariable int id) {
        Chatroom chatroom = servicesRequest.getChatroomById(id);
        if (chatroom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(id);
        List<Integer> participantIds = userChats.stream()
                .map(uc -> uc.getUser().getId())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("id", chatroom.getId());
        response.put("channel", chatroom.getChannel());
        response.put("description", chatroom.getDescription());
        response.put("date", chatroom.getDate());
        response.put("lifespan", chatroom.getLifespan());
        response.put("participantIds", participantIds);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/create")
    public ResponseEntity<Chatroom> createChatroom(@RequestBody ChatroomRequest request) {
        Chatroom chatroom = new Chatroom();
        chatroom.setChannel(request.getChannel());
        chatroom.setDescription(request.getDescription());
        chatroom.setDate(request.getDate());
        chatroom.setLifespan(request.getLifespan());

        servicesRequest.addChatroom(chatroom);

        int idInvit = request.getIdInvit();
        Users owner = servicesRequest.getOneUser(idInvit);
        List<Integer> userIds = request.getUserIds();

        for (int userId : userIds) {
            UserChat userChat = new UserChat();
            Users targetUser = servicesRequest.getOneUser(userId);
            userChat.setUser(targetUser);
            userChat.setChatroom(chatroom);

            // 🛠 Si c’est l’owner lui-même → il s’est invité, donc on le marque comme owner
            if (userId == idInvit) {
                userChat.setIdinvit(targetUser); // l’owner s’est invité lui-même → owner
            } else {
                userChat.setIdinvit(owner); // sinon c’est une invitation normale
            }

            servicesRequest.addUserChat(userChat);
        }

        // ✅ Si jamais il ne s’est pas sélectionné, on l’ajoute quand même comme owner
        if (!userIds.contains(idInvit)) {
            UserChat ownerChat = new UserChat();
            ownerChat.setUser(owner);
            ownerChat.setChatroom(chatroom);
            ownerChat.setIdinvit(owner);
            servicesRequest.addUserChat(ownerChat);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(chatroom);
    }



    @GetMapping("/allChatrooms")
    public ResponseEntity<List<Chatroom>> getAllUsersChatrooms(
            @RequestParam(value = "id", required = true) int usersId,
            HttpSession session) {

        Long sessionUserId = (Long) session.getAttribute("userId");
        if (sessionUserId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(servicesRequest.getChatroomsFromUserId(usersId));
    }

    @GetMapping("/myChatrooms")
    public ResponseEntity<List<Map<String, Object>>> getMyChatrooms(@RequestParam int id) {
        List<Chatroom> chatrooms = servicesRequest.getMyChatroomsFromUserId(id);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Chatroom chatroom : chatrooms) {
            List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(chatroom.getId());

            // Le propriétaire est celui dont l'id == idinvit.id
            int ownerId = userChats.stream()
                    .filter(uc -> uc.getUser().getId() == uc.getIdinvit().getId())
                    .map(uc -> uc.getUser().getId())
                    .findFirst()
                    .orElse(-1);

            Map<String, Object> chatroomData = new HashMap<>();
            chatroomData.put("id", chatroom.getId());
            chatroomData.put("channel", chatroom.getChannel());
            chatroomData.put("description", chatroom.getDescription());
            chatroomData.put("date", chatroom.getDate());
            chatroomData.put("lifespan", chatroom.getLifespan());
            chatroomData.put("ownerId", ownerId);

            response.add(chatroomData);
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/invitedChatrooms")
    public ResponseEntity<List<Map<String, Object>>> getInvitedUsersChatrooms(
            @RequestParam(value = "id") int usersId) {

        List<Chatroom> chatrooms = servicesRequest.getInvitedChatroomsFromUserId(usersId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Chatroom chatroom : chatrooms) {
            List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(chatroom.getId());

            int ownerId = userChats.stream()
                    .filter(uc -> uc.getUser().getId() == uc.getIdinvit().getId())
                    .map(uc -> uc.getUser().getId())
                    .findFirst()
                    .orElse(-1);

            Map<String, Object> chatroomData = new HashMap<>();
            chatroomData.put("id", chatroom.getId());
            chatroomData.put("channel", chatroom.getChannel());
            chatroomData.put("description", chatroom.getDescription());
            chatroomData.put("date", chatroom.getDate());
            chatroomData.put("lifespan", chatroom.getLifespan());
            chatroomData.put("ownerId", ownerId);

            response.add(chatroomData);
        }

        return ResponseEntity.ok(response);
    }


    /*@DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOrLeaveChatroom(@PathVariable int id, HttpSession session) {
        Object sessionUserObj = session.getAttribute("userId");
        if (sessionUserObj == null) {
            return ResponseEntity.status(401).build();
        }
        int sessionUserId = (sessionUserObj instanceof Integer) ? (Integer) sessionUserObj : ((Long) sessionUserObj).intValue();

        Chatroom chatroom = servicesRequest.getChatroomById(id);
        if (chatroom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chatroom not found");
        }

        List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(id);
        boolean isOwner = userChats.stream().anyMatch(
                uc -> uc.getUser().getId() == sessionUserId && uc.getIdinvit().getId() == sessionUserId
        );

        if (isOwner) {
            servicesRequest.deleteUserChatsByChatroom(id);
            servicesRequest.deleteChatroom(id);
            return ResponseEntity.ok("Chatroom deleted by owner");
        } else {
            servicesRequest.removeUserFromChatroom((int) sessionUserId, id);
            return ResponseEntity.ok("User removed from chatroom");
        }
    }*/
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteChatroomIfOwner(@PathVariable int id, HttpSession session) {
        Object sessionUserObj = session.getAttribute("userId");
        if (sessionUserObj == null) return ResponseEntity.status(401).build();
        int sessionUserId = (sessionUserObj instanceof Integer) ? (Integer) sessionUserObj : ((Long) sessionUserObj).intValue();

        Chatroom chatroom = servicesRequest.getChatroomById(id);
        if (chatroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chatroom not found");

        List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(id);
        boolean isOwner = userChats.stream().anyMatch(
                uc -> uc.getUser().getId() == sessionUserId && uc.getIdinvit().getId() == sessionUserId
        );

        if (!isOwner) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not owner");

        servicesRequest.deleteUserChatsByChatroom(id);
        servicesRequest.deleteChatroom(id);
        return ResponseEntity.ok("Chatroom deleted by owner");
    }

    @DeleteMapping("/quit/{id}")
    public ResponseEntity<String> quitChatroom(@PathVariable int id, HttpSession session) {
        Object sessionUserObj = session.getAttribute("userId");
        if (sessionUserObj == null) return ResponseEntity.status(401).build();
        int sessionUserId = (sessionUserObj instanceof Integer) ? (Integer) sessionUserObj : ((Long) sessionUserObj).intValue();

        Chatroom chatroom = servicesRequest.getChatroomById(id);
        if (chatroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chatroom not found");

        List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(id);
        boolean isInvitedBySelf = userChats.stream().anyMatch(
                uc -> uc.getUser().getId() == sessionUserId && uc.getIdinvit().getId() == sessionUserId
        );

// Si l’utilisateur apparaît une seule fois et est le seul invité par lui-même, alors c’est un owner
        boolean isOwner = userChats.stream()
                .filter(uc -> uc.getUser().getId() == sessionUserId)
                .count() == 1 && isInvitedBySelf;


        if (userChats.size() == 1 && userChats.get(0).getIdinvit().getId() == sessionUserId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Owner must delete");
        }

        servicesRequest.removeUserFromChatroom(sessionUserId, id);
        return ResponseEntity.ok("User left the chatroom");
    }


    @GetMapping("/searchUsers")
    public ResponseEntity<List<UsersDTO>> searchUsers
            (@RequestParam(value = "search", required = true) String search) {
        List<Users> res = servicesRequest.searchUsers(search);
        List<UsersDTO> listUsersDTO = new ArrayList<>();

        for (Users user : res) {
            if (!user.isAdmin()) {
                UsersDTO uDTO = new UsersDTO();
                uDTO.setId(user.getId());
                uDTO.setLastname(user.getLastname());
                uDTO.setFirstname(user.getFirstname());
                listUsersDTO.add(uDTO);
            }
        }
        return ResponseEntity.ok(listUsersDTO);
    }

   @PutMapping("/update/{id}")
   public ResponseEntity<?> updateChatroom(@PathVariable int id, @RequestBody ChatroomRequest chatroomRequest, HttpSession session) {
        Object sessionUserObj = session.getAttribute("userId");
        if (sessionUserObj == null) {
            return ResponseEntity.status(401).body("Not connected");
        }
        int sessionUserId = (sessionUserObj instanceof Integer) ? (Integer) sessionUserObj : ((Long) sessionUserObj).intValue();

        // Vérification que l’utilisateur est le créateur
        List<UserChat> userChats = servicesRequest.getUserChatsByChatroomId(id);
        boolean isOwner = userChats.stream().anyMatch(
                uc -> uc.getUser().getId() == sessionUserId && uc.getIdinvit().getId() == sessionUserId
        );

        if (!isOwner) {
            return ResponseEntity.status(403).body("Only the owner can modify this chatroom");
        }

        Chatroom existingChatroom = servicesRequest.getChatroomById(id);
        if (existingChatroom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chatroom not found");
        }

        // 1. Mise à jour des infos du salon
        existingChatroom.setChannel(chatroomRequest.getChannel());
        existingChatroom.setDescription(chatroomRequest.getDescription());
        existingChatroom.setLifespan(chatroomRequest.getLifespan());
        servicesRequest.updateChatroom(existingChatroom);

        // 2. Récupérer les UserChat existants
        List<UserChat> existingUserChats = servicesRequest.getUserChatsByChatroomId(id);
        List<Integer> existingUserIds = new ArrayList<>();
        for (UserChat uc : existingUserChats) {
            existingUserIds.add(uc.getUser().getId());
        }

        // 3. Supprimer les utilisateurs décochés
        List<Integer> updatedUserIds = chatroomRequest.getUserIds();
        if (updatedUserIds == null || updatedUserIds.isEmpty()){
            return ResponseEntity.badRequest().body("A chatroom must have at least one participant.");
        }

        for (UserChat uc : existingUserChats) {
            int existingId = uc.getUser().getId();
            if (!updatedUserIds.contains(existingId)) {
                servicesRequest.removeUserFromChatroom(existingId, id);
            }
        }

        // 4. Ajouter les nouveaux utilisateurs
        int idInvit = chatroomRequest.getIdInvit();
        Users invitateur = servicesRequest.getOneUser(idInvit);

        for (Integer userId : updatedUserIds) {
           if (!existingUserIds.contains(userId)) {
               UserChat userChat = new UserChat();
               userChat.setChatroom(existingChatroom);
               Users targetUser = servicesRequest.getOneUser(userId);
               userChat.setUser(targetUser);

               // 🛠 Si l'utilisateur ajouté est le créateur → il est owner
               if (targetUser.getId() == sessionUserId) {
                   userChat.setIdinvit(targetUser);
               } else {
                   userChat.setIdinvit(invitateur);
               }

               servicesRequest.addUserChat(userChat);
           }
        }


       return ResponseEntity.ok("Chatroom updated successfully with participant changes.");
    }


    @PostMapping("/acceptInvitation/{chatroomId}")
    public ResponseEntity<?> acceptInvitation(@PathVariable int chatroomId, HttpSession session) {
        Object sessionUserObj = session.getAttribute("userId");
        if (sessionUserObj == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        int userId;
        try {
            userId = (sessionUserObj instanceof Integer) ? (Integer) sessionUserObj : ((Long) sessionUserObj).intValue();
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid session userId type");
        }

        // Récupérer l'entrée UserChat
        UserChat userChat = servicesRequest.getUserChatByUserAndChatroom(userId, chatroomId);
        if (userChat == null) {
            return ResponseEntity.status(404).body("Invitation not found");
        }

        // ⚠️ Marquer l’invitation comme acceptée → idinvit = user lui-même
        Users user = servicesRequest.getOneUser(userId);
        userChat.setIdinvit(user); // ✅ L’utilisateur s’est "auto-validé"
        servicesRequest.updateUserChat(userChat);

        return ResponseEntity.ok("Invitation accepted");
    }


    @DeleteMapping("/invitation/refuse")
    public ResponseEntity<String> refuseInvitation(
            @RequestParam int userId,
            @RequestParam int chatroomId) {

        servicesRequest.removeUserFromChatroom(userId, chatroomId);
        return ResponseEntity.ok("Invitation refused and removed");
    }




}

