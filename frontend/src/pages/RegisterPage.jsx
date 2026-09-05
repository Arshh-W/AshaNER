import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Logo from "../components/common/Logo";
import "../assets/styles/register-page.css";

const LANGUAGE_OPTIONS = [
    { value: "en-IN", label: "English" },
    { value: "as-IN", label: "অসমীয়া (Assamese)" },
    { value: "bn-IN", label: "বাংলা (Bengali)" },
    { value: "mni-IN", label: "মৈতৈলোন্ (Manipuri)" },
    { value: "lus-IN", label: "Mizo" },
    { value: "brx-IN", label: "बड़ो (Bodo)" }
];

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const birth = new Date(`${dateOfBirth}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return "";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
            today.getDate() < birth.getDate())
    ) {
        age -= 1;
    }

    return age >= 0 ? age : "";
};

export default function RegisterPage() {
    const { role } = useParams();
    const navigate = useNavigate();
    const { register, authError, isRegistering } = useAuth();
    const { t } = useLanguage();

    const isPatient = role === "patient";
    const isCaregiver = role === "caregiver";

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        state: "",
        region: "",
        preferred_language: "en-IN",
        caregiver_relationship: "",
        caregiver_code: ""
    });

    const [error, setError] = useState("");

    const age = useMemo(
        () => calculateAge(form.date_of_birth),
        [form.date_of_birth]
    );

    if (!isPatient && !isCaregiver) {
        return (
            <main className="register-page-form">
                <div className="register-wrapper">
                    <div className="register-card">
                        <div className="register-logo">
                            <Logo />
                        </div>
                        <div className="register-heading">
                            <h1>
                                {t(
                                    "register.invalidRegistrationType",
                                    "Invalid registration type."
                                )}
                            </h1>
                            <p>
                                {t(
                                    "register.invalidRegistrationDescription",
                                    "Please choose whether you want to register as a patient or caregiver."
                                )}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="register-submit patient-submit"
                            onClick={() => navigate("/register")}
                        >
                            {t(
                                "register.backToRegistration",
                                "Back to registration"
                            )}
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const updateField = (field) => (event) => {
        setForm((current) => ({
            ...current,
            [field]: event.target.value
        }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError(
                t("register.fillAllFields", "Please fill in all fields.")
            );
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError(
                t("register.passwordMismatch", "Passwords do not match.")
            );
            return;
        }

        if (form.password.length < 8) {
            setError(
                t(
                    "register.passwordTooShort",
                    "Password must be at least 8 characters."
                )
            );
            return;
        }

        if (isPatient) {
            const requiredFields = [
                ["date_of_birth", "date of birth"],
                ["gender", "gender"],
                ["phone", "phone number"],
                ["address", "address"],
                ["city", "city"],
                ["district", "district"],
                ["state", "state"],
                ["preferred_language", "preferred language"]
            ];

            const missing = requiredFields.find(
                ([field]) => !String(form[field] || "").trim()
            );

            if (missing) {
                setError(
                    t(
                        "register.requiredPatientField",
                        `Please provide your ${missing[1]}.`
                    )
                );
                return;
            }
        }

        const payload = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role
        };

        if (isPatient) {
            Object.assign(payload, {
                date_of_birth: form.date_of_birth,
                gender: form.gender,
                phone: form.phone.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                district: form.district.trim(),
                state: form.state.trim(),
                region: form.region.trim() || null,
                preferred_language: form.preferred_language,
                caregiver_relationship:
                    form.caregiver_relationship.trim() || null,
                caregiver_code:
                    form.caregiver_code.trim().toUpperCase() || null
            });
        }

        const success = await register(payload);

        if (!success) return;

        navigate(`/login/${role}`, { replace: true });
    };

    const field = (
        id,
        label,
        type = "text",
        options = {}
    ) => (
        <div className="form-field" key={id}>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={form[id]}
                onChange={updateField(id)}
                placeholder={options.placeholder}
                autoComplete={options.autoComplete}
                required={options.required}
                disabled={isRegistering}
                min={options.min}
                max={options.max}
            />
        </div>
    );

    return (
        <main
            className={`register-page-form ${
                isPatient
                    ? "patient-register-page"
                    : "caregiver-register-page"
            }`}
        >
            <div className="register-wrapper">
                <button
                    type="button"
                    className="register-back"
                    onClick={() => navigate("/register")}
                    disabled={isRegistering}
                >
                    <span aria-hidden="true">←</span>
                    {t("register.back", "Back")}
                </button>

                <div className="register-card">
                    <div className="register-logo">
                        <Logo />
                    </div>

                    <div className="register-heading">
                        <span
                            className={`register-role-label ${
                                isPatient
                                    ? "patient-label"
                                    : "caregiver-label"
                            }`}
                        >
                            {isPatient
                                ? t(
                                      "register.patientView",
                                      "PATIENT VIEW"
                                  )
                                : t(
                                      "register.caregiverView",
                                      "CAREGIVER VIEW")}
                        </span>

                        <h1>
                            {t(
                                "register.createAccount",
                                "Create your account."
                            )}
                        </h1>

                        <p>
                            {isPatient
                                ? t(
                                      "register.patientDescription",
                                      "Set up your personal AshaNER care space."
                                  )
                                : t(
                                      "register.caregiverDescription",
                                      "Set up your connected caregiver account."
                                  )}
                        </p>
                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >
                        <div
                            style={{
                                display: "grid",
                                gap: "1rem"
                            }}
                        >
                            <h2>
                                {t(
                                    "register.accountDetails",
                                    "Account details"
                                )}
                            </h2>

                            {field(
                                "name",
                                t("register.fullName", "Full name"),
                                "text",
                                {
                                    placeholder: t(
                                        "register.namePlaceholder",
                                        "Your name"
                                    ),
                                    autoComplete: "name",
                                    required: true
                                }
                            )}

                            {field(
                                "email",
                                t("register.email", "Email address"),
                                "email",
                                {
                                    placeholder: t(
                                        "register.emailPlaceholder",
                                        "you@example.com"
                                    ),
                                    autoComplete: "email",
                                    required: true
                                }
                            )}

                            {field(
                                "password",
                                t("register.password", "Password"),
                                "password",
                                {
                                    placeholder: t(
                                        "register.passwordPlaceholder",
                                        "Create a password"
                                    ),
                                    autoComplete: "new-password",
                                    required: true
                                }
                            )}

                            {field(
                                "confirmPassword",
                                t(
                                    "register.confirmPassword",
                                    "Confirm password"
                                ),
                                "password",
                                {
                                    placeholder: t(
                                        "register.confirmPasswordPlaceholder",
                                        "Repeat your password"
                                    ),
                                    autoComplete: "new-password",
                                    required: true
                                }
                            )}
                        </div>

                        {isPatient && (
                            <>
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "1rem",
                                        marginTop: "1.5rem"
                                    }}
                                >
                                    <h2>
                                        {t(
                                            "register.personalDetails",
                                            "Personal details"
                                        )}
                                    </h2>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(220px, 1fr))",
                                            gap: "1rem"
                                        }}
                                    >
                                        <div className="form-field">
                                            <label htmlFor="date_of_birth">
                                                {t(
                                                    "register.dateOfBirth",
                                                    "Date of birth"
                                                )}
                                            </label>
                                            <input
                                                id="date_of_birth"
                                                type="date"
                                                value={
                                                    form.date_of_birth
                                                }
                                                onChange={updateField(
                                                    "date_of_birth"
                                                )}
                                                required
                                                disabled={isRegistering}
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="age">
                                                {t(
                                                    "register.age",
                                                    "Age"
                                                )}
                                            </label>
                                            <input
                                                id="age"
                                                type="number"
                                                value={age}
                                                readOnly
                                                placeholder={t(
                                                    "register.ageAuto",
                                                    "Calculated automatically"
                                                )}
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="gender">
                                                {t(
                                                    "register.gender",
                                                    "Gender"
                                                )}
                                            </label>
                                            <select
                                                id="gender"
                                                value={form.gender}
                                                onChange={updateField(
                                                    "gender"
                                                )}
                                                required
                                                disabled={isRegistering}
                                            >
                                                <option value="">
                                                    {t(
                                                        "register.selectGender",
                                                        "Select gender"
                                                    )}
                                                </option>
                                                <option value="female">
                                                    {t(
                                                        "register.female",
                                                        "Female"
                                                    )}
                                                </option>
                                                <option value="male">
                                                    {t(
                                                        "register.male",
                                                        "Male"
                                                    )}
                                                </option>
                                                <option value="other">
                                                    {t(
                                                        "register.other",
                                                        "Other"
                                                    )}
                                                </option>
                                                <option value="prefer_not_to_say">
                                                    {t(
                                                        "register.preferNotToSay",
                                                        "Prefer not to say"
                                                    )}
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {field(
                                        "phone",
                                        t("register.phone", "Phone number"),
                                        "tel",
                                        {
                                            placeholder: t(
                                                "register.phonePlaceholder",
                                                "Your phone number"
                                            ),
                                            autoComplete: "tel",
                                            required: true
                                        }
                                    )}

                                    {field(
                                        "address",
                                        t("register.address", "Address"),
                                        "text",
                                        {
                                            placeholder: t(
                                                "register.addressPlaceholder",
                                                "House / street / locality"
                                            ),
                                            autoComplete: "street-address",
                                            required: true
                                        }
                                    )}

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(180px, 1fr))",
                                            gap: "1rem"
                                        }}
                                    >
                                        {field(
                                            "city",
                                            t("register.city", "City"),
                                            "text",
                                            {
                                                placeholder: t(
                                                    "register.cityPlaceholder",
                                                    "City"
                                                ),
                                                required: true
                                            }
                                        )}

                                        {field(
                                            "district",
                                            t(
                                                "register.district",
                                                "District"
                                            ),
                                            "text",
                                            {
                                                placeholder: t(
                                                    "register.districtPlaceholder",
                                                    "District"
                                                ),
                                                required: true
                                            }
                                        )}

                                        {field(
                                            "state",
                                            t("register.state", "State"),
                                            "text",
                                            {
                                                placeholder: t(
                                                    "register.statePlaceholder",
                                                    "State"
                                                ),
                                                required: true
                                            }
                                        )}
                                    </div>

                                    {field(
                                        "region",
                                        t(
                                            "register.region",
                                            "Region (optional)"
                                        ),
                                        "text",
                                        {
                                            placeholder: t(
                                                "register.regionPlaceholder",
                                                "Region"
                                            )
                                        }
                                    )}

                                    <div className="form-field">
                                        <label htmlFor="preferred_language">
                                            {t(
                                                "register.preferredLanguage",
                                                "Preferred language"
                                            )}
                                        </label>
                                        <select
                                            id="preferred_language"
                                            value={
                                                form.preferred_language
                                            }
                                            onChange={updateField(
                                                "preferred_language"
                                            )}
                                            required
                                            disabled={isRegistering}
                                        >
                                            {LANGUAGE_OPTIONS.map(
                                                (option) => (
                                                    <option
                                                        key={option.value}
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {option.label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gap: "1rem",
                                        marginTop: "1.5rem"
                                    }}
                                >
                                    <h2>
                                        {t(
                                            "register.careConnection",
                                            "Care connection"
                                        )}
                                    </h2>

                                    {field(
                                        "caregiver_code",
                                        t(
                                            "register.caregiverCode",
                                            "Caregiver code (optional)"
                                        ),
                                        "text",
                                        {
                                            placeholder: t(
                                                "register.caregiverCodePlaceholder",
                                                "Example: CG-F5CCD1"
                                            )
                                        }
                                    )}

                                    {field(
                                        "caregiver_relationship",
                                        t(
                                            "register.caregiverRelationship",
                                            "Relationship to caregiver (optional)"
                                        ),
                                        "text",
                                        {
                                            placeholder: t(
                                                "register.caregiverRelationshipPlaceholder",
                                                "Daughter, son, spouse, etc."
                                            )
                                        }
                                    )}

                                    <p>
                                        {t(
                                            "register.caregiverCodeHelp",
                                            "If your caregiver gave you a connection code, enter it here. You can also connect later."
                                        )}
                                    </p>
                                </div>
                            </>
                        )}

                        {(error || authError) && (
                            <div
                                className="register-error"
                                role="alert"
                            >
                                {error || authError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`register-submit ${
                                isPatient
                                    ? "patient-submit"
                                    : "caregiver-submit"
                            }`}
                            disabled={isRegistering}
                        >
                            {isRegistering
                                ? t(
                                      "register.creatingAccount",
                                      "Creating account..."
                                  )
                                : isPatient
                                ? t(
                                      "register.createPatientAccount",
                                      "Create Patient Account"
                                  )
                                : t(
                                      "register.createCaregiverAccount",
                                      "Create Caregiver Account"
                                  )}

                            {!isRegistering && (
                                <span aria-hidden="true">→</span>
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            {t(
                                "register.alreadyHaveAccount",
                                "Already have an account?"
                            )}{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/login/${role}`)
                                }
                                disabled={isRegistering}
                            >
                                {t("register.logIn", "Log in")}
                            </button>
                        </p>

                        <span>
                            {t(
                                "register.privateSecure",
                                "Your information is kept private and secure."
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
