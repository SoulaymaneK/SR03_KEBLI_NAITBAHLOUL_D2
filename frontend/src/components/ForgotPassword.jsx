import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);

        try {
            await axios.post("http://localhost:8080/api/user/forgot-password", { email });
            setSuccess("If the email is valid, a recovery message has been sent.");
        } catch (err) {
            setError("An error occurred while sending the email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-xl border border-rose-100 px-8 py-10 w-full max-w-md"
            >
                <h1 className="text-2xl font-bold text-center text-rose-500 mb-6">
                    Forgot your password?
                </h1>

                <p className="text-sm text-gray-600 mb-6 text-center">
                    Enter your email address below to receive a recovery email.
                </p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold bg-rose-400 hover:bg-rose-500 text-white transition disabled:bg-gray-400"
                >
                    {loading ? "Sending..." : "Send recovery email"}
                </button>

                {success && <p className="text-green-600 text-center mt-4">{success}</p>}
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}

                <div className="mt-6 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link to="/login" className="text-rose-500 hover:underline">
                        Back to login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
