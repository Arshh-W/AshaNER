import { createContext, useContext, useState } from "react";
const Ctx=createContext();
export function LanguageProvider({children}) {
 const [language,setLanguage]=useState("Assamese");
 const languages=["Assamese","Bengali","Manipuri","Mizo","Bodo"];
 return <Ctx.Provider value={{language,setLanguage,languages}}>{children}</Ctx.Provider>;
}
export const useLanguage=()=>useContext(Ctx);
