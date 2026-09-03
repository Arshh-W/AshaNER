import React, { createContext, useContext } from "react";

const GameSessionContext = createContext(null);

export const GameSessionProvider = ({ children }) => {
    // TODO: Implement game session state
    return (
        <GameSessionContext.Provider value={null}>
            {children}
        </GameSessionContext.Provider>
    );
};

export const useGameSession = () => {
    return useContext(GameSessionContext);
};