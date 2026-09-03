import React, { createContext, useContext } from "react";

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
    // TODO: Implement offline state
    return (
        <OfflineContext.Provider value={null}>
            {children}
        </OfflineContext.Provider>
    );
};

export const useOffline = () => {
    return useContext(OfflineContext);
};