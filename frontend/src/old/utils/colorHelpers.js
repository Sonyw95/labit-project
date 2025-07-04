export const getTagColor = (color) => {
    const colors = {
        blue: '#3b82f6',
        green: '#10b981',
        orange: '#f59e0b',
        indigo: '#6366f1',
        yellow: '#eab308',
        purple: '#8b5cf6',
        pink: '#ec4899',
        red: '#ef4444',
    };
    return colors[color] || colors.blue;
};
export const getThemeColors = (dark) => ({
    background: dark ? '#000000' : '#f8fafc',
    surface: dark ? '#0a0a0a' : '#ffffff',
    surfaceHover: dark ? '#1a1a1a' : '#f3f4f6',
    border: dark ? '#1a1a1a' : '#e5e7eb',
    borderHover: dark ? '#2a2a2a' : '#cbd5e1',
    text: dark ? '#ffffff' : '#1e293b',
    textSecondary: dark ? '#999999' : '#64748b',
    textMuted: dark ? '#666666' : '#94a3b8',
    primary: '#4c6ef5',
    primaryHover: '#3b82f6',
});
