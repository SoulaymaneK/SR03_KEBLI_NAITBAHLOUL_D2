import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";
import Header from "./Header";

const InvitedChatrooms = () => {
    const { user } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInvitations = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const response = await axios.get(
                    `http://localhost:8080/api/chatroom/invitedChatrooms?id=${user.id}`
                );
                setInvitations(response.data);
            } catch (err) {
                setError("Failed to load invitations.");
            } finally {
                setLoading(false);
            }
        };

        loadInvitations();
    }, [user]);

    const handleAccept = async (chatroomId) => {
        try {
            await axios.post(`http://localhost:8080/api/chatroom/acceptInvitation/${chatroomId}`);
            setInvitations((prev) => prev.filter((chat) => chat.id !== chatroomId));
        } catch (err) {
            console.error("Failed to accept invitation:", err);
            alert("Failed to accept invitation.");
        }
    };

    const handleRefuse = async (chatroomId) => {
        try {
            await axios.delete("http://localhost:8080/api/chatroom/invitation/refuse", {
                params: {
                    userId: user.id,
                    chatroomId: chatroomId,
                },
            });
            setInvitations((prev) => prev.filter((chat) => chat.id !== chatroomId));
        } catch (err) {
            console.error("Failed to refuse invitation:", err);
            alert("Failed to refuse invitation.");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-rose-600 text-lg">
                <p>Please log in to see your invitations.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-rose-600 text-lg">
                <p>Loading invitations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-red-600 text-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-10">
                {invitations.length === 0 ? (
                    <div className="text-center py-20 text-rose-500 text-lg">
                        <p>No invitations at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {invitations.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white border border-rose-100 rounded-3xl p-6 shadow transition hover:shadow-lg"
                            >
                                <h3 className="text-xl font-semibold text-rose-700 mb-2">{chat.channel}</h3>
                                <p className="text-gray-600 text-sm mb-4">{chat.description}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(chat.id)}
                                        className="flex-1 px-4 py-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition transform hover:scale-105 duration-200 ease-in-out shadow"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRefuse(chat.id)}
                                        className="flex-1 px-4 py-2 rounded-full bg-rose-400 text-white hover:bg-rose-500 transition transform hover:scale-105 duration-200 ease-in-out shadow"
                                    >
                                        Refuse
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitedChatrooms;
