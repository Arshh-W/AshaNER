import {useEffect,useState} from "react"; export function useOnlineStatus(){const [online,set]=useState(navigator.onLine);useEffect(()=>{const a=()=>set(true),b=()=>set(false);addEventListener("online",a);addEventListener("offline",b);return()=>{removeEventListener("online",a);removeEventListener("offline",b)}},[]);return online}
import {
    useEffect,
    useState
} from "react";

const useOnlineStatus = () => {
    const [isOnline, setIsOnline] =
        useState(() =>
            typeof navigator !== "undefined"
                ? navigator.onLine
                : true
        );

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );

        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };
    }, []);

    return isOnline;
};

export default useOnlineStatus;