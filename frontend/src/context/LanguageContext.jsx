import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import translations from "../locales/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "ashaNER-language";

const LANGUAGES = [
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

function getInitialLanguage() {
    try {
        const savedLanguage =
            localStorage.getItem(STORAGE_KEY);

        if (
            savedLanguage &&
            LANGUAGES.some(
                (item) =>
                    item.code === savedLanguage
            )
        ) {
            return savedLanguage;
        }
    } catch (error) {
        console.warn(
            "Unable to read saved language:",
            error
        );
    }

    return "English";
}

function getNestedValue(object, key) {
    if (!object || !key) {
        return undefined;
    }

    return key
        .split(".")
        .reduce(
            (current, part) => {
                if (
                    current === undefined ||
                    current === null
                ) {
                    return undefined;
                }

                return current[part];
            },
            object
        );
}

export function LanguageProvider({
    children
}) {
    const [
        language,
        setLanguageState
    ] = useState(
        getInitialLanguage
    );

    const changeLanguage = (
        newLanguage
    ) => {
        const languageExists =
            LANGUAGES.some(
                (item) =>
                    item.code === newLanguage
            );

        if (!languageExists) {
            console.warn(
                `Unsupported language: ${newLanguage}`
            );
            return;
        }

        setLanguageState(newLanguage);

        try {
            localStorage.setItem(
                STORAGE_KEY,
                newLanguage
            );
        } catch (error) {
            console.warn(
                "Unable to save language:",
                error
            );
        }
    };

    useEffect(() => {
        const languageMap = {
            English: "en",
            Assamese: "as",
            Bengali: "bn",
            Manipuri: "mni",
            Mizo: "lus",
            Bodo: "brx"
        };

        document.documentElement.lang =
            languageMap[language] ||
            "en";
    }, [language]);

    const t = useMemo(() => {
        return (
            key,
            fallback
        ) => {
            if (!key) {
                return "";
            }

            const translatedValue =
                getNestedValue(
                    translations[
                        language
                    ],
                    key
                );

            if (
                typeof translatedValue ===
                    "string" &&
                translatedValue.trim() !== ""
            ) {
                return translatedValue;
            }

            const englishValue =
                getNestedValue(
                    translations.English,
                    key
                );

            if (
                typeof englishValue ===
                    "string" &&
                englishValue.trim() !== ""
            ) {
                return englishValue;
            }

            if (
                typeof fallback ===
                    "string" &&
                fallback.trim() !== ""
            ) {
                return fallback;
            }

            return key;
        };
    }, [language]);

    const value = {
        language,
        languages: LANGUAGES,
        setLanguage: changeLanguage,
        changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider
            value={value}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context =
        useContext(
            LanguageContext
        );

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}

export default LanguageContext;