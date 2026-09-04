import React from "react";
import { useParams } from "react-router-dom";

import MemoryVillage from "../games/memory-village/MemoryVillage";
import MemoryDetective from "../games/memory-detective/MemoryDetective";

const GamePage = () => {
    const { gameId } = useParams();

    if (gameId === "memory-village") {
        return <MemoryVillage />;
    }

    if (gameId === "memory-detective") {
        return <MemoryDetective />;
    }

    return <div>Game not found</div>;
};

export default GamePage;