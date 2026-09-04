import React from "react";
import { useParams } from "react-router-dom";

import MemoryVillage from "../games/memory-village/MemoryVillage";
import MemoryDetective from "../games/memory-detective/MemoryDetective";
import RoutineRescue from "../games/routine-rescue/RoutineRescue";
import SoundObjectMatch from "../games/sound-object-match/SoundObjectMatch";
import MemoryMosaic from "../games/memory-mosaic/MemoryMosaic";

const GamePage = () => {
    const { gameId } = useParams();

    if (gameId === "memory-village") {
        return <MemoryVillage />;
    }

    if (gameId === "memory-detective") {
        return <MemoryDetective />;
    }

    if (gameId === "routine-rescue") {
        return <RoutineRescue />;
    }

    if (gameId === "sound-object-match") {
        return <SoundObjectMatch />;
    }

    if (gameId === "memory-mosaic") {
        return <MemoryMosaic />;
    }

    return <div>Game not found</div>;
};

export default GamePage;