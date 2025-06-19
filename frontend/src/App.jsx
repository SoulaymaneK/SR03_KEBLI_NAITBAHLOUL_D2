import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/Authentication";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatRoom from "./components/ChatRoom";
import AdminRedirect from "./components/AdminRedirect";
import CreateChatroom from "./components/CreateChatroom";
import UserMenu from "./components/UserMenu";
import Dashboard from "./components/Dashboard";
import InvitedChatrooms from "./components/InvitedChatrooms";
import MyChatrooms from "./components/MyChatrooms";
import ForgotPassword from "./components/ForgotPassword";
import EditChatroom from "./components/EditChatroom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute requireAdmin={true}>
                                <AdminRedirect />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/chat/:id"
                        element={
                            <PrivateRoute>
                                <ChatRoom />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/createChatroom"
                        element={
                            <PrivateRoute>
                                <CreateChatroom />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/userMenu"
                        element={
                            <PrivateRoute>
                                <UserMenu />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/accueil"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/invitedChatrooms"
                        element={
                            <PrivateRoute>
                                <InvitedChatrooms />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/editProfile"
                        element={
                            <PrivateRoute>
                                <EditProfile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/myChatrooms"
                        element={
                            <PrivateRoute>
                                <MyChatrooms />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/editChatroom/:id"
                        element={
                            <PrivateRoute>
                                <EditChatroom />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
