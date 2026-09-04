import { createContext, useContext, useState } from "react";
const Ctx = createContext();
export function AuthProvider({children}) {
  const [user, setUser] = useState({name:"Kangkan", role:"patient", patientName:"Grandfather Biren"});
  const login = (role="patient") => setUser(role==="caregiver" ? {name:"Ananya Barua",role,patientName:"Grandfather Biren"} : {name:"Kangkan",role,patientName:"Grandfather Biren"});
  return <Ctx.Provider value={{user,login,logout:()=>setUser(null)}}>{children}</Ctx.Provider>;
}
export const useAuth=()=>useContext(Ctx);
