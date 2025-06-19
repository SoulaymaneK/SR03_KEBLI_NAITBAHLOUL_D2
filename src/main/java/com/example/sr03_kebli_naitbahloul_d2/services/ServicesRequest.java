package com.example.sr03_kebli_naitbahloul_d2.services;


import com.example.sr03_kebli_naitbahloul_d2.model.Chatroom;
import com.example.sr03_kebli_naitbahloul_d2.model.UserChat;
import com.example.sr03_kebli_naitbahloul_d2.model.Users;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import com.example.sr03_kebli_naitbahloul_d2.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class ServicesRequest {

    @PersistenceContext
    EntityManager em;

    @Autowired
    private UsersRepository usersRepository;

    // Recherche par nom ou prénom
    public Page<Users> searchUsers(String search, int page, int size) {
        // PageRequest pour la pagination
        PageRequest pageRequest = PageRequest.of(page, size);

        // Requête personnalisée pour rechercher le prénom ou le nom
        return usersRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(search, search, pageRequest);
    }

    public List<Users> searchUsers(String search) {
        return usersRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(search, search);
    }

    // Recherche de tous les utilisateurs avec pagination (sans critère de recherche)
    public Page<Users> getUsers(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return usersRepository.findAll(pageRequest);
    }

    // Pour obtenir le nombre total de pages pour la pagination sans recherche
    public int getTotalPages(int size) {
        long totalUsers = usersRepository.count();
        return (int) Math.ceil((double) totalUsers / size);
    }

    // Pour obtenir le nombre total de pages pour la recherche avec critère
    public int getTotalPagesForSearch(String search, int size) {
        long totalUsers = usersRepository.countByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(search, search);
        return (int) Math.ceil((double) totalUsers / size);
    }

    public void addUser(Users user){
        em.persist(user);
    }

    public void addChatroom(Chatroom chatroom){
        em.persist(chatroom);
    }

   public List<Chatroom> getChatroomsFromUserId(int userId) {
        return em.createQuery(
                        "SELECT uc.chatroom FROM UserChat uc WHERE uc.user.id = :userId",
                        Chatroom.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public List<Map<String, Object>> getChatroomsWithOwnerInfo(int userId) {
        List<UserChat> userChats = em.createQuery("SELECT uc FROM UserChat uc WHERE uc.user.id = :userId", UserChat.class)
                .setParameter("userId", userId)
                .getResultList();

        return userChats.stream().map(uc -> {
            Chatroom chat = uc.getChatroom();
            Map<String, Object> map = new HashMap<>();
            map.put("id", chat.getId());
            map.put("channel", chat.getChannel());
            map.put("description", chat.getDescription());
            map.put("date", chat.getDate());
            map.put("lifespan", chat.getLifespan());
            map.put("ownerId", uc.getIdinvit().getId()); // Important pour test côté React
            return map;
        }).toList();
    }


    public List<Chatroom> getMyChatroomsFromUserId(int userId) {
        return em.createQuery(
                        "SELECT uc.chatroom FROM UserChat uc WHERE uc.idinvit.id = :userId",
                        Chatroom.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public List<Chatroom> getInvitedChatroomsFromUserId(int userId) {
        return em.createQuery(
                        "SELECT uc.chatroom FROM UserChat uc " +
                                "WHERE uc.user.id = :userId AND uc.idinvit.id <> :userId",
                        Chatroom.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public void deleteChatroom(int chatroomId){
        em.remove(em.find(Chatroom.class, chatroomId));
    }




    public void addUserChat(UserChat userChat){
        em.persist(userChat);
    }

    public void updateUser(Users user){
        em.merge(user);
    }

    public Users getOneUser(int id){
        //return un user via la clé primaire
        return em.find(Users.class, id);
    }

    public void deleteOneUser(int id){
        //return un user via la clé primaire
        em.remove(em.find(Users.class, id));
    }

    @SuppressWarnings("unchecked")
    public List<Users> getUsers(){
        Query q = em.createQuery("select u from Users u");
        return q.getResultList();
    }

    public void deleteFirstUser() {
        Users firstUser = em.createQuery("SELECT u FROM Users u ORDER BY u.id ASC", Users.class)
                .setMaxResults(1)
                .getSingleResult();

        if (firstUser != null) {
            em.remove(firstUser);
        }
    }

    // Récupère tous les utilisateurs avec tri (sans recherche)
    public Page<Users> getUsersSorted(int page, int size, String sortField, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return usersRepository.findAll(pageRequest);
    }

    // Recherche avec tri (par prénom, nom ou email)
    public Page<Users> searchUsersSorted(String search, int page, int size, String sortField, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return usersRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, search, pageRequest);
    }

    public void updateChatroom(Chatroom chatroom) {
        em.merge(chatroom);
    }

    public Chatroom getChatroomById(int id) {
        return em.find(Chatroom.class, id);
    }

    public void deleteUserChatsByChatroom(int chatroomId) {
        em.createQuery("DELETE FROM UserChat uc WHERE uc.chatroom.id = :id")
                .setParameter("id", chatroomId)
                .executeUpdate();
    }

    public List<UserChat> getUserChatsByChatroomId(int chatroomId) {
        return em.createQuery("SELECT uc FROM UserChat uc WHERE uc.chatroom.id = :id", UserChat.class)
                .setParameter("id", chatroomId)
                .getResultList();
    }

    public void removeUserFromChatroom(int userId, int chatroomId) {
        em.createQuery("DELETE FROM UserChat uc WHERE uc.user.id = :userId AND uc.chatroom.id = :chatroomId")
                .setParameter("userId", userId)
                .setParameter("chatroomId", chatroomId)
                .executeUpdate();
    }


    public UserChat getUserChatByUserAndChatroom(int userId, int chatroomId) {
        List<UserChat> all = getUserChatsByChatroomId(chatroomId);
        for (UserChat uc : all) {
            if (uc.getUser().getId() == userId) {
                return uc;
            }
        }
        return null;
    }

    public void updateUserChat(UserChat userChat) {
        em.merge(userChat);
    }



}
