import {createContext,useContext,useEffect,useState} from "react";
const Ctx=createContext();
export function OfflineProvider({children}){
 const [online,setOnline]=useState(navigator.onLine);
 const [saved,setSaved]=useState(true);
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener("online",on);addEventListener("offline",off);return()=>{removeEventListener("online",on);removeEventListener("offline",off)}},[]);
 return <Ctx.Provider value={{online,saved,setSaved}}>{children}</Ctx.Provider>
}
export const useOffline=()=>useContext(Ctx);
