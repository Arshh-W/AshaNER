import React, { createContext, useContext } from "react";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    // TODO: Implement language state
    return (
        <LanguageContext.Provider value={null}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    return useContext(LanguageContext);
};