import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Users,
    UserRound,
    MapPin,
    CalendarDays,
    ChevronRight,
    RefreshCw,
    AlertCircle,
    UserPlus
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/caregiver-patients.css";



export default function PatientsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPatients = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await api.get("/patients");

            if (!Array.isArray(data)) {
                setPatients([]);
                return;
            }

            setPatients(data);
        } catch (err) {
            console.error("Failed to load patients:", err);

            setError(
                err?.message ||
                    t(
                        "caregiverPatients.loadError",
                        "Unable to load your patients."
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== "caregiver") {
            setLoading(false);
            return;
        }

        loadPatients();
    }, [user?.role]);

    const filteredPatients = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return patients;
        }

        return patients.filter((patient) => {
            const searchableText = [
                patient.full_name,
                patient.patient_code,
                patient.city,
                patient.district,
                patient.state,
                patient.region,
                patient.gender,
                patient.caregiver_relationship
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [patients, search]);

    const handleOpenPatient = (patientId) => {
        navigate(`/caregiver/patients/${patientId}`);
    };

    if (user?.role !== "caregiver") {
        return (
            <section className="caregiver-patients-page">
                <div className="caregiver-patients-error">
                    <AlertCircle size={22} />

                    <div>
                        <h2>
                            {t(
                                "caregiverPatients.accessDeniedTitle",
                                "Caregiver access required"
                            )}
                        </h2>

                        <p>
                            {t(
                                "caregiverPatients.accessDenied",
                                "This page is only available to caregivers."
                            )}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="caregiver-patients-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="caregiver-patients-header">

                <div>
                    <span className="caregiver-patients-eyebrow">
                        <Users size={15} />

                        {t(
                            "caregiverPatients.eyebrow",
                            "CONNECTED CARE"
                        )}
                    </span>

                    <h1>
                        {t(
                            "caregiverPatients.title",
                            "Your Patients"
                        )}
                    </h1>

                    <p>
                        {t(
                            "caregiverPatients.description",
                            "View and manage the people connected to your care space."
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    className="caregiver-patients-refresh"
                    onClick={loadPatients}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "caregiver-patients-spinning"
                                : ""
                        }
                    />

                    {t(
                        "caregiverPatients.refresh",
                        "Refresh"
                    )}
                </button>

            </header>


            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <div className="caregiver-patients-summary">

                <div className="caregiver-patients-summary-card">

                    <div className="caregiver-patients-summary-icon">
                        <Users size={21} />
                    </div>

                    <div>
                        <span>
                            {t(
                                "caregiverPatients.totalPatients",
                                "Total Patients"
                            )}
                        </span>

                        <strong>
                            {patients.length}
                        </strong>
                    </div>

                </div>


                <div className="caregiver-patients-summary-card">

                    <div className="caregiver-patients-summary-icon">
                        <UserRound size={21} />
                    </div>

                    <div>
                        <span>
                            {t(
                                "caregiverPatients.showing",
                                "Showing"
                            )}
                        </span>

                        <strong>
                            {filteredPatients.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div className="caregiver-patients-toolbar">

                <div className="caregiver-patients-search">

                    <Search size={19} />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder={t(
                            "caregiverPatients.searchPlaceholder",
                            "Search patients by name, ID, city or state..."
                        )}
                        aria-label={t(
                            "caregiverPatients.searchLabel",
                            "Search patients"
                        )}
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label={t(
                                "caregiverPatients.clearSearch",
                                "Clear search"
                            )}
                        >
                            ×
                        </button>
                    )}

                </div>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
                <div
                    className="caregiver-patients-error"
                    role="alert"
                >
                    <AlertCircle size={22} />

                    <div>
                        <strong>
                            {t(
                                "caregiverPatients.errorTitle",
                                "Something went wrong"
                            )}
                        </strong>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadPatients}
                        >
                            {t(
                                "caregiverPatients.tryAgain",
                                "Try again"
                            )}
                        </button>
                    </div>
                </div>
            )}


            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading && (
                <div className="caregiver-patients-grid">

                    {[1, 2, 3].map((item) => (
                        <div
                            className="caregiver-patient-card caregiver-patient-skeleton"
                            key={item}
                        >
                            <div className="skeleton-avatar" />

                            <div className="skeleton-content">
                                <div className="skeleton-line skeleton-line-title" />
                                <div className="skeleton-line" />
                                <div className="skeleton-line skeleton-line-short" />
                            </div>
                        </div>
                    ))}

                </div>
            )}


            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {!loading &&
                !error &&
                patients.length === 0 && (
                    <div className="caregiver-patients-empty">

                        <div className="caregiver-patients-empty-icon">
                            <UserPlus size={28} />
                        </div>

                        <h2>
                            {t(
                                "caregiverPatients.noPatientsTitle",
                                "No patients connected yet"
                            )}
                        </h2>

                        <p>
                            {t(
                                "caregiverPatients.noPatientsDescription",
                                "Patients connected to your caregiver account will appear here."
                            )}
                        </p>

                    </div>
                )}


            {/* =====================================================
                NO SEARCH RESULTS
            ===================================================== */}

            {!loading &&
                !error &&
                patients.length > 0 &&
                filteredPatients.length === 0 && (
                    <div className="caregiver-patients-empty">

                        <div className="caregiver-patients-empty-icon">
                            <Search size={28} />
                        </div>

                        <h2>
                            {t(
                                "caregiverPatients.noSearchResultsTitle",
                                "No patients found"
                            )}
                        </h2>

                        <p>
                            {t(
                                "caregiverPatients.noSearchResultsDescription",
                                "Try searching with a different name, patient ID or location."
                            )}
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearch("")}
                        >
                            {t(
                                "caregiverPatients.clearSearchButton",
                                "Clear search"
                            )}
                        </button>

                    </div>
                )}


            {/* =====================================================
                PATIENT CARDS
            ===================================================== */}

            {!loading &&
                !error &&
                filteredPatients.length > 0 && (
                    <div className="caregiver-patients-grid">

                        {filteredPatients.map((patient) => (
                            <article
                                className="caregiver-patient-card"
                                key={patient.id}
                            >

                                <div className="caregiver-patient-card-top">

                                    <div className="caregiver-patient-avatar">
                                        <UserRound size={27} />
                                    </div>

                                    <div className="caregiver-patient-identity">

                                        <h2>
                                            {patient.full_name ||
                                                t(
                                                    "caregiverPatients.unknownPatient",
                                                    "Patient"
                                                )}
                                        </h2>

                                        <span>
                                            {patient.patient_code ||
                                                `ID ${patient.id}`}
                                        </span>

                                    </div>

                                    <span className="caregiver-patient-status">
                                        {t(
                                            "caregiverPatients.connected",
                                            "Connected"
                                        )}
                                    </span>

                                </div>


                                <div className="caregiver-patient-details">

                                    {patient.age !== null &&
                                        patient.age !== undefined && (
                                            <div className="caregiver-patient-detail">

                                                <CalendarDays size={16} />

                                                <div>
                                                    <span>
                                                        {t(
                                                            "caregiverPatients.age",
                                                            "Age"
                                                        )}
                                                    </span>

                                                    <strong>
                                                        {patient.age}
                                                    </strong>
                                                </div>

                                            </div>
                                        )}


                                    {(patient.city ||
                                        patient.district ||
                                        patient.state) && (
                                        <div className="caregiver-patient-detail">

                                            <MapPin size={16} />

                                            <div>
                                                <span>
                                                    {t(
                                                        "caregiverPatients.location",
                                                        "Location"
                                                    )}
                                                </span>

                                                <strong>
                                                    {[
                                                        patient.city,
                                                        patient.district,
                                                        patient.state
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </strong>
                                            </div>

                                        </div>
                                    )}


                                    {patient.gender && (
                                        <div className="caregiver-patient-detail">

                                            <UserRound size={16} />

                                            <div>
                                                <span>
                                                    {t(
                                                        "caregiverPatients.gender",
                                                        "Gender"
                                                    )}
                                                </span>

                                                <strong>
                                                    {patient.gender}
                                                </strong>
                                            </div>

                                        </div>
                                    )}

                                </div>


                                {patient.caregiver_relationship && (
                                    <div className="caregiver-patient-relationship">
                                        <span>
                                            {t(
                                                "caregiverPatients.relationship",
                                                "Relationship"
                                            )}
                                        </span>

                                        <strong>
                                            {patient.caregiver_relationship}
                                        </strong>
                                    </div>
                                )}


                                <button
                                    type="button"
                                    className="caregiver-patient-view-button"
                                    onClick={() =>
                                        handleOpenPatient(
                                            patient.id
                                        )
                                    }
                                >
                                    <span>
                                        {t(
                                            "caregiverPatients.viewRecord",
                                            "View Patient Record"
                                        )}
                                    </span>

                                    <ChevronRight size={18} />
                                </button>

                            </article>
                        ))}

                    </div>
                )}

        </section>
    );
}