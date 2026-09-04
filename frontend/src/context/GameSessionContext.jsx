import {createContext,useContext,useState} from "react";
const Ctx=createContext();
export function GameSessionProvider({children}){
 const [score,setScore]=useState(2); const [completed,setCompleted]=useState(0);
 const record=()=>{setScore(s=>s+1);setCompleted(c=>c+1)};
 return <Ctx.Provider value={{score,completed,record,reset:()=>{setScore(2);setCompleted(0)}}}>{children}</Ctx.Provider>
}
export const useGameSession=()=>useContext(Ctx);
