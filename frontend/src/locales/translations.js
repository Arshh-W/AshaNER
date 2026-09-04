const translations = {
    English: {
        common: {
            back: "Back",
            next: "Next",
            continue: "Continue",
            save: "Save",
            cancel: "Cancel",
            logout: "Log out",
            login: "Log in",
            create: "Create",
            loading: "Loading...",
            close: "Close",
            settings: "Settings",
            profile: "Profile",
            games: "Games"
        },

        navbar: {
            home: "Home",
            login: "Log in",
            register: "Register",
            language: "Language",
            homeRoutine: "Home & Routine",
            brainGames: "Brain Games",
            caregiverHub: "Caregiver Hub",
            emergencySOS: "Emergency SOS"
        },

        login: {
            eyebrow: "YOUR CARE SPACE",
            welcome: "Welcome back.",
            description:
                "Choose the view that fits how you care, connect, and spend time with AshaNER.",
            patientView: "PATIENT VIEW",
            caregiverView: "CAREGIVER VIEW",
            continueAsPatient: "Continue as Patient",
            continueAsCaregiver: "Continue as Caregiver",
            patientDescription:
                "Gentle activities, routines, and memory support.",
            caregiverDescription:
                "Support, progress, routines, and connected care.",
            email: "Email address",
            password: "Password",
            emailPlaceholder: "you@example.com",
            passwordPlaceholder: "Enter your password",
            dontHaveAccount: "Don't have an account?",
            createOne: "Create one",
            alreadyHaveAccount: "Already have an account?",
            incorrectCredentials: "Incorrect email or password",
            privateSecure:
                "Your information is kept private and secure."
        },

        register: {
            patientView: "PATIENT VIEW",
            caregiverView: "CAREGIVER VIEW",
            createAccount: "Create your account.",
            patientDescription:
                "Set up your personal AshaNER care space.",
            caregiverDescription:
                "Set up your connected caregiver account.",
            fullName: "Full name",
            namePlaceholder: "Your name",
            email: "Email address",
            emailPlaceholder: "you@example.com",
            password: "Password",
            passwordPlaceholder: "Create a password",
            confirmPassword: "Confirm password",
            confirmPasswordPlaceholder: "Repeat your password",
            createPatientAccount: "Create Patient Account",
            createCaregiverAccount: "Create Caregiver Account",
            alreadyHaveAccount: "Already have an account?",
            passwordMismatch: "Passwords do not match.",
            passwordTooShort:
                "Password must be at least 8 characters.",
            fillAllFields: "Please fill in all fields.",
            creatingAccount: "Creating account...",
            privateSecure:
                "Your information is kept private and secure."
        },

        roleRegister: {
            eyebrow: "YOUR CARE SPACE",
            title: "Create your AshaNER account.",
            description: "Choose how you'll use AshaNER.",
            patientView: "PATIENT VIEW",
            patientTitle: "Create a Patient Account",
            patientDescription:
                "A gentle space for activities, routines, and memory support.",
            caregiverView: "CAREGIVER VIEW",
            caregiverTitle: "Create a Caregiver Account",
            caregiverDescription:
                "Stay connected with routines, progress, and everyday care.",
            alreadyHaveAccount: "Already have an account?",
            login: "Log in"
        },

        dashboard: {
            welcome: "Welcome back",
            games: "Games",
            profile: "Profile",
            settings: "Settings",

            weather:
                "Sunny in Jorhat, 24°C • Pleasant day for tea",
            goodMorning: "Good Morning, Kangkan!",
            assameseGreeting: "(শুভ বাতিপুৱা)",
            date: "Wednesday, 4 October",
            morningBriefing: "Listen to Morning Briefing",

            careSchedule: "Today's Care Schedule",
            actionsPending: "Actions Pending",

            dueRightNow: "Due Right Now",
            morningRoutine: "Morning Routine",
            morningRoutineDescription:
                "A simple sequence of familiar activities to begin the day.",
            markTaken: "Mark Taken",
            taken: "Taken",

            routineHydration: "Routine Hydration",
            warmWaterGlass: "Warm Water Glass",
            hydrationDescription:
                "Stay hydrated for healthy blood flow. Aim for 6 glasses today.",
            hydrationTracker: "Hydration Tracker",
            of: "of",
            glasses: "Glasses",

            morningGardenWalk: "Morning Garden Walk",
            gardenWalkDescription:
                "30 mins with daughter in veranda (8:30 AM)",
            logWater: "Log 1 Glass Water",

            familyVisit: "Family Visit",
            daughter: "DAUGHTER",
            familyVisitDescription:
                "Visiting home today with fresh Assam pitha snacks",
            familyVisitNote:
                "Expected at 4:30 PM. She called at 9:00 AM to confirm she is bringing your favorite tea leaves.",
            callAnanya: "Call Ananya (One-Touch)",
            callingAnanya: "Calling Ananya Barua…",

            streak: "Streak: 4 Days Active",
            dailyGentleRecall: "Daily Gentle Recall",
            brainPuzzle: "Today's Brain Puzzle:",
            kazirangaTea: "Kaziranga & Tea Garden",
            patternMatch: "Pattern Match",
            brainDescription:
                "Gentle 5-minute memory exercise to stimulate recall. Match serene regional flora, birds, and tea plantation memories. No rush, take all the time you need.",
            fiveMinutes: "5 Minutes",
            relaxedPace: "Relaxed Pace",
            assameseSupport: "Assamese Support",
            teaGarden: "Tea Garden",
            playBrainGame: "Play Brain Game",

            needHelp: "Need help right away?",
            helpDescription:
                "One tap connects directly to Daughter Ananya or a local ASHA Health Worker Bina Gogoi.",
            sayHeyAsha: "Say “Hey Asha”",
            callAsha: "Call ASHA Bina",
            voiceHelp:
                "Would you like to search for the Bamboo Jaapi hat, Biren?"
        },

        settings: {
            title: "Settings",
            language: "Language",
            selectLanguage: "Select your language"
        },

        caregiverDashboard: {
            ashaConnected: "ASHA Connected",
            mildCognitiveImpairment:
                "Mild Cognitive Impairment (Early Stage)",
            primaryDoctor:
                "Primary Dr. Ananya B. (Daughter)",
            viewASHAData: "View ASHA Data",
            logNote: "Log Note",
            emergencyCall:
                "Emergency call to caregiver team.",
            emergencyCallButton: "Emergency Call",
            status: "Status",
            restingComfortably:
                "Resting comfortably at home",
            allMorningVitalsNormal:
                "All Morning Vitals Normal",
            jorhatResidence: "Jorhat Residence",
            pending: "Pending",
            longitudinalMetric: "LONGITUDINAL METRIC",
            cognitiveHealthIndex:
                "Cognitive Health Index",
            stablePast36Days:
                "Stable past 36 days",
            zeroClinicalDecline:
                "Zero clinical decline flagged across last 14 verbal orientation & image recall sessions.",
            visualMemory:
                "Visual Memory (Tea Leaf & Loom Patterns)",
            spatialRecognition:
                "Spatial Recognition (Courtyard & House Map)",
            voiceLatencyResponse:
                "Voice Latency Response",
            dailyTracker: "DAILY TRACKER",
            routineAndCareProtocol:
                "Routine & Care Protocol",
            completedToday: "Completed Today",
            recordedBP:
                "Recorded: 124/82 mmHg • Pulse 71 bpm",
            hydrationLogged:
                "4 of 6 Grass Bottles Logged (1.4L of 2.0L goal)",
            brainGameCompleted:
                "Assisted Brain Game module completed with grandchild",
            scheduled: "Scheduled with warm milk",
            affectiveWellbeing:
                "AFFECTIVE WELLBEING",
            emotionalStability:
                "7-Day Emotional Stability & Mood Spectrum",
            ashaCognitivePatternObservation:
                "Asha Cognitive Pattern Observation",
            positiveEngagementSpikes:
                "Positive emotional engagement spikes reliably during afternoon tea-garden pattern games and scheduled voice calls with his granddaughter in Guwahati. Sundowning restlessness is minimized when porch lighting is activated by 5:15 PM.",
            activeSpeech: "Active speech",
            voiceCheck: "Voice check",
            shareWithCareTeam:
                "Share with Care Team",
            clinicalAppointment:
                "CLINICAL APPOINTMENT",
            in4Days: "In 4 Days",
            specialistConsultation:
                "Specialist Consultation",
            clinicalReportPrepared:
                "Clinical report prepared for export.",
            exportClinicalPDF:
                "Export Clinical PDF (ICD-10)",
            sentToBina: "Sent to Bina",
            shareAccessWithBina:
                "Share Access with Bina (ASHA)",
            defensiveCareTelemetry:
                "DEFENSIVE CARE TELEMETRY",
            safetyThresholds:
                "Safety Thresholds",
            geoFenceActive:
                "Geo-fence Active",
            jorhatFamilyCompound:
                "Jorhat Family Compound (360m)",
            missedDoseAlert:
                "Missed Dose Alert",
            notifyAfter45Min:
                "Notify Daughter & ASHA after +45 min",
            encryptedNDHMHealthID:
                "Encrypted NDHM Health ID Linked",
            configureLimits:
                "Configure Limits"
        }
    },

    Assamese: {
        common: {
            back: "পিছলৈ",
            next: "আগলৈ",
            continue: "আগবাঢ়ক",
            save: "সংৰক্ষণ কৰক",
            cancel: "বাতিল কৰক",
            logout: "লগ আউট",
            login: "লগ ইন",
            create: "সৃষ্টি কৰক",
            loading: "লোড হৈ আছে...",
            close: "বন্ধ কৰক",
            settings: "ছেটিংছ",
            profile: "প্ৰফাইল",
            games: "খেলসমূহ"
        },

        navbar: {
            home: "হোম",
            login: "লগ ইন",
            register: "পঞ্জীয়ন",
            language: "ভাষা",
            homeRoutine: "হোম আৰু ৰুটিন",
            brainGames: "মগজুৰ খেল",
            caregiverHub: "যত্নদাতা হাব",
            emergencySOS: "জৰুৰী SOS"
        },

        login: {
            eyebrow: "আপোনাৰ যত্নৰ স্থান",
            welcome: "পুনৰ স্বাগতম।",
            description:
                "আপুনি AshaNER কেনেকৈ ব্যৱহাৰ কৰিব বিচাৰে সেই অনুসৰি দৃশ্য বাছনি কৰক।",
            patientView: "ৰোগীৰ দৃশ্য",
            caregiverView: "যত্নদাতাৰ দৃশ্য",
            continueAsPatient:
                "ৰোগী হিচাপে আগবাঢ়ক",
            continueAsCaregiver:
                "যত্নদাতা হিচাপে আগবাঢ়ক",
            patientDescription:
                "সহজ কাৰ্যকলাপ, দৈনন্দিন ৰুটিন আৰু স্মৃতি সহায়তা।",
            caregiverDescription:
                "সহায়তা, অগ্ৰগতি, ৰুটিন আৰু সংযুক্ত যত্ন।",
            email: "ইমেইল ঠিকনা",
            password: "পাছৱৰ্ড",
            emailPlaceholder: "you@example.com",
            passwordPlaceholder:
                "আপোনাৰ পাছৱৰ্ড লিখক",
            dontHaveAccount:
                "একাউণ্ট নাই নেকি?",
            createOne: "এটা সৃষ্টি কৰক",
            alreadyHaveAccount:
                "ইতিমধ্যে একাউণ্ট আছে নেকি?",
            incorrectCredentials:
                "ইমেইল বা পাছৱৰ্ড ভুল",
            privateSecure:
                "আপোনাৰ তথ্য ব্যক্তিগত আৰু সুৰক্ষিত ৰখা হয়।"
        },

        register: {
            patientView: "ৰোগীৰ দৃশ্য",
            caregiverView: "যত্নদাতাৰ দৃশ্য",
            createAccount:
                "আপোনাৰ একাউণ্ট সৃষ্টি কৰক।",
            patientDescription:
                "আপোনাৰ ব্যক্তিগত AshaNER যত্নৰ স্থান স্থাপন কৰক।",
            caregiverDescription:
                "আপোনাৰ সংযুক্ত যত্নদাতা একাউণ্ট স্থাপন কৰক।",
            fullName: "সম্পূৰ্ণ নাম",
            namePlaceholder: "আপোনাৰ নাম",
            email: "ইমেইল ঠিকনা",
            emailPlaceholder: "you@example.com",
            password: "পাছৱৰ্ড",
            passwordPlaceholder:
                "এটা পাছৱৰ্ড সৃষ্টি কৰক",
            confirmPassword:
                "পাছৱৰ্ড নিশ্চিত কৰক",
            confirmPasswordPlaceholder:
                "পাছৱৰ্ড পুনৰ লিখক",
            createPatientAccount:
                "ৰোগীৰ একাউণ্ট সৃষ্টি কৰক",
            createCaregiverAccount:
                "যত্নদাতাৰ একাউণ্ট সৃষ্টি কৰক",
            alreadyHaveAccount:
                "ইতিমধ্যে একাউণ্ট আছে নেকি?",
            passwordMismatch:
                "পাছৱৰ্ড দুটা মিল নাই।",
            passwordTooShort:
                "পাছৱৰ্ড কমেও ৮টা আখৰৰ হ'ব লাগিব।",
            fillAllFields:
                "অনুগ্ৰহ কৰি সকলো তথ্য পূৰণ কৰক।",
            creatingAccount:
                "একাউণ্ট সৃষ্টি হৈ আছে...",
            privateSecure:
                "আপোনাৰ তথ্য ব্যক্তিগত আৰু সুৰক্ষিত ৰখা হয়।"
        },

        roleRegister: {
            eyebrow: "আপোনাৰ যত্নৰ স্থান",
            title:
                "আপোনাৰ AshaNER একাউণ্ট সৃষ্টি কৰক।",
            description:
                "আপুনি AshaNER কেনেদৰে ব্যৱহাৰ কৰিব সেইটো বাছনি কৰক।",
            patientView: "ৰোগীৰ দৃশ্য",
            patientTitle:
                "ৰোগীৰ একাউণ্ট সৃষ্টি কৰক",
            patientDescription:
                "কাৰ্যকলাপ, ৰুটিন আৰু স্মৃতি সহায়তাৰ বাবে এটা সহজ স্থান।",
            caregiverView:
                "যত্নদাতাৰ দৃশ্য",
            caregiverTitle:
                "যত্নদাতাৰ একাউণ্ট সৃষ্টি কৰক",
            caregiverDescription:
                "ৰুটিন, অগ্ৰগতি আৰু দৈনন্দিন যত্নৰ সৈতে সংযুক্ত থাকক।",
            alreadyHaveAccount:
                "ইতিমধ্যে একাউণ্ট আছে নেকি?",
            login: "লগ ইন"
        },

        dashboard: {
            welcome: "পুনৰ স্বাগতম",
            games: "খেলসমূহ",
            profile: "প্ৰফাইল",
            settings: "ছেটিংছ",

            weather:
                "যোৰহাটত ৰ'দঘাই, ২৪°C • চাহৰ বাবে মনোৰম দিন",
            goodMorning:
                "সুপ্ৰভাত, কংকণ!",
            assameseGreeting:
                "(শুভ বাতিপুৱা)",
            date:
                "বুধবাৰ, ৪ অক্টোবৰ",
            morningBriefing:
                "পুৱাৰ বিৱৰণ শুনক",

            careSchedule:
                "আজিৰ যত্নৰ সময়সূচী",
            actionsPending:
                "টা কাম বাকী আছে",

            dueRightNow:
                "এতিয়াই কৰিবলগীয়া",
            morningRoutine:
                "পুৱাৰ ৰুটিন",
            morningRoutineDescription:
                "দিনটো আৰম্ভ কৰিবলৈ চিনাকি কাৰ্যকলাপৰ এটা সহজ ক্ৰম।",
            markTaken:
                "সম্পন্ন বুলি চিহ্নিত কৰক",
            taken: "সম্পন্ন",

            routineHydration:
                "নিয়মীয়া পানী গ্ৰহণ",
            warmWaterGlass:
                "এগিলাচ গৰম পানী",
            hydrationDescription:
                "সুস্থ ৰক্ত সঞ্চালনৰ বাবে পৰ্যাপ্ত পানী খাওক। আজি ৬ গিলাচৰ লক্ষ্য ৰাখক।",
            hydrationTracker:
                "পানী গ্ৰহণৰ ট্ৰেকাৰ",
            of: "ৰ ভিতৰত",
            glasses: "গিলাচ",

            morningGardenWalk:
                "পুৱাৰ বাগিচা ভ্ৰমণ",
            gardenWalkDescription:
                "জীয়েকৰ সৈতে বাৰান্দাত ৩০ মিনিট (পুৱা ৮:৩০)",
            logWater:
                "১ গিলাচ পানী যোগ কৰক",

            familyVisit:
                "পৰিয়ালৰ সাক্ষাৎ",
            daughter: "জীয়েক",
            familyVisitDescription:
                "আজি সতেজ অসমীয়া পিঠা লৈ ঘৰলৈ আহিছে",
            familyVisitNote:
                "বিয়লি ৪:৩০ বজাত অহাৰ কথা। পুৱা ৯:০০ বজাত ফোন কৰি আপোনাৰ প্ৰিয় চাহপাত লৈ অহাৰ কথা জনাইছিল।",
            callAnanya:
                "অনন্যাক ফোন কৰক",
            callingAnanya:
                "অনন্যা বৰুৱালৈ ফোন কৰা হৈছে…",

            streak:
                "ধাৰাবাহিকতা: ৪ দিন সক্ৰিয়",
            dailyGentleRecall:
                "দৈনিক সহজ স্মৃতি অনুশীলন",
            brainPuzzle:
                "আজিৰ মগজুৰ সাঁথৰ:",
            kazirangaTea:
                "কাজিৰঙা আৰু চাহ বাগিচা",
            patternMatch:
                "আৰ্হি মিলোৱা",
            brainDescription:
                "স্মৃতি সক্ৰিয় কৰিবলৈ ৫ মিনিটৰ সহজ স্মৃতি অনুশীলন। অঞ্চলটোৰ উদ্ভিদ, চৰাই আৰু চাহ বাগিচাৰ স্মৃতি মিলাওক। কোনো খৰখেদা নাই, নিজৰ সময় লৈ কৰক।",
            fiveMinutes:
                "৫ মিনিট",
            relaxedPace:
                "সহজ গতি",
            assameseSupport:
                "অসমীয়া সহায়তা",
            teaGarden:
                "চাহ বাগিচা",
            playBrainGame:
                "মগজুৰ খেল খেলক",

            needHelp:
                "এতিয়াই সহায়ৰ প্ৰয়োজন নেকি?",
            helpDescription:
                "এটা টেপতে জীয়েক অনন্যা বা স্থানীয় ASHA স্বাস্থ্যকৰ্মী বিনা গগৈৰ সৈতে যোগাযোগ কৰিব পাৰিব।",
            sayHeyAsha:
                "“Hey Asha” বুলি কওক",
            callAsha:
                "ASHA বিনাক ফোন কৰক",
            voiceHelp:
                "বিৰেণ, আপুনি বাঁহৰ জাপি টুপী বিচাৰিব বিচাৰে নেকি?"
        },

        settings: {
            title: "ছেটিংছ",
            language: "ভাষা",
            selectLanguage:
                "আপোনাৰ ভাষা বাছনি কৰক"
        },

        caregiverDashboard: {
            ashaConnected: "ASHA সংযোগিত",
            mildCognitiveImpairment:
                "হালকা বুদ্ধিবৃত্তিক সমস্যা (প্ৰাৰম্ভিক অৱস্থা)",
            primaryDoctor:
                "প্ৰধান চিকিৎসক অনন্যা বি. (জীয়েক)",
            viewASHAData:
                "ASHA তথ্য চাওক",
            logNote:
                "নোট যোগ কৰক",
            emergencyCall:
                "যত্নদাতা দললৈ জৰুৰী ফোন।",
            emergencyCallButton:
                "জৰুৰী ফোন",
            status:
                "অৱস্থা",
            restingComfortably:
                "ঘৰত আৰামত বিশ্ৰাম লৈ আছে",
            allMorningVitalsNormal:
                "পুৱাৰ সকলো স্বাস্থ্য সূচক স্বাভাৱিক",
            jorhatResidence:
                "যোৰহাট বাসস্থান",
            pending:
                "বাকী",
            longitudinalMetric:
                "দীৰ্ঘম্যাদী মেট্ৰিক",
            cognitiveHealthIndex:
                "জ্ঞানীয় স্বাস্থ্য সূচক",
            stablePast36Days:
                "যোৱা ৩৬ দিনত স্থিৰ",
            zeroClinicalDecline:
                "যোৱা ১৪টা মৌখিক দিশ-নিৰ্দেশ আৰু ছবি স্মৃতি অধিবেশনত কোনো ক্লিনিকেল অৱনতি পোৱা হোৱা নাই।",
            visualMemory:
                "দৃশ্য স্মৃতি (চাহপাত আৰু তাঁত আৰ্হি)",
            spatialRecognition:
                "স্থানিক চিনাক্তকৰণ (চোতাল আৰু ঘৰৰ মানচিত্ৰ)",
            voiceLatencyResponse:
                "কণ্ঠ বিলম্ব সঁহাৰি",
            dailyTracker:
                "দৈনিক ট্ৰেকাৰ",
            routineAndCareProtocol:
                "ৰুটিন আৰু যত্ন প্ৰটোকল",
            completedToday:
                "আজি সম্পূৰ্ণ",
            recordedBP:
                "ৰেকৰ্ড: 124/82 mmHg • নাড়ী 71 bpm",
            hydrationLogged:
                "৬ৰ ভিতৰত ৪টা বটল লগ কৰা হৈছে",
            brainGameCompleted:
                "নাতিৰ সৈতে মগজুৰ খেল সম্পূৰ্ণ",
            scheduled:
                "গৰম গাখীৰৰ সৈতে নিৰ্ধাৰিত",
            affectiveWellbeing:
                "আৱেগিক সুস্থতা",
            emotionalStability:
                "৭ দিনৰ আৱেগিক স্থিৰতা",
            ashaCognitivePatternObservation:
                "ASHA জ্ঞানীয় আৰ্হি পৰ্যবেক্ষণ",
            positiveEngagementSpikes:
                "চাহ-বাগিচাৰ আৰ্হি খেল আৰু পৰিয়ালৰ সৈতে কণ্ঠ কলৰ সময়ত ইতিবাচক অংশগ্ৰহণ বৃদ্ধি পায়।",
            activeSpeech:
                "সক্ৰিয় কথা-বতৰা",
            voiceCheck:
                "কণ্ঠ পৰীক্ষা",
            shareWithCareTeam:
                "যত্ন দলৰ সৈতে শ্বেয়াৰ কৰক",
            clinicalAppointment:
                "ক্লিনিকেল এপইণ্টমেণ্ট",
            in4Days:
                "৪ দিনৰ পিছত",
            specialistConsultation:
                "বিশেষজ্ঞৰ পৰামৰ্শ",
            clinicalReportPrepared:
                "এক্সপৰ্টৰ বাবে ক্লিনিকেল প্ৰতিবেদন প্ৰস্তুত।",
            exportClinicalPDF:
                "ক্লিনিকেল PDF এক্সপৰ্ট কৰক (ICD-10)",
            sentToBina:
                "বিনালৈ পঠিওৱা হৈছে",
            shareAccessWithBina:
                "বিনা (ASHA)-ৰ সৈতে এক্সেছ শ্বেয়াৰ কৰক",
            defensiveCareTelemetry:
                "নিৰাপত্তা যত্ন টেলিমেট্ৰি",
            safetyThresholds:
                "নিৰাপত্তাৰ সীমা",
            geoFenceActive:
                "জিঅ'-ফেন্স সক্ৰিয়",
            jorhatFamilyCompound:
                "যোৰহাট পৰিয়ালৰ চৌহদ (৩৬০m)",
            missedDoseAlert:
                "বাদ পৰা ঔষধৰ সতৰ্কবাণী",
            notifyAfter45Min:
                "৪৫ মিনিটৰ পিছত জীয়েক আৰু ASHA-ক জনাওক",
            encryptedNDHMHealthID:
                "এনক্ৰিপ্টেড NDHM Health ID সংযুক্ত",
            configureLimits:
                "সীমা কনফিগাৰ কৰক"
        }
    },

    Bengali: {
        common: {
            back: "পিছনে",
            next: "পরবর্তী",
            continue: "চালিয়ে যান",
            save: "সংরক্ষণ করুন",
            cancel: "বাতিল করুন",
            logout: "লগ আউট",
            login: "লগ ইন",
            create: "তৈরি করুন",
            loading: "লোড হচ্ছে...",
            close: "বন্ধ করুন",
            settings: "সেটিংস",
            profile: "প্রোফাইল",
            games: "গেম"
        },

        navbar: {
            home: "হোম",
            login: "লগ ইন",
            register: "নিবন্ধন",
            language: "ভাষা",
            homeRoutine: "হোম ও রুটিন",
            brainGames: "মস্তিষ্কের খেলা",
            caregiverHub: "যত্নদাতা হাব",
            emergencySOS: "জরুরি SOS"
        },

        login: {
            eyebrow: "আপনার যত্নের স্থান",
            welcome: "আবার স্বাগতম।",
            description:
                "আপনি কীভাবে AshaNER ব্যবহার করবেন তার জন্য উপযুক্ত দৃশ্য বেছে নিন।",
            patientView: "রোগীর দৃশ্য",
            caregiverView: "যত্নদাতার দৃশ্য",
            continueAsPatient:
                "রোগী হিসেবে চালিয়ে যান",
            continueAsCaregiver:
                "যত্নদাতা হিসেবে চালিয়ে যান",
            patientDescription:
                "সহজ কার্যকলাপ, রুটিন এবং স্মৃতি সহায়তা।",
            caregiverDescription:
                "সহায়তা, অগ্রগতি, রুটিন এবং সংযুক্ত যত্ন।",
            email: "ইমেল ঠিকানা",
            password: "পাসওয়ার্ড",
            emailPlaceholder:
                "you@example.com",
            passwordPlaceholder:
                "আপনার পাসওয়ার্ড লিখুন",
            dontHaveAccount:
                "অ্যাকাউন্ট নেই?",
            createOne:
                "তৈরি করুন",
            alreadyHaveAccount:
                "ইতিমধ্যে অ্যাকাউন্ট আছে?",
            incorrectCredentials:
                "ভুল ইমেল বা পাসওয়ার্ড",
            privateSecure:
                "আপনার তথ্য ব্যক্তিগত এবং সুরক্ষিত রাখা হয়।"
        },

        register: {
            patientView: "রোগীর দৃশ্য",
            caregiverView:
                "যত্নদাতার দৃশ্য",
            createAccount:
                "আপনার অ্যাকাউন্ট তৈরি করুন।",
            patientDescription:
                "আপনার ব্যক্তিগত AshaNER যত্নের স্থান তৈরি করুন।",
            caregiverDescription:
                "আপনার সংযুক্ত যত্নদাতা অ্যাকাউন্ট তৈরি করুন।",
            fullName:
                "পুরো নাম",
            namePlaceholder:
                "আপনার নাম",
            email:
                "ইমেল ঠিকানা",
            emailPlaceholder:
                "you@example.com",
            password:
                "পাসওয়ার্ড",
            passwordPlaceholder:
                "একটি পাসওয়ার্ড তৈরি করুন",
            confirmPassword:
                "পাসওয়ার্ড নিশ্চিত করুন",
            confirmPasswordPlaceholder:
                "পাসওয়ার্ড আবার লিখুন",
            createPatientAccount:
                "রোগীর অ্যাকাউন্ট তৈরি করুন",
            createCaregiverAccount:
                "যত্নদাতার অ্যাকাউন্ট তৈরি করুন",
            alreadyHaveAccount:
                "ইতিমধ্যে অ্যাকাউন্ট আছে?",
            passwordMismatch:
                "পাসওয়ার্ড মিলছে না।",
            passwordTooShort:
                "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
            fillAllFields:
                "অনুগ্রহ করে সব ঘর পূরণ করুন।",
            creatingAccount:
                "অ্যাকাউন্ট তৈরি হচ্ছে...",
            privateSecure:
                "আপনার তথ্য ব্যক্তিগত এবং সুরক্ষিত রাখা হয়।"
        },

        roleRegister: {
            eyebrow:
                "আপনার যত্নের স্থান",
            title:
                "আপনার AshaNER অ্যাকাউন্ট তৈরি করুন।",
            description:
                "আপনি কীভাবে AshaNER ব্যবহার করবেন তা বেছে নিন।",
            patientView:
                "রোগীর দৃশ্য",
            patientTitle:
                "রোগীর অ্যাকাউন্ট তৈরি করুন",
            patientDescription:
                "কার্যকলাপ, রুটিন এবং স্মৃতি সহায়তার জন্য একটি সহজ স্থান।",
            caregiverView:
                "যত্নদাতার দৃশ্য",
            caregiverTitle:
                "যত্নদাতার অ্যাকাউন্ট তৈরি করুন",
            caregiverDescription:
                "রুটিন, অগ্রগতি এবং দৈনন্দিন যত্নের সাথে সংযুক্ত থাকুন।",
            alreadyHaveAccount:
                "ইতিমধ্যে অ্যাকাউন্ট আছে?",
            login:
                "লগ ইন"
        },

        dashboard: {
            welcome: "আবার স্বাগতম",
            games: "গেম",
            profile: "প্রোফাইল",
            settings: "সেটিংস",

            weather:
                "জোরহাটে রৌদ্রোজ্জ্বল, ২৪°C • চায়ের জন্য মনোরম দিন",
            goodMorning:
                "সুপ্রভাত, কঙ্কণ!",
            assameseGreeting:
                "(শুভ বাতিপুৱা)",
            date:
                "বুধবার, ৪ অক্টোবর",
            morningBriefing:
                "সকালের বিবরণ শুনুন",

            careSchedule:
                "আজকের যত্নের সময়সূচি",
            actionsPending:
                "টি কাজ বাকি",

            dueRightNow:
                "এখনই করার সময়",
            morningRoutine:
                "সকালের রুটিন",
            morningRoutineDescription:
                "দিন শুরু করার জন্য পরিচিত কার্যকলাপের একটি সহজ ধারা।",
            markTaken:
                "সম্পন্ন হিসেবে চিহ্নিত করুন",
            taken:
                "সম্পন্ন",

            routineHydration:
                "নিয়মিত জলপান",
            warmWaterGlass:
                "এক গ্লাস গরম জল",
            hydrationDescription:
                "সুস্থ রক্ত সঞ্চালনের জন্য পর্যাপ্ত জল পান করুন। আজ ৬ গ্লাসের লক্ষ্য রাখুন।",
            hydrationTracker:
                "জলপান ট্র্যাকার",
            of:
                "এর মধ্যে",
            glasses:
                "গ্লাস",

            morningGardenWalk:
                "সকালের বাগান ভ্রমণ",
            gardenWalkDescription:
                "মেয়ের সঙ্গে বারান্দায় ৩০ মিনিট (সকাল ৮:৩০)",
            logWater:
                "১ গ্লাস জল যোগ করুন",

            familyVisit:
                "পরিবারের সাক্ষাৎ",
            daughter:
                "মেয়ে",
            familyVisitDescription:
                "আজ তাজা অসমীয়া পিঠা নিয়ে বাড়িতে আসছেন",
            familyVisitNote:
                "বিকেল ৪:৩০টায় আসার কথা। সকাল ৯:০০টায় ফোন করে জানিয়েছেন যে আপনার প্রিয় চা পাতা নিয়ে আসছেন।",
            callAnanya:
                "অনন্যাকে ফোন করুন",
            callingAnanya:
                "অনন্যা বড়ুয়াকে ফোন করা হচ্ছে…",

            streak:
                "ধারাবাহিকতা: ৪ দিন সক্রিয়",
            dailyGentleRecall:
                "দৈনিক সহজ স্মৃতি অনুশীলন",
            brainPuzzle:
                "আজকের মস্তিষ্কের ধাঁধা:",
            kazirangaTea:
                "কাজিরাঙা ও চা বাগান",
            patternMatch:
                "নকশা মিলান",
            brainDescription:
                "স্মৃতি সক্রিয় করার জন্য ৫ মিনিটের সহজ স্মৃতি অনুশীলন। আঞ্চলিক উদ্ভিদ, পাখি এবং চা বাগানের স্মৃতি মিলিয়ে নিন। তাড়াহুড়ো নেই, নিজের সময় নিন।",
            fiveMinutes:
                "৫ মিনিট",
            relaxedPace:
                "স্বচ্ছন্দ গতি",
            assameseSupport:
                "অসমীয়া সহায়তা",
            teaGarden:
                "চা বাগান",
            playBrainGame:
                "মস্তিষ্কের খেলা খেলুন",

            needHelp:
                "এখনই সাহায্য দরকার?",
            helpDescription:
                "একটি ট্যাপেই মেয়ে অনন্যা অথবা স্থানীয় ASHA স্বাস্থ্যকর্মী বিনা গগৈয়ের সঙ্গে যোগাযোগ করা যাবে।",
            sayHeyAsha:
                "“Hey Asha” বলুন",
            callAsha:
                "ASHA বিনাকে ফোন করুন",
            voiceHelp:
                "বিরেন, আপনি কি বাঁশের জাপি টুপি খুঁজতে চান?"
        },

        settings: {
            title: "সেটিংস",
            language: "ভাষা",
            selectLanguage:
                "আপনার ভাষা নির্বাচন করুন"
        },

        caregiverDashboard: {
            ashaConnected:
                "ASHA সংযুক্ত",
            mildCognitiveImpairment:
                "হালকা বুদ্ধিবৃত্তি সমস্যা (প্রাথমিক পর্যায়)",
            primaryDoctor:
                "প্রধান ডাক্তার অনন্যা বি. (মেয়ে)",
            viewASHAData:
                "ASHA ডেটা দেখুন",
            logNote:
                "নোট যোগ করুন",
            emergencyCall:
                "যত্নদাতা দলের জন্য জরুরি কল।",
            emergencyCallButton:
                "জরুরি কল",
            status:
                "অবস্থা",
            restingComfortably:
                "বাড়িতে আরামে বিশ্রাম নিচ্ছেন",
            allMorningVitalsNormal:
                "সকালের সমস্ত স্বাস্থ্য সূচক স্বাভাবিক",
            jorhatResidence:
                "জোরহাট বাসস্থান",
            pending:
                "অপেক্ষমাণ",
            longitudinalMetric:
                "দীর্ঘমেয়াদী মেট্রিক",
            cognitiveHealthIndex:
                "জ্ঞানীয় স্বাস্থ্য সূচক",
            stablePast36Days:
                "গত ৩৬ দিন স্থিতিশীল",
            zeroClinicalDecline:
                "গত ১৪টি মৌখিক ওরিয়েন্টেশন এবং ছবি স্মৃতি সেশনে কোনো ক্লিনিক্যাল অবনতি পাওয়া যায়নি।",
            visualMemory:
                "দৃশ্য স্মৃতি (চা পাতা ও তাঁতের নকশা)",
            spatialRecognition:
                "স্থানিক স্বীকৃতি (উঠান ও বাড়ির মানচিত্র)",
            voiceLatencyResponse:
                "ভয়েস লেটেন্সি প্রতিক্রিয়া",
            dailyTracker:
                "দৈনিক ট্র্যাকার",
            routineAndCareProtocol:
                "রুটিন ও যত্ন প্রোটোকল",
            completedToday:
                "আজ সম্পন্ন",
            recordedBP:
                "রেকর্ড: 124/82 mmHg • পালস 71 bpm",
            hydrationLogged:
                "৬টির মধ্যে ৪টি বোতল লগ করা হয়েছে",
            brainGameCompleted:
                "নাতির সঙ্গে মস্তিষ্কের খেলা সম্পন্ন",
            scheduled:
                "গরম দুধের সাথে নির্ধারিত",
            affectiveWellbeing:
                "আবেগীয় সুস্থতা",
            emotionalStability:
                "৭ দিনের আবেগীয় স্থিতিশীলতা",
            ashaCognitivePatternObservation:
                "ASHA জ্ঞানীয় প্যাটার্ন পর্যবেক্ষণ",
            positiveEngagementSpikes:
                "চা-বাগিচার প্যাটার্ন গেম এবং পরিবারের সঙ্গে ভয়েস কলের সময় ইতিবাচক অংশগ্রহণ বৃদ্ধি পায়।",
            activeSpeech:
                "সক্রিয় কথা",
            voiceCheck:
                "ভয়েস চেক",
            shareWithCareTeam:
                "কেয়ার টিমের সাথে শেয়ার করুন",
            clinicalAppointment:
                "ক্লিনিক্যাল অ্যাপয়েন্টমেন্ট",
            in4Days:
                "৪ দিনের মধ্যে",
            specialistConsultation:
                "বিশেষজ্ঞ পরামর্শ",
            clinicalReportPrepared:
                "এক্সপোর্টের জন্য ক্লিনিক্যাল রিপোর্ট প্রস্তুত।",
            exportClinicalPDF:
                "ক্লিনিক্যাল PDF এক্সপোর্ট করুন (ICD-10)",
            sentToBina:
                "বিনাকে পাঠানো হয়েছে",
            shareAccessWithBina:
                "বিনা (ASHA)-এর সাথে অ্যাক্সেস শেয়ার করুন",
            defensiveCareTelemetry:
                "নিরাপত্তা যত্ন টেলিমেট্রি",
            safetyThresholds:
                "নিরাপত্তা সীমা",
            geoFenceActive:
                "জিও-ফেন্স সক্রিয়",
            jorhatFamilyCompound:
                "জোরহাট পারিবারিক চত্বর (৩৬০m)",
            missedDoseAlert:
                "মিস হওয়া ডোজ সতর্কতা",
            notifyAfter45Min:
                "৪৫ মিনিট পর মেয়ে ও ASHA-কে জানান",
            encryptedNDHMHealthID:
                "এনক্রিপ্টেড NDHM Health ID সংযুক্ত",
            configureLimits:
                "সীমা কনফিগার করুন"
        }
    },

    Manipuri: {
        common: {
            back: "মতুংদা",
            next: "মখাদা",
            continue: "মখাদা চৎপা",
            save: "থাম্মু",
            cancel: "ক্যান্সেল",
            logout: "লগ আউট",
            login: "লগ ইন",
            create: "শেম্বা",
            loading: "লোড তৌরি...",
            close: "হাপচিনবা",
            settings: "সেটিংস",
            profile: "প্রোফাইল",
            games: "গেমশিং"
        },

        navbar: {
            home: "হোম",
            login: "লগ ইন",
            register: "রেজিস্টার",
            language: "লোন",
            homeRoutine: "হোম অমসুং রুটিন",
            brainGames: "ব্রেইন গেমশিং",
            caregiverHub: "কেয়ারগিভার হাব",
            emergencySOS: "ইমার্জেন্সি SOS"
        },

        login: {
            eyebrow:
                "নহাক্কী কেয়ার স্পেস",
            welcome:
                "হায়রাই ফংদোকই।",
            description:
                "AshaNER-গা নহাক্না করম্না শিজিন্নগদগী মরমদা ময়ামদা থাদোকপা ভিউ শেমজবা।",
            patientView:
                "পেশেন্ট ভিউ",
            caregiverView:
                "কেয়ারগিভার ভিউ",
            continueAsPatient:
                "পেশেন্ট অমা ওইনা মখাদা চৎপা",
            continueAsCaregiver:
                "কেয়ারগিভার অমা ওইনা মখাদা চৎপা",
            patientDescription:
                "নুমিতকী থৌওং, রুটিন অমসুং মেমোরি সাপোর্ট।",
            caregiverDescription:
                "সাপোর্ট, প্রোগ্রেস, রুটিন অমসুং কানেক্টেড কেয়ার।",
            email:
                "ইমেইল ঠিকানা",
            password:
                "পাসওয়ার্ড",
            emailPlaceholder:
                "you@example.com",
            passwordPlaceholder:
                "পাসওয়ার্ড লিখউ",
            dontHaveAccount:
                "অ্যাকাউন্ট নত্ত্রা?",
            createOne:
                "অমা শেম্মু",
            alreadyHaveAccount:
                "অ্যাকাউন্ট লৈরে?",
            incorrectCredentials:
                "ইমেইল নত্ত্রা পাসওয়ার্ড শোয়",
            privateSecure:
                "নহাক্কী ইনফরমেশন প্রাইভেট অমসুং সিকিউর ওইনা থাগনি।"
        },

        register: {
            patientView:
                "পেশেন্ট ভিউ",
            caregiverView:
                "কেয়ারগিভার ভিউ",
            createAccount:
                "নহাক্কী অ্যাকাউন্ট শেম্মু।",
            patientDescription:
                "নহাক্কী ব্যক্তিগত AshaNER কেয়ার স্পেস শেম্মু।",
            caregiverDescription:
                "নহাক্কী কানেক্টেড কেয়ারগিভার অ্যাকাউন্ট শেম্মু।",
            fullName:
                "মিং",
            namePlaceholder:
                "নহাক্কী মিং",
            email:
                "ইমেইল ঠিকানা",
            emailPlaceholder:
                "you@example.com",
            password:
                "পাসওয়ার্ড",
            passwordPlaceholder:
                "পাসওয়ার্ড অমা শেম্মু",
            confirmPassword:
                "পাসওয়ার্ড কনফার্ম তৌ",
            confirmPasswordPlaceholder:
                "পাসওয়ার্ড অমুক হন্না লিখউ",
            createPatientAccount:
                "পেশেন্ট অ্যাকাউন্ট শেম্মু",
            createCaregiverAccount:
                "কেয়ারগিভার অ্যাকাউন্ট শেম্মু",
            alreadyHaveAccount:
                "অ্যাকাউন্ট লৈরে?",
            passwordMismatch:
                "পাসওয়ার্ড অনৌবা নত্তে।",
            passwordTooShort:
                "পাসওয়ার্ড ৮ অক্ষরগী হায়গী ওইগদবনি।",
            fillAllFields:
                "মখলগী ফিল্ডশিং পূর্ণ তৌ।",
            creatingAccount:
                "অ্যাকাউন্ট শেম্বা লৌরি...",
            privateSecure:
                "নহাক্কী ইনফরমেশন প্রাইভেট অমসুং সিকিউর ওইনা থাগনি।"
        },

        roleRegister: {
            eyebrow:
                "নহাক্কী কেয়ার স্পেস",
            title:
                "নহাক্কী AshaNER অ্যাকাউন্ট শেম্মু।",
            description:
                "AshaNER করম্না শিজিন্নগদগী খনবা।",
            patientView:
                "পেশেন্ট ভিউ",
            patientTitle:
                "পেশেন্ট অ্যাকাউন্ট শেম্মু",
            patientDescription:
                "অ্যাক্টিভিটি, রুটিন অমসুং মেমোরি সাপোর্টকী নুমিতকী স্পেস।",
            caregiverView:
                "কেয়ারগিভার ভিউ",
            caregiverTitle:
                "কেয়ারগিভার অ্যাকাউন্ট শেম্মু",
            caregiverDescription:
                "রুটিন, প্রোগ্রেস অমসুং নুমিতকী কেয়ারগা কানেক্টেড ওইরো।",
            alreadyHaveAccount:
                "অ্যাকাউন্ট লৈরে?",
            login:
                "লগ ইন"
        },

        dashboard: {
            welcome:
                "হায়রাই ফংদোকই",
            games:
                "গেমশিং",
            profile:
                "প্রোফাইল",
            settings:
                "সেটিংস",

            weather:
                "জোরহাটদা নুংশি থাজবদা, ২৪°C • চা খাওনবা নুংশি নুমিৎ",
            goodMorning:
                "নুংশি নুমিৎ, কংকণ!",
            assameseGreeting:
                "(শুভ বাতিপুৱা)",
            date:
                "নুমিৎ থাং, ৪ অক্টোবর",
            morningBriefing:
                "নুমিতাংগী ৱারী তাবা",

            careSchedule:
                "নুমিতকী কেয়ার শিডিউল",
            actionsPending:
                "অ্যাকশন লৌথোকপা লৈ",

            dueRightNow:
                "হায়রিবা মতমদা তৌবা",
            morningRoutine:
                "নুমিতাংগী রুটিন",
            morningRoutineDescription:
                "নুমিত অমা হৌনবা পরিচিত অ্যাক্টিভিটিশিংগী সহজ ক্ৰম।",
            markTaken:
                "তৌরবা হায়না শেমজিনবা",
            taken:
                "তৌরে",

            routineHydration:
                "নিয়মিত পানি শিজিন্নবা",
            warmWaterGlass:
                "নামা পানি গ্লাস অমা",
            hydrationDescription:
                "স্বাস্থ্যকী থক-থৌগী জন্য পানি চাউনা শিজিন্নউ। নুমিত অসিদা গ্লাস ৬গী টার্গেট তৌ।",
            hydrationTracker:
                "পানি শিজিন্নবা ট্রেকার",
            of:
                "গী",
            glasses:
                "গ্লাস",

            morningGardenWalk:
                "নুমিতাংগী গার্ডেন ৱাক",
            gardenWalkDescription:
                "নুপী মচাগা ভেরান্ডাদা মিনিট ৩০ (নুমিৎ ৮:৩০)",
            logWater:
                "পানি গ্লাস অমা লগ তৌ",

            familyVisit:
                "ইমুং-মনুংগী ভিজিট",
            daughter:
                "মচা নুপী",
            familyVisitDescription:
                "অসমী পিঠা লৈনা নুমিত অসিদা ইমুংদা থাংজিনগনি",
            familyVisitNote:
                "নুমিৎ ৪:৩০দা থাংজিনগনি। নুমিৎ ৯:০০দা কল তৌনা নহাক্কী প্রিয় চা-পাত লৈনা থাংজিনগদবনি।",
            callAnanya:
                "অনন্যাগা কল তৌ",
            callingAnanya:
                "অনন্যা বড়ুয়াগা কল তৌরি…",

            streak:
                "স্ট্রিক: নুমিৎ ৪ নিং সক্রিয়",
            dailyGentleRecall:
                "নুমিতকী সহজ মেমোরি প্র্যাকটিস",
            brainPuzzle:
                "নুমিতকী ব্রেইন পাজল:",
            kazirangaTea:
                "কাজিরঙা অমসুং চা গার্ডেন",
            patternMatch:
                "প্যাটার্ন মিলানবা",
            brainDescription:
                "মেমোরি সক্রিয় তৌনবা মিনিট ৫গী সহজ মেমোরি এক্সারসাইজ। অঞ্চলগী উদ্ভিদ, পাখী অমসুং চা গার্ডেনগী মেমোরিশিং মিলানউ। খরখেদ নত্তে, মতম লৌউ।",
            fiveMinutes:
                "মিনিট ৫",
            relaxedPace:
                "নুংশি গতি",
            assameseSupport:
                "অসমীয়া সাপোর্ট",
            teaGarden:
                "চা গার্ডেন",
            playBrainGame:
                "ব্রেইন গেম খেলউ",

            needHelp:
                "হায়রিবা মতমদা সাহায্য নাংনা?",
            helpDescription:
                "ট্যাপ অমনা অনন্যা নত্ত্রগা লোকাল ASHA হেলথ ৱার্কার বিনা গগৈগা সরাসরি কানেক্ট তৌবা য়াগনি।",
            sayHeyAsha:
                "“Hey Asha” হায়উ",
            callAsha:
                "ASHA বিনাগা কল তৌ",
            voiceHelp:
                "বিরেন, বাঁশগী জাপি হেট খনবা পাম্বিব্রা?"
        },

        settings: {
            title:
                "সেটিংস",
            language:
                "লোন",
            selectLanguage:
                "নহাক্কী লোন খনবা"
        },

        caregiverDashboard: {
            ashaConnected:
                "ASHA সংযোগিত",
            mildCognitiveImpairment:
                "হালকা বুদ্ধিবৃত্তিক সমস্যা (প্রাথমিক অৱস্থা)",
            primaryDoctor:
                "প্রধান চিকিৎসক অনন্যা বি. (জীয়েক)",
            viewASHAData:
                "ASHA তথ্য চাওক",
            logNote:
                "নোট যোগ কৰক",
            emergencyCall:
                "যত্নদাতা দললৈ জৰুৰী ফোন।",
            emergencyCallButton:
                "জৰুৰী ফোন",
            status:
                "অৱস্থা",
            restingComfortably:
                "ঘৰত আৰামত বিশ্ৰাম লৈ আছে",
            allMorningVitalsNormal:
                "পুৱাৰ সকলো স্বাস্থ্য সূচক স্বাভাৱিক",
            jorhatResidence:
                "যোৰহাট বাসস্থান",
            pending:
                "বাকী",
            longitudinalMetric:
                "দীৰ্ঘম্যাদী মেট্ৰিক",
            cognitiveHealthIndex:
                "জ্ঞানীয় স্বাস্থ্য সূচক",
            stablePast36Days:
                "যোৱা ৩৬ দিনত স্থিৰ",
            zeroClinicalDecline:
                "যোৱা ১৪টা মৌখিক দিশ-নিৰ্দেশ আৰু ছবি স্মৃতি অধিবেশনত কোনো ক্লিনিকেল অৱনতি পোৱা হোৱা নাই।",
            visualMemory:
                "দৃশ্য স্মৃতি",
            spatialRecognition:
                "স্থানিক চিনাক্তকৰণ",
            voiceLatencyResponse:
                "কণ্ঠ বিলম্ব সঁহাৰি",
            dailyTracker:
                "দৈনিক ট্ৰেকাৰ",
            routineAndCareProtocol:
                "ৰুটিন আৰু যত্ন প্ৰটোকল",
            completedToday:
                "আজি সম্পূৰ্ণ",
            recordedBP:
                "ৰেকৰ্ড: 124/82 mmHg • নাড়ী 71 bpm",
            hydrationLogged:
                "৬ৰ ভিতৰত ৪টা বটল লগ কৰা হৈছে",
            brainGameCompleted:
                "নাতিৰ সৈতে মগজুৰ খেল সম্পূৰ্ণ",
            scheduled:
                "গৰম গাখীৰৰ সৈতে নিৰ্ধাৰিত",
            affectiveWellbeing:
                "আৱেগিক সুস্থতা",
            emotionalStability:
                "৭ দিনৰ আৱেগিক স্থিৰতা",
            ashaCognitivePatternObservation:
                "ASHA জ্ঞানীয় আৰ্হি পৰ্যবেক্ষণ",
            positiveEngagementSpikes:
                "চাহ-বাগিচাৰ আৰ্হি খেল আৰু পৰিয়ালৰ সৈতে কণ্ঠ কলৰ সময়ত ইতিবাচক অংশগ্ৰহণ বৃদ্ধি পায়।",
            activeSpeech:
                "সক্ৰিয় কথা-বতৰা",
            voiceCheck:
                "কণ্ঠ পৰীক্ষা",
            shareWithCareTeam:
                "যত্ন দলৰ সৈতে শ্বেয়াৰ কৰক",
            clinicalAppointment:
                "ক্লিনিকেল এপইণ্টমেণ্ট",
            in4Days:
                "৪ দিনৰ পিছত",
            specialistConsultation:
                "বিশেষজ্ঞৰ পৰামৰ্শ",
            clinicalReportPrepared:
                "ক্লিনিকেল প্ৰতিবেদন প্ৰস্তুত।",
            exportClinicalPDF:
                "ক্লিনিকেল PDF এক্সপৰ্ট কৰক",
            sentToBina:
                "বিনালৈ পঠিওৱা হৈছে",
            shareAccessWithBina:
                "বিনাৰ সৈতে এক্সেছ শ্বেয়াৰ কৰক",
            defensiveCareTelemetry:
                "নিৰাপত্তা যত্ন টেলিমেট্ৰি",
            safetyThresholds:
                "নিৰাপত্তাৰ সীমা",
            geoFenceActive:
                "জিঅ'-ফেন্স সক্ৰিয়",
            jorhatFamilyCompound:
                "যোৰহাট পৰিয়ালৰ চৌহদ",
            missedDoseAlert:
                "বাদ পৰা ঔষধৰ সতৰ্কবাণী",
            notifyAfter45Min:
                "৪৫ মিনিটৰ পিছত জনাওক",
            encryptedNDHMHealthID:
                "এনক্ৰিপ্টেড NDHM Health ID সংযুক্ত",
            configureLimits:
                "সীমা কনফিগাৰ কৰক"
        }
    },

    Mizo: {
        common: {
            back: "Kir leh",
            next: "Hma lamah",
            continue: "Kal zel rawh",
            save: "Vawikhatin dah",
            cancel: "Bawl",
            logout: "Logout",
            login: "Login",
            create: "Siamsak",
            loading: "A load mek...",
            close: "Khâr",
            settings: "Settings",
            profile: "Profile",
            games: "Game-te"
        },

        navbar: {
            home: "In",
            login: "Login",
            register: "Register",
            language: "Ṭawng",
            homeRoutine: "In leh Routine",
            brainGames: "Brain Games",
            caregiverHub: "Caregiver Hub",
            emergencySOS: "Emergency SOS"
        },

        login: {
            eyebrow: "I KHAWMPUI HMANNA",
            welcome: "Chibai leh lawmna.",
            description:
                "AshaNER i hman dan tur milpui view chu thlang rawh.",
            patientView:
                "PATIENT VIEW",
            caregiverView:
                "CAREGIVER VIEW",
            continueAsPatient:
                "Patient anga kal zel",
            continueAsCaregiver:
                "Caregiver anga kal zel",
            patientDescription:
                "Thiltihte, routine leh memory tanpuina nuam tak.",
            caregiverDescription:
                "Tanpuina, hma sawnna, routine leh enkawlna.",
            email:
                "Email address",
            password:
                "Password",
            emailPlaceholder:
                "you@example.com",
            passwordPlaceholder:
                "I password ziak rawh",
            dontHaveAccount:
                "Account i nei lo em?",
            createOne:
                "Siamsak rawh",
            alreadyHaveAccount:
                "Account i nei tawh em?",
            incorrectCredentials:
                "Email emaw password dik lo",
            privateSecure:
                "I information chu thup leh him taka vawikhatin dah a ni."
        },

        register: {
            patientView:
                "PATIENT VIEW",
            caregiverView:
                "CAREGIVER VIEW",
            createAccount:
                "I account siamsak rawh.",
            patientDescription:
                "I personal AshaNER care space siam rawh.",
            caregiverDescription:
                "I connected caregiver account siam rawh.",
            fullName:
                "Hming famkim",
            namePlaceholder:
                "I hming",
            email:
                "Email address",
            emailPlaceholder:
                "you@example.com",
            password:
                "Password",
            passwordPlaceholder:
                "Password thar siam rawh",
            confirmPassword:
                "Password nemnghet",
            confirmPasswordPlaceholder:
                "Password chu thunawn rawh",
            createPatientAccount:
                "Patient Account Siam",
            createCaregiverAccount:
                "Caregiver Account Siam",
            alreadyHaveAccount:
                "Account i nei tawh em?",
            passwordMismatch:
                "Password pahnih an inmil lo.",
            passwordTooShort:
                "Password chu character 8 aia tam a nih tur a ni.",
            fillAllFields:
                "Field zawng zawng fill rawh.",
            creatingAccount:
                "Account siam mek...",
            privateSecure:
                "I information chu thup leh him taka vawikhatin dah a ni."
        },

        roleRegister: {
            eyebrow:
                "I KHAWMPUI HMANNA",
            title:
                "I AshaNER account siam rawh.",
            description:
                "AshaNER i hman dan tur thlang rawh.",
            patientView:
                "PATIENT VIEW",
            patientTitle:
                "Patient Account Siam",
            patientDescription:
                "Thiltihte, routine leh memory tanpuina atan hmun nuam tak.",
            caregiverView:
                "CAREGIVER VIEW",
            caregiverTitle:
                "Caregiver Account Siam",
            caregiverDescription:
                "Routine, hma sawnna leh nitin enkawlna nen inzawm reng rawh.",
            alreadyHaveAccount:
                "Account i nei tawh em?",
            login:
                "Login"
        },

        dashboard: {
            welcome:
                "Chibai leh lawmna",
            games:
                "Game-te",
            profile:
                "Profile",
            settings:
                "Settings",

            weather:
                "Jorhat-ah ni a var, 24°C • Thingpui tur ni nuam",
            goodMorning:
                "Tukchhuah nuam, Kangkan!",
            assameseGreeting:
                "(শুভ বাতিপুৱা)",
            date:
                "Nilaini, October ni 4",
            morningBriefing:
                "Tukchhuah thu ngaihthlak rawh",

            careSchedule:
                "Vawiina Care Schedule",
            actionsPending:
                "Action la tih tur",

            dueRightNow:
                "Tunah tih tur",
            morningRoutine:
                "Tukchhuah Routine",
            morningRoutineDescription:
                "Ni hman tur hma a thiltih familiar te awlsam taka zawmna.",
            markTaken:
                "Tih tawh tihna siam",
            taken:
                "Tih tawh",

            routineHydration:
                "Tui in routine",
            warmWaterGlass:
                "Tui lum glass khat",
            hydrationDescription:
                "Taksa damna atan tui in tam rawh. Vawiin glass 6 in turin tum rawh.",
            hydrationTracker:
                "Tui in tracker",
            of:
                "a",
            glasses:
                "Glass",

            morningGardenWalk:
                "Tukchhuah huan kal",
            gardenWalkDescription:
                "Fanu nen veranda-ah minute 30 (8:30 AM)",
            logWater:
                "Tui glass khat log rawh",

            familyVisit:
                "Chhungkaw tlawhna",
            daughter:
                "Fanu",
            familyVisitDescription:
                "Vawiin Assam pitha thar nen inah a lo kal",
            familyVisitNote:
                "4:30 PM-ah a lo thleng tur. 9:00 AM-ah phone-in i duh ber tea leaves a keng tur thu a hrilh.",
            callAnanya:
                "Ananya phone rawh",
            callingAnanya:
                "Ananya Barua phone mek…",

            streak:
                "Streak: Ni 4 active",
            dailyGentleRecall:
                "Ni tin memory exercise nuam",
            brainPuzzle:
                "Vawiina Brain Puzzle:",
            kazirangaTea:
                "Kaziranga & Tea Garden",
            patternMatch:
                "Pattern match",
            brainDescription:
                "Memory siamthar leh recall tan 5-minute exercise awlsam. Hmunhma thingkung, sava leh tea garden memory te match rawh. Tih turin khawih khawih lovin i hun la rawh.",
            fiveMinutes:
                "Minute 5",
            relaxedPace:
                "Pace nuam",
            assameseSupport:
                "Assamese tanpuina",
            teaGarden:
                "Tea Garden",
            playBrainGame:
                "Brain Game play rawh",

            needHelp:
                "Tunah tanpuina i mamawh em?",
            helpDescription:
                "Tap khat-in Fanu Ananya emaw local ASHA Health Worker Bina Gogoi emaw nen direct-in in connect thei.",
            sayHeyAsha:
                "“Hey Asha” ti rawh",
            callAsha:
                "ASHA Bina phone rawh",
            voiceHelp:
                "Biren, Bamboo Jaapi hat i zawng duh em?"
        },

        settings: {
            title:
                "Settings",
            language:
                "Ṭawng",
            selectLanguage:
                "I ṭawng thlang rawh"
        },

        caregiverDashboard: {
            ashaConnected:
                "ASHA Hriatpui",
            mildCognitiveImpairment:
                "Mild Cognitive Impairment (Early Stage)",
            primaryDoctor:
                "Primary Dr. Ananya B. (Daughter)",
            viewASHAData:
                "ASHA Data en rawh",
            logNote:
                "Note siam rawh",
            emergencyCall:
                "Caregiver team-ah emergency call.",
            emergencyCallButton:
                "Emergency Call",
            status:
                "Status",
            restingComfortably:
                "Inah lungawi taka chawlh",
            allMorningVitalsNormal:
                "Tukchhuah vitals zawng zawng normal",
            jorhatResidence:
                "Jorhat Residence",
            pending:
                "Pending",
            longitudinalMetric:
                "LONGITUDINAL METRIC",
            cognitiveHealthIndex:
                "COGNITIVE HEALTH INDEX",
            stablePast36Days:
                "Ni 36 chhung stable",
            zeroClinicalDecline:
                "Last 14 verbal orientation leh image recall sessions-ah clinical decline awm lo.",
            visualMemory:
                "Visual Memory (Tea Leaf & Loom Patterns)",
            spatialRecognition:
                "Spatial Recognition (Courtyard & House Map)",
            voiceLatencyResponse:
                "Voice Latency Response",
            dailyTracker:
                "DAILY TRACKER",
            routineAndCareProtocol:
                "ROUTINE & CARE PROTOCOL",
            completedToday:
                "Completed Today",
            recordedBP:
                "Recorded: 124/82 mmHg • Pulse 71 bpm",
            hydrationLogged:
                "4 of 6 bottles logged (1.4L of 2.0L goal)",
            brainGameCompleted:
                "Brain Game module completed with grandchild",
            scheduled:
                "Scheduled with warm milk",
            affectiveWellbeing:
                "AFFECTIVE WELLBEING",
            emotionalStability:
                "7-Day Emotional Stability & Mood Spectrum",
            ashaCognitivePatternObservation:
                "Asha Cognitive Pattern Observation",
            positiveEngagementSpikes:
                "Positive emotional engagement during afternoon tea-garden games and voice calls with granddaughter.",
            activeSpeech:
                "Active speech",
            voiceCheck:
                "Voice check",
            shareWithCareTeam:
                "Share with Care Team",
            clinicalAppointment:
                "CLINICAL APPOINTMENT",
            in4Days:
                "In 4 Days",
            specialistConsultation:
                "Specialist Consultation",
            clinicalReportPrepared:
                "Clinical report prepared for export.",
            exportClinicalPDF:
                "Export Clinical PDF (ICD-10)",
            sentToBina:
                "Sent to Bina",
            shareAccessWithBina:
                "Share Access with Bina (ASHA)",
            defensiveCareTelemetry:
                "DEFENSIVE CARE TELEMETRY",
            safetyThresholds:
                "Safety Thresholds",
            geoFenceActive:
                "Geo-fence Active",
            jorhatFamilyCompound:
                "Jorhat Family Compound (360m)",
            missedDoseAlert:
                "Missed Dose Alert",
            notifyAfter45Min:
                "Notify Daughter & ASHA after +45 min",
            encryptedNDHMHealthID:
                "Encrypted NDHM Health ID Linked",
            configureLimits:
                "Configure Limits"
        }
    },

    Bodo: {
        common: {
            back: "फिन",
            next: "सिगां",
            continue: "सिगां थां",
            save: "जमा खालाम",
            cancel: "बन्द खालाम",
            logout: "लग आउट",
            login: "लग इन",
            create: "सोरजि",
            loading: "लोड खालाम गासिनो...",
            close: "बन्द खालाम",
            settings: "सेटिंग्स",
            profile: "प्रोफाइल",
            games: "गेमफोर"
        },

        navbar: {
            home: "न'होम",
            login: "लग इन",
            register: "पन्जियान",
            language: "राव",
            homeRoutine: "न' आरो रुटिन",
            brainGames: "ब्रेन गेमफोर",
            caregiverHub: "केयरगिभार हब",
            emergencySOS: "जुरमुरि SOS"
        },

        login: {
            eyebrow:
                "नोंनि केयर स्पेस",
            welcome:
                "फिनबो स्वागत।",
            description:
                "AshaNER खौ नों मा रोखोमैन बाहायनो हायो बेनिफ्राय गोनां भ्यु बासिखौ सायख।",
            patientView:
                "पेसेंट भ्यु",
            caregiverView:
                "केयरगिभार भ्यु",
            continueAsPatient:
                "पेसेंट महरै सिगां थां",
            continueAsCaregiver:
                "केयरगिभार महरै सिगां थां",
            patientDescription:
                "खुसीनि एक्टिभिटि, रुटिन आरो मेमोरि मदद।",
            caregiverDescription:
                "मदद, प्रोग्रेस, रुटिन आरो जोगाजोग केयर।",
            email:
                "इमेल थं",
            password:
                "पासवर्ड",
            emailPlaceholder:
                "you@example.com",
            passwordPlaceholder:
                "नोंनि पासवर्ड लिर",
            dontHaveAccount:
                "एकाउन्ट गैया?",
            createOne:
                "सोरजि",
            alreadyHaveAccount:
                "एकाउन्ट दं नामा?",
            incorrectCredentials:
                "इमेल एबा पासवर्ड गोरोन्थि",
            privateSecure:
                "नोंनि फोरमेसन खौ प्राइभेट आरो सुरक्षित महरै दोननाय जायो।"
        },

        register: {
            patientView:
                "पेसेंट भ्यु",
            caregiverView:
                "केयरगिभार भ्यु",
            createAccount:
                "नोंनि एकाउन्ट सोरजि।",
            patientDescription:
                "नोंनि निजि AshaNER केयर स्पेस सोरजि।",
            caregiverDescription:
                "नोंनि जोगाजोग केयरगिभार एकाउन्ट सोरजि।",
            fullName:
                "फुं नाम",
            namePlaceholder:
                "नोंनि नाम",
            email:
                "इमेल थं",
            emailPlaceholder:
                "you@example.com",
            password:
                "पासवर्ड",
            passwordPlaceholder:
                "पासवर्ड सोरजि",
            confirmPassword:
                "पासवर्ड रोखा खालाम",
            confirmPasswordPlaceholder:
                "पासवर्ड फिन लिर",
            createPatientAccount:
                "पेसेंट एकाउन्ट सोरजि",
            createCaregiverAccount:
                "केयरगिभार एकाउन्ट सोरजि",
            alreadyHaveAccount:
                "एकाउन्ट दं नामा?",
            passwordMismatch:
                "पासवर्ड मोनसे रोखोम नङा।",
            passwordTooShort:
                "पासवर्डआव खमसे खम ८ आखर दंनाय नांगौ।",
            fillAllFields:
                "अननानै गासै फिल्डफोरखौ आबुं खालाम।",
            creatingAccount:
                "एकाउन्ट सोरजि गासिनो...",
            privateSecure:
                "नोंनि फोरमेसन खौ प्राइभेट आरो सुरक्षित महरै दोननाय जायो।"
        },

        roleRegister: {
            eyebrow:
                "नोंनि केयर स्पेस",
            title:
                "नोंनि AshaNER একাউন্ট सोরজি।",
            description:
                "AshaNER खौ मा रोखोमैन बाहायगोन बेखौ सायख।",
            patientView:
                "पेसेंट भ्यु",
            patientTitle:
                "पेसেন্ট एकाउन्ट सोरजि",
            patientDescription:
                "एक्टिभिटि, रुटिन आरो मेमोरि मददनि थाखाय सुबिधा जगा।",
            caregiverView:
                "केयरगिभार भ्यु",
            caregiverTitle:
                "केयरगिभार एकाउन्ट सोरजि",
            caregiverDescription:
                "रुटिन, प्रोग्रेस आरो सानफ्रोमबो केयरजों जोगाजोग थां।",
            alreadyHaveAccount:
                "एकाउन्ट दं नामा?",
            login:
                "लग इन"
        },

        dashboard: {
            welcome:
                "फिनबो स्वागत",
            games:
                "गेमफोर",
            profile:
                "प्रोफाइल",
            settings:
                "सेटिंग्स",

            weather:
                "जोरहाटआव अखा दं, २४°C • चा खाबायनो गोजोन दिन",
            goodMorning:
                "फुंनि गोजोन, कंकण!",
            assameseGreeting:
                "(শুভ বাতিপুৱা)",
            date:
                "बुधबार, ४ अक्टोबर",
            morningBriefing:
                "फुंनि ब्रिफिङ खोनासाव",

            careSchedule:
                "दिनैनि केयर शिड्युल",
            actionsPending:
                "एक्सनफोर बायजोबाखै",

            dueRightNow:
                "दानियाव खालामनांगौ",
            morningRoutine:
                "फुंनि रुटिन",
            morningRoutineDescription:
                "दिन हौबायनि थाखाय फोसाव जानाय एक्टिभिटिफोरनि गोजोन क्रम।",
            markTaken:
                "खालामनाय बायदियै मार्क खालाम",
            taken:
                "खालामदों",

            routineHydration:
                "रुटिन हाइड्रेशन",
            warmWaterGlass:
                "मावै गिलास दै",
            hydrationDescription:
                "जोंनि शरीरनि थाखाय दै जागाय। दिनै ६ गिलास दैनि टार्गेट लां।",
            hydrationTracker:
                "दै ट्रेकर",
            of:
                "नि",
            glasses:
                "गिलास",

            morningGardenWalk:
                "फुंनि बागान हाबा",
            gardenWalkDescription:
                "बेटिजों बरान्दायाव ३० मिनिट (८:३० AM)",
            logWater:
                "१ गिलास दै लग खालाम",

            familyVisit:
                "हिनजावनि भेट",
            daughter:
                "बेटि",
            familyVisitDescription:
                "दिनै गोजोन असमिया पिठा लांनानै न'आव फिनफिन",
            familyVisitNote:
                "४:३० PM आव थांनाय। ९:०० AM आव फोन खालामनानै नोंनि मोनसेथाय चा पाता लांनायनि सोदोब होदों।",
            callAnanya:
                "अनन्याखौ फोन खालाम",
            callingAnanya:
                "अनन्या बरुआखौ फोन खालाम गासिनो…",

            streak:
                "स्ट्रीक: ४ दिन एक्टिभ",
            dailyGentleRecall:
                "दिनैनि गोजोन मेमोरि एक्सरसाइज",
            brainPuzzle:
                "दिनैनि ब्रेन पाजल:",
            kazirangaTea:
                "काजिरंगा आरो चा बागान",
            patternMatch:
                "पेटार्न मिलाय",
            brainDescription:
                "मेमोरि जागायनायनि थाखाय ५ मिनिटनि गोजोन एक्सरसाइज। आंचलिक जिब-जोंग, साव आरो चा बागाननि मेमोरिफोर मिलाय। गोसो गोसो खालाम, नोंनि सम लां।",
            fiveMinutes:
                "५ मिनिट",
            relaxedPace:
                "गोजोन गति",
            assameseSupport:
                "असमिया मदद",
            teaGarden:
                "चा बागान",
            playBrainGame:
                "ब्रेन गेम खेल",

            needHelp:
                "दानियाव मदद नांगौ नामा?",
            helpDescription:
                "टैप मोनसेयाव बेटी अनन्या एबा लोकल ASHA हेल्थ वर्कर बिना गोगोइजों जोगाजोग खालामनो हायो।",
            sayHeyAsha:
                "“Hey Asha” बुं",
            callAsha:
                "ASHA बिनाखौ फोन खालाम",
            voiceHelp:
                "बिरेन, बांशनिं जपि हेट नाजानाय लुबैयो नामा?"
        },

        settings: {
            title:
                "सेटिंग्स",
            language:
                "राव",
            selectLanguage:
                "नोंनि राव सायख"
        },

        caregiverDashboard: {
            ashaConnected:
                "ASHA Connected",
            mildCognitiveImpairment:
                "Mild Cognitive Impairment (Early Stage)",
            primaryDoctor:
                "Primary Dr. Ananya B. (Daughter)",
            viewASHAData:
                "ASHA Data जाथाय",
            logNote:
                "Note जाथाय",
            emergencyCall:
                "Caregiver team-आव emergency call.",
            emergencyCallButton:
                "Emergency Call",
            status:
                "Awastha",
            restingComfortably:
                "न'आव आराम महरै थां",
            allMorningVitalsNormal:
                "फुंनि vitals normal",
            jorhatResidence:
                "Jorhat Residence",
            pending:
                "Apothak",
            longitudinalMetric:
                "LONGITUDINAL METRIC",
            cognitiveHealthIndex:
                "COGNITIVE HEALTH INDEX",
            stablePast36Days:
                "Gathang 36 dni stable",
            zeroClinicalDecline:
                "Gathang 14 dinai verbal orientation & image recall sessions-आव clinical decline गैया।",
            visualMemory:
                "Visual Memory",
            spatialRecognition:
                "Spatial Recognition",
            voiceLatencyResponse:
                "Voice Latency Response",
            dailyTracker:
                "DAILY TRACKER",
            routineAndCareProtocol:
                "ROUTINE & CARE PROTOCOL",
            completedToday:
                "Completed Today",
            recordedBP:
                "Recorded: 124/82 mmHg • Pulse 71 bpm",
            hydrationLogged:
                "6 नि गेजेराव 4 bottles log खालामनाय",
            brainGameCompleted:
                "Grandchild-जों Brain Game module जोबोदों",
            scheduled:
                "Warm milk-जों scheduled",
            affectiveWellbeing:
                "AFFECTIVE WELLBEING",
            emotionalStability:
                "7-Day Emotional Stability",
            ashaCognitivePatternObservation:
                "ASHA Cognitive Pattern Observation",
            positiveEngagementSpikes:
                "Afternoon tea-garden games आरो voice calls समाव positive engagement बांसिन जायो।",
            activeSpeech:
                "Active speech",
            voiceCheck:
                "Voice check",
            shareWithCareTeam:
                "Care Team-जों share खालाम",
            clinicalAppointment:
                "CLINICAL APPOINTMENT",
            in4Days:
                "In 4 Days",
            specialistConsultation:
                "Specialist Consultation",
            clinicalReportPrepared:
                "Clinical report export-नि थाखाय तयार।",
            exportClinicalPDF:
                "Export Clinical PDF (ICD-10)",
            sentToBina:
                "Bina-आव थानाय",
            shareAccessWithBina:
                "Bina (ASHA)-जों access share खालाम",
            defensiveCareTelemetry:
                "DEFENSIVE CARE TELEMETRY",
            safetyThresholds:
                "Safety Thresholds",
            geoFenceActive:
                "Geo-fence Active",
            jorhatFamilyCompound:
                "Jorhat Family Compound (360m)",
            missedDoseAlert:
                "Missed Dose Alert",
            notifyAfter45Min:
                "45 minute बाद Daughter & ASHA-खौ notification हो",
            encryptedNDHMHealthID:
                "Encrypted NDHM Health ID Linked",
            configureLimits:
                "Limits Configure खालाम"
        }
    }
};

export default translations;