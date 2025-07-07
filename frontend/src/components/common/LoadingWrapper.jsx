import React from 'react';
import CustomLoader from './CustomLoader';

const LoadingWrapper = ({ loading, progress, children }) => {
    if (loading) {
        return <CustomLoader progress={progress} />;
    }
    return children;
};

export default LoadingWrapper;