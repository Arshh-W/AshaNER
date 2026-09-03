export const useOnlineStatus = () => {
    // TODO: Implement online status hook
    return {
        isOnline: navigator.onLine,
        isOffline: !navigator.onLine
    };
};