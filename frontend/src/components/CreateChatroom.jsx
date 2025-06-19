import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Authentication";
import Header from "./Header";

function CreateChatroom() {
    const { user } = useAuth();

    const [channel, setChannel] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [lifespan, setLifespan] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!user?.id || search.trim() === "") {
                setUsers([]);
                return;
            }

            const fetchUsers = async () => {
                try {
                    setSearchLoading(true);
                    const response = await axios.get(
                        `http://localhost:8080/api/chatroom/searchUsers?search=${encodeURIComponent(search)}`
                    );
                    setUsers(response.data.filter((u) => u.id !== user.id));
                } catch (err) {
                    setUsers([]);
                    setError("Error searching users.");
                } finally {
                    setSearchLoading(false);
                }
            };

            fetchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, user]);

    const handleSelectUser = (u) => {
        if (!selectedUsers.find((x) => x.id === u.id)) {
            setSelectedUsers([...selectedUsers, u]);
        }
    };

    const handleRemoveUser = (id) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
    };

    const resetForm = () => {
        setChannel("");
        setDescription("");
        setDate("");
        setLifespan("");
        setSearch("");
        setUsers([]);
        setSelectedUsers([]);
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) return setError("Session expired.");
        if (!channel.trim()) return setError("The title is mandatory.");
        if (!date) return setError("Date and time are mandatory.");
        if (!lifespan || parseInt(lifespan) < 1) return setError("Invalid duration");
        if (selectedUsers.length === 0) return setError("Please add at least one user.");

        const payload = {
            idInvit: user.id,
            channel: channel.trim(),
            description: description.trim(),
            date,
            lifespan: parseInt(lifespan),
            userIds: selectedUsers.map((u) => u.id),
        };

        try {
            setLoading(true);
            await axios.post("http://localhost:8080/api/chatroom/create", payload);
            setSuccess(true);
            resetForm();
        } catch (err) {
            setError("Error while creating.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 text-rose-600 text-lg">
                Please login to create a chatroom.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-indigo-100">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white border border-rose-100 rounded-2xl shadow-xl p-8">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-rose-700">Create a Chatroom</h2>
                        <p className="text-sm text-rose-400">
                            Created by: <strong>{user.firstname} {user.lastname}</strong>
                        </p>
                    </div>

                    {success && (
                        <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded mb-4">
                            Chatroom created successfully.
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-rose-700">Chatroom Name*</label>
                            <input
                                className="w-full border border-rose-200 rounded-full px-4 py-2 mt-1 focus:ring focus:ring-rose-100"
                                value={channel}
                                onChange={(e) => setChannel(e.target.value)}
                                placeholder="Chatroom Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-rose-700">Description</label>
                            <textarea
                                className="w-full border border-rose-200 rounded-2xl px-4 py-2 mt-1 focus:ring focus:ring-rose-100"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional description"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-rose-700">Date & Time*</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border border-rose-200 rounded-full px-4 py-2 mt-1 focus:ring focus:ring-rose-100"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-700">Life Span (days)*</label>
                                <input
                                    type="number"
                                    className="w-full border border-rose-200 rounded-full px-4 py-2 mt-1 focus:ring focus:ring-rose-100"
                                    min="1"
                                    value={lifespan}
                                    onChange={(e) => setLifespan(e.target.value)}
                                    placeholder="Ex: 7"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-rose-700">Search for Users</label>
                            <input
                                type="text"
                                className="w-full border border-rose-200 rounded-full px-4 py-2 mt-1 focus:ring focus:ring-rose-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Type a name..."
                            />
                            {searchLoading && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                        </div>

                        {users.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Click to add:</p>
                                <div className="grid gap-2">
                                    {users.map((u) => (
                                        <div
                                            key={u.id}
                                            className={`p-2 border rounded-xl cursor-pointer flex justify-between items-center transition ${
                                                selectedUsers.some((s) => s.id === u.id)
                                                    ? "bg-rose-50 border-rose-200"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() => handleSelectUser(u)}
                                        >
                                            {u.firstname} {u.lastname}
                                            {selectedUsers.some((s) => s.id === u.id) && (
                                                <span className="text-green-600 font-semibold">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedUsers.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-rose-700 mb-1">Selected Users:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map((u) => (
                                        <span
                                            key={u.id}
                                            onClick={() => handleRemoveUser(u.id)}
                                            className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-rose-200 transition transform hover:scale-105"
                                        >
                                            {u.firstname} {u.lastname}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading || selectedUsers.length === 0}
                                className={`px-6 py-2 rounded-full font-semibold text-white transition transform hover:scale-105 duration-200 ease-in-out ${
                                    loading ? "bg-gray-400" : "bg-rose-500 hover:bg-rose-600"
                                }`}
                            >
                                {loading ? "Creating..." : "Create Chatroom"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 transition transform hover:scale-105 duration-200 ease-in-out"
                            >
                                Reset Form
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateChatroom;
