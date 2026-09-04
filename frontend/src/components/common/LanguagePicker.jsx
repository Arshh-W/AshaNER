import { useLanguage } from "../../context/LanguageContext";

export default function LanguagePicker() {

    const {
        language,
        changeLanguage,
        languages
    } = useLanguage();


    const handleChange = (event) => {

        const nextLanguage =
            event.target.value;

        changeLanguage(nextLanguage);
    };


    return (
        <div className="language-picker">

            <label
                htmlFor="language-select"
                className="language-picker-label"
            >
                Language
            </label>

            <select
                id="language-select"
                value={language}
                onChange={handleChange}
                aria-label="Select language"
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