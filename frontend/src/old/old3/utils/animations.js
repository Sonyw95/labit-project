export const animations = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes pulse {
        0%, 100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1);
        }
        50% { 
            opacity: 0.5; 
            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1.2);
        }
    }
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes smoothChange {
        0% { 
            opacity: 0; 
            transform: scale(0.95); 
        }
        100% { 
            opacity: 1; 
            transform: scale(1); 
        }
    }
    
    @keyframes gentlePulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
`;