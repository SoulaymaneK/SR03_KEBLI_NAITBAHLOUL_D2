import React, { useEffect, useState, useRef } from 'react';
import Header from './Header';
import {Link, useParams} from "react-router-dom";
import { useAuth } from "./Authentication";

const ChatRoom = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null); // 🔽 ref pour le scroll

    useEffect(() => {
        if (!user?.id) return;

        const username = user.firstname || 'Guest';
        const token = user.token || '';

        const websocket = new WebSocket(`ws://localhost:8080/ws/chat?room=${id}&user=${username}&token=${token}`);

        websocket.onmessage = (evt) => {
            setMessages(prev => [...prev, evt.data]);
        };

        setWs(websocket);

        return () => websocket.close();
    }, [id, user]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]); // 🔽 scroll dès qu'on écrit ou reçoit un msg

    const sendMessage = () => {
        if (!user?.id || !message.trim() || !ws) return;

        const messageData = {
            user: user.firstname || 'Guest',
            message: message.trim()
        };

        ws.send(JSON.stringify(messageData));
        setMessage('');
        setIsTyping(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-800 mb-2">Session expired</p>
                            <p className="text-gray-600">Please sign in again to access chat.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-4xl">
                    <div className="mb-6">
                        <Link to="/mychatrooms" className="text-sm text-rose-500 hover:underline">
                            ← Back to MyChatRooms
                        </Link>
                    </div>
                    <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${ws ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    <h2 className="text-xl font-semibold text-white">Chat</h2>
                                </div>
                                <div className="flex items-center space-x-2 text-pink-100">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                    </svg>
                                    <span className="text-sm">{ws ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-pink-100">
                                Logged as: <strong>{user.firstname} {user.lastname}</strong>
                            </div>
                        </div>

                        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/40 to-white/60">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">No message</p>
                                    <p className="text-sm">Start discussing!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const currentUserName = user.firstname || 'Guest';
                                    const colonIndex = msg.indexOf(' : ');
                                    let messageUser = 'Unknown';
                                    let messageContent = msg;

                                    if (colonIndex !== -1) {
                                        messageUser = msg.substring(0, colonIndex);
                                        messageContent = msg.substring(colonIndex + 3);
                                    }

                                    const isCurrentUser = messageUser === currentUserName;

                                    if (messageContent.includes('has just connected!') ||
                                        messageContent.includes('disconnected')) {
                                        return (
                                            <div key={idx} className="flex justify-center mb-2">
                                                <div className="bg-rose-100 px-3 py-1 rounded-full shadow">
                                                    <p className="text-xs text-rose-500 text-center">{msg}</p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                                            {!isCurrentUser && (
                                                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-xs font-bold">
                                                        {messageUser.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 mb-1">{messageUser}</span>
                                                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-md">
                                                            <p className="text-sm text-gray-700">{messageContent}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {isCurrentUser && (
                                                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-rose-500 text-right mb-1">You</span>
                                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 px-4 py-3 rounded-2xl shadow-md text-white">
                                                            <p className="text-sm">{messageContent}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center overflow-hidden">
                                                        {user.avatarUrl ? (
                                                            <img
                                                                src={`http://localhost:8080${user.avatarUrl}`}
                                                                alt="Your avatar"
                                                                className="w-full h-full object-cover rounded-full"
                                                            />
                                                        ) : (
                                                            currentUserName.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-rose-100 px-4 py-3 rounded-2xl border border-rose-200">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* ⬇️ Point d’ancrage pour scroll automatique */}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-rose-200/50">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={!ws || !user}
                                    className="flex-1 px-4 py-3 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder-gray-400 disabled:bg-gray-100"
                                    placeholder={ws && user ? "Type a message..." : "Login to chat..."}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim() || !ws || !user}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-full transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
