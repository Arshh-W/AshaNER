export const voiceApi={speak:(text)=>window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text))};
