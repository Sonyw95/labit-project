import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function useScrollToTop() {
    const { pathname } = useLocation();
    useEffect( () => {
        // window.scrollTo(0, 0);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [pathname]);

    return null;
}