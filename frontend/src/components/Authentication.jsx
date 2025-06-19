import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Création du contexte d'authentification
const Authentication = createContext();

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);          // utilisateur connecté
    const [isLoading, setIsLoading] = useState(true); // état de chargement

    // Indique à axios d'envoyer les cookies (session) avec chaque requête
    axios.defaults.withCredentials = true;

    // Vérifie la session à l'initialisation
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/auth/me");
                setUser(response.data); // utilisateur authentifié
            } catch {
                setUser(null); // pas de session valide
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                { email, password }
            );
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || "Login failed" };
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        try {
            await axios.post("http://localhost:8080/api/auth/logout");
        } catch {}
        setUser(null);
    };

    // On transmet tout cela aux composants enfants
    return (
        <Authentication.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </Authentication.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(Authentication);
