export function useWebSpeech(){
 const speak=(text)=>{ if("speechSynthesis" in window){window.speechSynthesis.cancel();window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));} };
 const stop=()=>window.speechSynthesis?.cancel();
 return {speak,stop,supported:"speechSynthesis" in window};
}
