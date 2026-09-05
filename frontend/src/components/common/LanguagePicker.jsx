import { useLanguage } from "../../context/LanguageContext";

export default function LanguagePicker() {
    const {
        language,
        languages,
        changeLanguage,
        t
    } = useLanguage();

    const handleChange = (event) => {
        changeLanguage(event.target.value);
    };

    return (
        <div className="language-picker">
            <label
                htmlFor="language-select"
                className="language-picker-label"
            >
                {t("settings.language", "Language")}
            </label>

            <select
                id="language-select"
                className="language-select"
                value={language}
                onChange={handleChange}
                aria-label={t(
                    "settings.selectLanguage",
                    "Select your language"
                )}
            >
                {languages.map((item) => (
                    <option
                        key={item.code}
                        value={item.code}
                    >
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}