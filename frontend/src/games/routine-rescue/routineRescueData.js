// src/games/routine-rescue/routineRescueData.js

export const routines = [
    {
        id: "tea",
        title: "Making Tea",
        instruction: "What should you do first?",
        steps: [
            {
                id: "boil-water",
                text: "Boil the water",
                emoji: "🫖",
            },
            {
                id: "add-tea",
                text: "Add the tea",
                emoji: "🍵",
            },
            {
                id: "pour-water",
                text: "Pour the hot water",
                emoji: "☕",
            },
            {
                id: "stir",
                text: "Stir the tea",
                emoji: "🥄",
            },
        ],
    },

    {
        id: "plants",
        title: "Watering Plants",
        instruction: "What should you do first?",
        steps: [
            {
                id: "get-can",
                text: "Get the watering can",
                emoji: "🚿",
            },
            {
                id: "fill-can",
                text: "Fill it with water",
                emoji: "💧",
            },
            {
                id: "water-plant",
                text: "Water the plant",
                emoji: "🪴",
            },
            {
                id: "put-away",
                text: "Put the can away",
                emoji: "🏠",
            },
        ],
    },

    {
        id: "morning",
        title: "Getting Ready",
        instruction: "What should you do first?",
        steps: [
            {
                id: "wake-up",
                text: "Wake up",
                emoji: "🌅",
            },
            {
                id: "brush",
                text: "Brush your teeth",
                emoji: "🪥",
            },
            {
                id: "dress",
                text: "Get dressed",
                emoji: "👕",
            },
            {
                id: "breakfast",
                text: "Have breakfast",
                emoji: "🍳",
            },
        ],
    },
];