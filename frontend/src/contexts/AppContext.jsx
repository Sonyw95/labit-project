import {createContext, useCallback, useContext, useState} from "react";
import {ThemeProvider} from "@/contexts/ThemeContext.jsx";
import {NotificationProvider} from "@/contexts/NotificationContext.jsx";

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 글로벌 로딩 상태 관리
    const setGlobalLoading = useCallback((loading) => {
        setIsLoading(loading);
    }, []);

    // 사이드바 토글
    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const openSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);

    // 사용자 관리
    const login = useCallback((userData) => {
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = {
        isLoading,
        setGlobalLoading,
        user,
        login,
        logout,
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar,
    };

    return (
        <>
            <meta charSet="utf-8"/>
            <meta name="description" content="Java, Spring, AEM, React 기반 실무 개발 지식을 공유하는 개인 블로그입니다."/>
            <title> LABit </title>
            <meta property="description" content="LABit"/>
            <meta property="og:description" content="LABit"/>
            <meta property="og:type" content="website"/>
            <meta property="og:site" content="website"/>
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        </>

)
    ;
};

// 모든 Provider를 합친 루트 Provider
export const RootProvider = ({children}) => {
    return (
        <AppProvider>
            <ThemeProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </ThemeProvider>
        </AppProvider>
    );
};