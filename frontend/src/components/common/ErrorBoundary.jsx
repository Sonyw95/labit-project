import React, {Component} from 'react';
import { Navigate } from 'react-router-dom';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 500 에러 페이지로 리다이렉트
            return <Navigate to="/error/500" replace />;
        }
        return this.props.children;
    }
}