import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../util/supabase';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            const { user } = await authService.getCurrentUser();
            setUser(user);
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user || null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, userData = {}) => {
        const result = await authService.signUp(email, password, userData);
        return result;
    };

    const signIn = async (email, password) => {
        const result = await authService.signIn(email, password);
        if (result.user) {
            setUser(result.user);
            navigate('/');
        }
        return result;
    };

    const signOut = async () => {
        const result = await authService.signOut();
        setUser(null);
        navigate('/');
        return result;
    };

    return {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user
    };
}
