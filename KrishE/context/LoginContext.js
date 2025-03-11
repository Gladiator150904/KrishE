import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error getting session:", error);
      }
      setUser(data?.session?.user || null);
      setLoading(false); // Set loading to false after fetching session
    };

    initializeSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <LoginContext.Provider value={{ user, loading, logout, avatar, setAvatar}}>
      {children}
    </LoginContext.Provider>
  );
};
