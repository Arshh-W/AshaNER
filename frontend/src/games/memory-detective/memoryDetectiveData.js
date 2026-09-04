// src/games/memory-detective/memoryDetectiveData.js

export const detectiveScenes = [
    {
        id: 1,
        title: "The Living Room",
        instruction: "Look carefully at the room.",
        objects: [
            { id: "chair", name: "Chair", emoji: "🪑" },
            { id: "lamp", name: "Lamp", emoji: "💡" },
            { id: "book", name: "Book", emoji: "📖" },
            { id: "plant", name: "Plant", emoji: "🪴" },
            { id: "clock", name: "Clock", emoji: "🕐" },
            { id: "tea", name: "Tea", emoji: "☕" },
        ],
        changedObject: "book",
        changedType: "removed",
    },

    {
        id: 2,
        title: "The Kitchen",
        instruction: "Look carefully at the kitchen.",
        objects: [
            { id: "cup", name: "Cup", emoji: "🥤" },
            { id: "plate", name: "Plate", emoji: "🍽️" },
            { id: "apple", name: "Apple", emoji: "🍎" },
            { id: "spoon", name: "Spoon", emoji: "🥄" },
            { id: "pot", name: "Pot", emoji: "🍲" },
            { id: "bread", name: "Bread", emoji: "🍞" },
        ],
        changedObject: "apple",
        changedType: "removed",
    },

    {
        id: 3,
        title: "The Garden",
        instruction: "Look carefully at the garden.",
        objects: [
            { id: "flower", name: "Flower", emoji: "🌷" },
            { id: "tree", name: "Tree", emoji: "🌳" },
            { id: "bench", name: "Bench", emoji: "🪑" },
            { id: "watering", name: "Watering Can", emoji: "🚿" },
            { id: "bird", name: "Bird", emoji: "🐦" },
            { id: "ball", name: "Ball", emoji: "⚽" },
        ],
        changedObject: "bird",
        changedType: "removed",
    },
];