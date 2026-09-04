import { useParams, Navigate } from "react-router-dom";

import MemoryDetective from "../games/memory-detective/MemoryDetective";
import MemoryMosaic from "../games/memory-mosaic/MemoryMosaic";
import MemoryVillage from "../games/memory-village/MemoryVillage";
import RoutineRescue from "../games/routine-rescue/RoutineRescue";
import SoundObjectMatch from "../games/sound-object-match/SoundObjectMatch";
//this is main page for the games, it will render the game based on the gameId in the url

export default function GamePage() {
  const { gameId } = useParams();

  switch (gameId) {
    case "memory-detective":
      return <MemoryDetective />;

    case "memory-mosaic":
      return <MemoryMosaic />;

    case "memory-village":
      return <MemoryVillage />;

    case "routine-rescue":
      return <RoutineRescue />;

    case "sound-object-match":
      return <SoundObjectMatch />;

    default:
      return <Navigate to="/patient/games" replace />;
  }
}
