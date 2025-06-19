import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";
import Header from "./Header";

const MyChatrooms = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadMyChats = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/chatroom/myChatrooms?id=${user.id}`);
                setChats(response.data);
            } catch (err) {
                setError("Failed to load chatrooms.");
            } finally {
                setLoading(false);
            }
        };
        loadMyChats();
    }, [user]);

    const handleDelete = async (chat) => {
        const isOwner = chat.ownerId === user.id;
        const confirmMsg = isOwner
            ? "Are you sure you want to delete this chatroom?"
            : "Are you sure you want to leave this chatroom?";
        if (!window.confirm(confirmMsg)) return;

        const route = isOwner ? "delete" : "quit";

        try {
            await axios.delete(`http://localhost:8080/api/chatroom/${route}/${chat.id}`);
            setChats((prev) => prev.filter((c) => c.id !== chat.id));
        } catch {
            alert("Failed to " + (isOwner ? "delete" : "leave") + " chatroom.");
        }
    };

    const handleEdit = (id) => {
        navigate(`/editChatroom/${id}`);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-pink-600 font-medium">
                Please login to see your chatrooms.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-pink-600 font-medium">
                Loading chatrooms...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-10">
                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 rounded-xl p-4 mb-6 shadow">
                        {error}
                    </div>
                )}

                {chats.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-rose-600 text-lg mb-4">No chatrooms yet.</p>
                        <Link
                            to="/CreateChatroom"
                            className="inline-block bg-rose-500 text-white px-6 py-3 rounded-full shadow hover:bg-rose-600 transition transform hover:scale-105 duration-200 ease-in-out"
                        >
                            Create one now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="bg-white border border-rose-100 rounded-3xl p-6 shadow transition hover:shadow-lg"
                            >
                                <h2 className="text-xl font-semibold text-rose-700 mb-2">{chat.channel}</h2>
                                <p className="text-gray-600 text-sm mb-2">{chat.description}</p>
                                <p className="text-sm text-gray-400 mb-4">
                                    Created on: {new Date(chat.date).toLocaleDateString()}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <Link to={`/chat/${chat.id}`}>
                                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition transform hover:scale-105 duration-200 ease-in-out shadow">
                                            Open
                                        </button>
                                    </Link>
                                    {chat.ownerId === user.id && (
                                        <button
                                            onClick={() => handleEdit(chat.id)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition transform hover:scale-105 duration-200 ease-in-out shadow"
                                        >
                                            Modify
                                        </button>
                                    )}
                                    {chat.ownerId === user.id ? (
                                        <button
                                            onClick={() => handleDelete(chat)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full transition transform hover:scale-105 duration-200 ease-in-out shadow"
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(chat)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition transform hover:scale-105 duration-200 ease-in-out shadow"
                                        >
                                            Quit
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChatrooms;
