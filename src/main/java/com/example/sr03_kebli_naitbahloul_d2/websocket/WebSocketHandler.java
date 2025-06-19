package com.example.sr03_kebli_naitbahloul_d2.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jboss.logging.Logger;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WebSocketHandler extends TextWebSocketHandler {

    private final String nameChat;
    private final Logger logger = Logger.getLogger(WebSocketHandler.class.getName());
    private final HashMap<String, List<WebSocketSession>> sessions;
    //  private final HashMap<String, List<MessageSocket>> messageSocketsHistory;

    public WebSocketHandler(String nameChat) {
        this.nameChat = nameChat;
        // this.messageSocketsHistory = new HashMap<>();
        this.sessions = new HashMap<>();
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        String receivedMessage = (String) message.getPayload();
        MessageSocket messageSocket = mapper.readValue(receivedMessage, MessageSocket.class);
        String roomName = getRoomName(session);
        List<MessageSocket> listMessage;

        /*//Pour stocker le message dans l'historique
        if (messageSocketsHistory.containsKey(roomName)) {
            listMessage = messageSocketsHistory.get(roomName);
        } else {
            listMessage = new ArrayList<>();
        }
        listMessage.add(messageSocket);
        messageSocketsHistory.put(roomName, listMessage);*/
        //messageSocketsHistory.add(messageSocket);

        //Envoi du message à tous les connectés
        this.broadcast(roomName, messageSocket.getUser() + " : " + messageSocket.getMessage());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        HttpSession httpSession = (HttpSession) session.getAttributes().get("HTTP.SESSION");
       // String userName = "default";
        String userName = getuserName(session);

        if (httpSession != null) {
            Object userId = httpSession.getAttribute("userId");
            if (userId != null) {
                userName = userId.toString();
            }
        }

        String roomName = getRoomName(session);

        List<WebSocketSession> listSessions;
        if (sessions.containsKey(roomName)) {
            listSessions = sessions.get(roomName);
        } else {
            listSessions = new ArrayList<>();
        }

        if (!listSessions.isEmpty()) this.broadcast(roomName, userName + " vient de se connecter !");
        listSessions.add(session);
        sessions.put(roomName, listSessions);

        /* //J'affiche l'historique du salon
        for(MessageSocket messageSocket : messageSocketsHistory){
            session.sendMessage(new TextMessage(messageSocket.getUser()+ " : " + messageSocket.getMessage()));
        }*/

        logger.info(userName + " vient de se connecter sur " + roomName);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws IOException {
        String roomName = getRoomName(session);
        String userName = getuserName(session);
        List<WebSocketSession> listSession = sessions.get(roomName);
        listSession.remove(session);
        if (listSession.isEmpty()) {
            sessions.remove(roomName);
        } else {
            //Quand le client quitte, on retire sa session
            sessions.put(roomName, listSession);
            this.broadcast(roomName, userName + " vient de se déconnecter !");
        }
        //sessions.remove(session);
        logger.info(userName + " vient de se déconnecter de " + roomName);

    }

    public void broadcast(String room, String message) throws IOException {
        List<WebSocketSession> listSession = sessions.get(room);
        for (WebSocketSession session : listSession) {
            session.sendMessage(new TextMessage(message));
        }
    }

    private static String getRoomName(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("room=")) {
                    return param.substring(5); // extrait après "room="
                }
            }
        }
        return "default";
    }

    private String getuserName(WebSocketSession session) {
        HttpSession httpSession = (HttpSession) session.getAttributes().get("HTTP.SESSION");
        if (httpSession != null) {
            Object userId = httpSession.getAttribute("userId");
            if (userId != null) {
                return userId.toString();
            }
        }

        String query = session.getUri().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("user=")) {
                    return param.substring(5);
                }
            }
        }

        return "default";
    }

}
