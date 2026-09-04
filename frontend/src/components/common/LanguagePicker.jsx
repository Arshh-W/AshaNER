import { useState } from "react";

const languages = [
    {
        code: "en",
        name: "English"
    },
    {
        code: "hi",
        name: "हिन्दी"
    },
    {
        code: "as",
        name: "অসমীয়া"
    },
    {
        code: "bn",
        name: "বাংলা"
    },
    {
        code: "mn",
        name: "মৈতৈলোন"
    }
];

export default function LanguagePicker({
    value,
    onChange
}) {
    const [selected, setSelected] =
        useState(
            value ||
            localStorage.getItem(
                "language"
            ) ||
            "en"
        );

    const handleChange = (event) => {
        const nextLanguage =
            event.target.value;

        setSelected(nextLanguage);

        localStorage.setItem(
            "language",
            nextLanguage
        );

        if (onChange) {
            onChange(nextLanguage);
        }
    };

    return (
        <div className="language-picker">
            <label htmlFor="language-select">
                Language
            </label>

            <select
                id="language-select"
                value={selected}
                onChange={handleChange}
            >
                {languages.map(
                    (language) => (
                        <option
                            key={language.code}
                            value={language.code}
                        >
                            {language.name}
                        </option>
                    )
                )}
            </select>
        </div>
    );
}