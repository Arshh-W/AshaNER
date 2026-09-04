// src/games/memory-village/memoryVillageData.js

export const villageItems = [
  {
    id: "grandma",
    type: "person",
    name: "Grandma",
    emoji: "👵",
    location: "Home",
  },
  {
    id: "grandpa",
    type: "person",
    name: "Grandpa",
    emoji: "👴",
    location: "Garden",
  },
  {
    id: "home",
    type: "place",
    name: "Home",
    emoji: "🏠",
    location: "Village",
  },
  {
    id: "garden",
    type: "place",
    name: "Garden",
    emoji: "🌳",
    location: "Village",
  },
  {
    id: "tea",
    type: "object",
    name: "Tea",
    emoji: "☕",
    location: "Home",
  },
  {
    id: "flower",
    type: "object",
    name: "Flowers",
    emoji: "🌷",
    location: "Garden",
  },
];

export const villageTasks = [
  {
    id: 1,
    targetId: "grandma",
    instruction: "Find Grandma",
  },
  {
    id: 2,
    targetId: "home",
    instruction: "Find Home",
  },
  {
    id: 3,
    targetId: "garden",
    instruction: "Find the Garden",
  },
  {
    id: 4,
    targetId: "grandpa",
    instruction: "Find Grandpa",
  },
  {
    id: 5,
    targetId: "tea",
    instruction: "Find the Tea",
  },
  {
    id: 6,
    targetId: "flower",
    instruction: "Find the Flowers",
  },
];