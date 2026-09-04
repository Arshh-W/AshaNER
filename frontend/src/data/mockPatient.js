const patient = {
    id: "patient-001",

    name: "Grandfather Biren",

    age: 82,

    relationship: "Grandfather",

    location: "Guwahati, Assam",

    cognitiveStatus:
        "Mild Cognitive Impairment (Early Stage)",

    caregiver: {
        name: "Ananya Barua",
        relationship: "Daughter"
    },

    primaryDoctor: {
        name: "Dr. Ananya B.",
        relationship: "Daughter"
    },

    ashaWorker: {
        name: "Bina Gogoi",
        role: "ASHA Health Worker"
    },

    emergencyContact: {
        name: "Ananya Barua",
        relationship: "Daughter"
    },

    profile: {
        avatar: "👴🏽",
        residence: "Jorhat Residence",
        ward: "Ward 4"
    },

    cognitiveHealth: {
        index: 78,
        trend: "stable",
        stableDays: 36,
        sessionsReviewed: 14,

        metrics: {
            visualMemory: 82,
            spatialRecognition: 74,
            voiceLatency: 4.2
        }
    },

    mood: {
        current: "Joyful",

        weekly: [
            {
                day: "Sun",
                mood: "Serene",
                icon: "☻"
            },
            {
                day: "Mon",
                mood: "Engaged",
                icon: "☺"
            },
            {
                day: "Tue",
                mood: "Mild Fog",
                icon: "◌"
            },
            {
                day: "Wed",
                mood: "Vibrant",
                icon: "☻"
            },
            {
                day: "Thu",
                mood: "Restless",
                icon: "◒"
            },
            {
                day: "Fri",
                mood: "Peaceful",
                icon: "☺"
            },
            {
                day: "Today",
                mood: "Joyful",
                icon: "☻"
            }
        ]
    }
};

export { patient };

export default patient;