// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../util/supabase";

// export const AuthContext = createContext();

// const AuthContext = ({children}) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [session, setSession] = useState(null);
//     const [createAccount, setCreateAccount] = useState(false);

//     const signUpNewUser = async (email, password) => {
//         const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//             sign,
//             password
//         });
        
//         if (signUpError) {
//             return { success: false, error: signUpError };
//           }

//         if (signUpData.session) {
//             setSession(signUpData.session);
//         }

//         const { data: insertUserData, error: insertUserError } = await supabase.from('users').insert({
//             email: email,
//             username: email.split('@')[0]
//         });

//         if (insertUserError) {
//             return { success: false, error: insertUserError };
//     };
//     const signInUser = async (email, password) => {
//         const { data, error } = await supabase.auth.signInWithPassword({
//             email,
//             password
//         });
//     };
//     const signOutUser = async () => {
//         const { error } = await supabase.auth.signOut();
//     };
//     const getUser = async () => {
//         const { data, error } = await supabase.auth.getUser();
//         setUser(data.user);
//     };
//     const getSession = async () => {
//         const { data, error } = await supabase.auth.getSession();
//         setSession(data.session);
//     };
//     const getCreateAccount = async () => {
//         const { data, error } = await supabase.auth.getCreateAccount();
//         setCreateAccount(data.createAccount);
//     };

//   return (
//     <div>AuthContext</div>
//   )
// }

// export default AuthContext
