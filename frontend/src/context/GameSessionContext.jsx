import { createContext, useCallback, useContext, useRef, useState } from "react";
import { queueOperation } from "../services/syncService";
import { adaptGameDifficulty } from "../services/engineApi";

const Ctx = createContext(null);

const gameTypeForApi = (gameId) => {
	if (gameId === "sound-object-match") return "sound_object";
	return gameId.replaceAll("-", "_");
};

export function GameSessionProvider({ children }) {
	const [session, setSession] = useState(null);
	const sessionRef = useRef(null);

	const start = useCallback((gameId) => {
		const nextSession = {
			local_session_id: `${gameId}-${Date.now()}`,
			gameId,
			score: 0,
			correct: 0,
			errors: 0,
			consecutiveErrors: 0,
			reactionTimes: [],
			startedAt: Date.now(),
			level: 1
		};
		sessionRef.current = nextSession;
		setSession(nextSession);
		return nextSession.local_session_id;
	}, []);

	const record = useCallback(({ correct, latencyMs = 0 }) => {
		const current = sessionRef.current;
		if (!current) return;

		const next = {
			...current,
			score: current.score + (correct ? 1 : 0),
			correct: current.correct + (correct ? 1 : 0),
			errors: current.errors + (correct ? 0 : 1),
			consecutiveErrors: correct ? 0 : current.consecutiveErrors + 1,
			reactionTimes: [...current.reactionTimes, latencyMs]
		};
		sessionRef.current = next;
		setSession(next);

		if (!correct) {
			adaptGameDifficulty({
				game_type: gameTypeForApi(current.gameId),
				current_level: current.level,
				consecutive_errors: next.consecutiveErrors,
				last_action_latency_ms: latencyMs,
				is_stalled: latencyMs > 4500
			}).then((response) => {
				if (response?.next_level && sessionRef.current) {
					const updated = { ...sessionRef.current, level: response.next_level };
					sessionRef.current = updated;
					setSession(updated);
				}
			}).catch(() => undefined);
		}
	}, []);

	const complete = useCallback(async () => {
		const current = sessionRef.current;
		if (!current || current.completed) return;

		const completed = {
			...current,
			completed: true
		};
		sessionRef.current = completed;
		setSession(completed);

		await queueOperation({
			endpoint: "/sync",
			method: "POST",
			data: {
				sessions: [{
					local_session_id: current.local_session_id,
					patient_id: Number(localStorage.getItem("patientId") || 1),
					game_type: gameTypeForApi(current.gameId),
					score: current.score,
					duration_seconds: (Date.now() - current.startedAt) / 1000,
					total_errors: current.errors,
					level_achieved: current.level,
					reaction_times_ms: current.reactionTimes,
					created_at_offline: new Date().toISOString()
				}]
			}
		});
	}, []);

	const reset = useCallback(() => {
		sessionRef.current = null;
		setSession(null);
	}, []);

	return (
		<Ctx.Provider value={{
			session,
			score: session?.score || 0,
			completed: session?.correct || 0,
			start,
			record,
			complete,
			reset
		}}>
			{children}
		</Ctx.Provider>
	);
}

export const useGameSession = () => useContext(Ctx);
