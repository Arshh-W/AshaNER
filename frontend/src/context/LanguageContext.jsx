import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import translations from "../locales/translations";

const Ctx = createContext(null);

/*
|--------------------------------------------------------------------------
| Languages
|--------------------------------------------------------------------------
| These names MUST match the top-level keys in translations.json.
|
| Current translations.json contains:
| English
| Assamese
| Bengali
| Manipuri
| Mizo
| Bodo
|--------------------------------------------------------------------------
*/

const languages = [
    {
        code: "English",
        name: "English"
    },
    {
        code: "Assamese",
        name: "অসমীয়া"
    },
    {
        code: "Bengali",
        name: "বাংলা"
    },
    {
        code: "Manipuri",
        name: "মৈতৈলোন"
    },
    {
        code: "Mizo",
        name: "Mizo"
    },
    {
        code: "Bodo",
        name: "बड़ो"
    }
];

const DEFAULT_LANGUAGE = "English";
const STORAGE_KEY = "language";


export function LanguageProvider({ children }) {

    /*
    |--------------------------------------------------------------------------
    | Current language
    |--------------------------------------------------------------------------
    */

    const [language, setLanguageState] = useState(() => {

        const savedLanguage =
            localStorage.getItem(STORAGE_KEY);

        /*
        | Make sure an invalid old value cannot break
        | the application.
        */

        const exists = languages.some(
            (item) => item.code === savedLanguage
        );

        return exists
            ? savedLanguage
            : DEFAULT_LANGUAGE;
    });


    /*
    |--------------------------------------------------------------------------
    | Change language
    |--------------------------------------------------------------------------
    */

    const changeLanguage = (newLanguage) => {

        const exists = languages.some(
            (item) => item.code === newLanguage
        );

        if (!exists) {
            console.warn(
                `Unsupported language: ${newLanguage}`
            );

            return;
        }

        setLanguageState(newLanguage);

        localStorage.setItem(
            STORAGE_KEY,
            newLanguage
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Translation function
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | t("navbar.home")
    | t("login.welcome")
    | t("settings.language")
    |
    |--------------------------------------------------------------------------
    */

    const t = useMemo(() => {

        return (key) => {

            if (!key) {
                return "";
            }

            /*
            | Get translations for current language
            */

            const currentTranslations =
                translations?.[language];

            /*
            | Split nested key
            |
            | "navbar.home"
            | becomes:
            | ["navbar", "home"]
            */

            const parts = key.split(".");

            let value =
                currentTranslations;

            for (const part of parts) {

                if (
                    value === undefined ||
                    value === null
                ) {
                    break;
                }

                value = value[part];
            }

            /*
            | If translation exists, return it.
            */

            if (typeof value === "string") {
                return value;
            }


            /*
            |--------------------------------------------------------------------------
            | English fallback
            |--------------------------------------------------------------------------
            */

            let fallback =
                translations?.[DEFAULT_LANGUAGE];

            for (const part of parts) {

                if (
                    fallback === undefined ||
                    fallback === null
                ) {
                    break;
                }

                fallback = fallback[part];
            }

            if (typeof fallback === "string") {
                return fallback;
            }


            /*
            |--------------------------------------------------------------------------
            | Last fallback
            |--------------------------------------------------------------------------
            |
            | If a translation key doesn't exist anywhere,
            | show the key instead of crashing.
            |--------------------------------------------------------------------------
            */

            console.warn(
                `Missing translation: ${language}.${key}`
            );

            return key;
        };

    }, [language]);


    /*
    |--------------------------------------------------------------------------
    | Context value
    |--------------------------------------------------------------------------
    */

    const value = {
        language,

        /*
        | setLanguage is kept for compatibility with
        | existing components.
        */

        setLanguage: changeLanguage,

        changeLanguage,

        languages,

        t
    };


    return (
        <Ctx.Provider value={value}>
            {children}
        </Ctx.Provider>
    );
}


/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export const useLanguage = () => {

    const context = useContext(Ctx);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
};