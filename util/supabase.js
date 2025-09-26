import { createClient } from '@supabase/supabase-js';

// These should be added to your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions with error handling
export const authService = {
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { user: data.user, error: null };
        } catch (error) {
            return { user: null, error: error.message };
        }
    },

    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            return { user: data.user, error: null };
        } catch (error) {
            return { user: null, error: error.message };
        }
    },

    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    },

    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return { user, error: null };
        } catch (error) {
            return { user: null, error: error.message };
        }
    }
};

// Database service for tutorials, thrift shops, etc.
export const dataService = {
    async getTutorials() {
        try {
            const { data, error } = await supabase
                .from('tutorials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: [], error: error.message };
        }
    },

    async getThriftShops() {
        try {
            const { data, error } = await supabase
                .from('thrift_shops')
                .select('*')
                .order('name');

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: [], error: error.message };
        }
    },

    async getScrapEstimations(userId) {
        try {
            const { data, error } = await supabase
                .from('scrap_estimations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: [], error: error.message };
        }
    },

    async saveScrapEstimation(estimationData, userId) {
        try {
            const { data, error } = await supabase
                .from('scrap_estimations')
                .insert({
                    ...estimationData,
                    user_id: userId
                });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }
};
