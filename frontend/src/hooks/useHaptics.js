export const useHaptics=()=>({tap:()=>navigator.vibrate?.(25),success:()=>navigator.vibrate?.([30,40,30])});
