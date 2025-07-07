export const getTagColor = (color) => {
    const colorMap = {
        blue: '#3b82f6',
        green: '#10b981',
        orange: '#f59e0b',
        indigo: '#6366f1',
        yellow: '#eab308'
    };
    return colorMap[color] || '#6b7280';
};