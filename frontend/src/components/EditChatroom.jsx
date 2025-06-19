import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./Authentication";
import Header from "./Header";

const EditChatroom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [chatroom, setChatroom] = useState(null);
    const [channel, setChannel] = useState("");
    const [description, setDescription] = useState("");
    const [lifespan, setLifespan] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chatRes, usersRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/chatroom/${id}`),
                    axios.get(`http://localhost:8080/api/chatroom/searchUsers?search=`),
                ]);

                setChatroom(chatRes.data);
                setChannel(chatRes.data.channel);
                setDescription(chatRes.data.description);
                setLifespan(chatRes.data.lifespan);
                setSelectedUserIds(chatRes.data.participantIds || []);
                setAllUsers(usersRes.data);
            } catch (err) {
                setError("Failed to load chatroom.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!channel.trim() || !lifespan || parseInt(lifespan) < 1) {
            setError("Invalid form data.");
            return;
        }

        const payload = {
            id: chatroom.id,
            channel: channel.trim(),
            description: description.trim(),
            lifespan: parseInt(lifespan),
            userIds: selectedUserIds,
            idInvit: user.id
        };

        try {
            const res = await axios.put(`http://localhost:8080/api/chatroom/update/${id}`, payload);
            setSuccess(res.data || "Chatroom updated successfully.");
            setError(null);
            setTimeout(() => navigate("/myChatrooms"), 1500);
        } catch (err) {
            setSuccess(false);
            setError("Update failed.");
        }
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);
        try {
            const res = await axios.get(`http://localhost:8080/api/chatroom/searchUsers?search=${term}`);
            setAllUsers(res.data);
        } catch {}
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-pink-600 font-medium">
                Please login to edit chatroom.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center text-rose-500 font-medium">
                Loading chatroom...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-100 via-pink-50 to-indigo-100">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="bg-white border border-rose-100 rounded-3xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-rose-700 mb-6">Edit Chatroom</h2>

                    {success && (
                        <div className="bg-green-100 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 shadow">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 shadow">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                        {/* Formulaire */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-rose-700">Chatroom Name*</label>
                                <input
                                    className="w-full mt-1 px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:ring-rose-200 focus:ring"
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value)}
                                    maxLength="100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-rose-700">Description</label>
                                <textarea
                                    className="w-full mt-1 px-4 py-2 border border-rose-200 rounded-2xl shadow-sm focus:ring-rose-200 focus:ring"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-rose-700">Life span (days)*</label>
                                <input
                                    type="number"
                                    className="w-full mt-1 px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:ring-rose-200 focus:ring"
                                    value={lifespan}
                                    onChange={(e) => setLifespan(e.target.value)}
                                    min="1"
                                    max="365"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-rose-700 mb-1">Participants</label>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full mb-3 px-4 py-2 border border-rose-200 rounded-full shadow-sm focus:ring-rose-200 focus:ring"
                                />
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {allUsers.map(user => (
                                        <label key={user.id} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.includes(user.id)}
                                                onChange={() => {
                                                    setSelectedUserIds(prev =>
                                                        prev.includes(user.id)
                                                            ? prev.filter(id => id !== user.id)
                                                            : [...prev, user.id]
                                                    );
                                                }}
                                            />
                                            {user.firstname} {user.lastname}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/myChatrooms")}
                                    className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition transform hover:scale-105 duration-200 ease-in-out"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 shadow transition transform hover:scale-105 duration-200 ease-in-out"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>

                        {/* Résumé dynamique */}
                        <div className="p-4 bg-white/60 backdrop-blur rounded-2xl shadow text-sm text-gray-700 space-y-2 h-fit">
                            <h3 className="font-bold text-rose-600 mb-2">Résumé en direct</h3>
                            <p><strong>Salon :</strong> {channel || "—"}</p>
                            <p><strong>Durée :</strong> {lifespan || "—"} jour(s)</p>
                            <p><strong>Description :</strong></p>
                            <p className="italic">{description || "Aucune description"}</p>
                            <p><strong>Participants sélectionnés :</strong> {selectedUserIds.length}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditChatroom;