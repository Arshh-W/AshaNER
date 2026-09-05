import { useEffect } from "react";
import {
    useParams,
    Navigate
} from "react-router-dom";

import {
    useGameSession
} from "../context/GameSessionContext";

import {
    useLanguage
} from "../context/LanguageContext";

import MemoryDetective from "../games/memory-detective/MemoryDetective";
import MemoryMosaic from "../games/memory-mosaic/MemoryMosaic";
import MemoryVillage from "../games/memory-village/MemoryVillage";
import RoutineRescue from "../games/routine-rescue/RoutineRescue";
import SoundObjectMatch from "../games/sound-object-match/SoundObjectMatch";


export default function GamePage() {
    const { gameId } = useParams();

    const {
        start,
        complete,
        engineError,
        isAdapting
    } = useGameSession();

    const { t } = useLanguage();


    /* =====================================================
       START / COMPLETE GAME SESSION
    ===================================================== */

    useEffect(() => {
        start(gameId);

        return () => {
            complete().catch(() => undefined);
        };
    }, [
        gameId,
        start,
        complete
    ]);


    /* =====================================================
       SELECT GAME
    ===================================================== */

    const game = (() => {

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
                return (
                    <Navigate
                        to="/patient/games"
                        replace
                    />
                );
        }

    })();


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <>

            {isAdapting && (
                <div
                    role="status"
                    aria-live="polite"
                >
                    {t(
                        "gamePage.adjustingDifficulty",
                        "Adjusting difficulty..."
                    )}
                </div>
            )}


            {engineError && (
                <div
                    role="alert"
                >
                    {engineError}
                </div>
            )}


            {game}

        </>
    );
}