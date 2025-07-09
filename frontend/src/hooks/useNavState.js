import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function iterLink(shouldOpen, currentPath, routes){
    routes && routes.forEach((route) => {
        const nowPath = route.href;
        const subRoute = route.subLinks;
        if( subRoute && subRoute.length > 0 ){
            if( currentPath.startsWith( nowPath )){
                shouldOpen.add( nowPath );
                nowPath && shouldOpen.add( nowPath );
            }else {
                iterLink(shouldOpen, currentPath, nowPath, subRoute);
            }
        }
    })
}
// 커스텀 훅
export function useNavState(routes) {
    const location = useLocation();
    const [openedItems, setOpenedItems] = useState(new Set());

    useEffect(() => {
        const currentPath = location.pathname;
        const shouldOpen = new Set();

        // 현재 경로와 매치되는 모든 상위 경로를 찾아서 열기
        iterLink(shouldOpen, currentPath, undefined, routes);

        setOpenedItems(shouldOpen);
    }, [location.pathname, routes]);

    const toggleItem = (path) => {
        const newSet = new Set(openedItems);
        if (newSet.has(path)) {
            newSet.delete(path);
        } else {
            newSet.add(path);
        }
        setOpenedItems(newSet);
    };

    return { openedItems, toggleItem };
}