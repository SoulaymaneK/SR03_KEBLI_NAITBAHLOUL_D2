import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./Authentication";
import Header from "./Header";

const Dashboard = () => {
    const { user } = useAuth();
    const [myChats, setMyChats] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("myChats");

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const [myChatsRes, invitedChatsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`),
                    axios.get(`http://localhost:8080/api/chatroom/invitedChatrooms?id=${user.id}`),
                ]);
                setMyChats(myChatsRes.data);
                setInvitations(invitedChatsRes.data);
            } catch {
                setError("Error while loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    if (!user) {
        return (
            <CenteredMessage message="Please login to see your chats." />
        );
    }

    if (loading) {
        return <CenteredMessage message="Loading..." />;
    }

    if (error) {
        return <CenteredMessage message={error} error />;
    }

    const chatsToShow = activeTab === "myChats" ? myChats : invitations;
    const isInvitation = activeTab === "invitations";

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-indigo-100 pb-10">
            <Header />

            <main className="max-w-5xl mx-auto px-4 mt-6">
                <div className="flex justify-center gap-4 mb-8">
                    <TabButton
                        label="My Chats"
                        active={activeTab === "myChats"}
                        onClick={() => setActiveTab("myChats")}
                    />
                    <TabButton
                        label="My Invitations"
                        active={activeTab === "invitations"}
                        onClick={() => setActiveTab("invitations")}
                    />
                </div>

                {chatsToShow.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                        {isInvitation ? "No invitations available." : "No chatrooms created."}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chatsToShow.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition"
                            >
                                <h2 className="text-lg font-semibold text-rose-700 mb-2">{chat.channel}</h2>
                                <p className="text-gray-600 text-sm mb-4">{chat.description}</p>
                                {isInvitation ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await axios.post(`http://localhost:8080/api/chatroom/acceptInvitation/${chat.id}`);
                                                    setMyChats((prev) => [...prev, chat]);
                                                    setInvitations((prev) => prev.filter(c => c.id !== chat.id));
                                                } catch {
                                                    alert("Failed to accept invitation.");
                                                }
                                            }}
                                            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition transform hover:scale-105 duration-200 ease-in-out"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await axios.delete(`http://localhost:8080/api/chatroom/invitation/refuse`, {
                                                        params: {
                                                            userId: user.id,
                                                            chatroomId: chat.id,
                                                        }
                                                    });
                                                    setInvitations((prev) => prev.filter(c => c.id !== chat.id));
                                                } catch {
                                                    alert("Failed to refuse invitation.");
                                                }
                                            }}
                                            className="flex-1 px-4 py-2 bg-rose-400 text-white rounded-xl hover:bg-rose-500 transition transform hover:scale-105 duration-200 ease-in-out"
                                        >
                                            Refuse
                                        </button>
                                    </div>
                                ) : (
                                    <Link to={`/chat/${chat.id}`} className="block">
                                        <button className="w-full px-4 py-2 bg-rose-400 text-white rounded-xl hover:bg-rose-500 transition transform hover:scale-105 duration-200 ease-in-out">
                                            Open Chat
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition shadow-sm transform hover:scale-105 duration-200 ease-in-out ${
            active
                ? "bg-rose-400 text-white"
                : "bg-white text-rose-500 border border-rose-300 hover:bg-rose-50"
        }`}
    >
        {label}
    </button>
);

const CenteredMessage = ({ message, error = false }) => (
    <div className="min-h-screen flex justify-center items-center bg-pink-50 text-gray-700">
        <p className={`${error ? "text-red-600" : ""}`}>{message}</p>
    </div>
);

export default Dashboard;
