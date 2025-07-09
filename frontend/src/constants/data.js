// constants/data.js

export const TECH_STACK = ['Java', 'Spring', 'React'];

export const NAVIGATION_ITEMS =  [
    { icon: 'IconHome', label: '홈', href: '/home',  requiredNav: true,
        subLinks: []
    },
    { icon: 'IconDevicesCode', label: '기술', href: '/posts', requiredNav: false,
        subLinks: [
            {
                icon: 'IconCoffee', label: 'Java', href: '/posts/java', badge: '10', requiredNav: true, subLinks: []
            },
            {
                icon: 'IconLeaf', label: 'Spring', href: '/posts/spring', badge: '10', requiredNav: true, subLinks: []
            }
        ]
    },
    { icon: 'IconTags', label: '태그', href: '/tag', requiredNav: true,
        subLinks: []
    },
    // { icon: IconTrendingUp, label: '인기글', href: '/trending', hasLinks: false, requiredNav: true, subLinks: [] },
    // { icon: IconBookmark, label: '북마크', href: '/bookmarks', hasLinks: false, requiredNav: true, subLinks: [] },
    { icon: 'IconUser', label: '소개', href: '/about', requiredNav: true,
        subLinks: []
    },
];

export const POPULAR_TAGS = [
    { name: 'React', count: 15, color: 'blue' },
    { name: 'Spring Boot', count: 12, color: 'green' },
    { name: 'Java', count: 18, color: 'orange' },
    { name: 'TypeScript', count: 8, color: 'indigo' },
    { name: 'AWS', count: 6, color: 'yellow' },
];

export const RECENT_POSTS = [
    {
        id: 1,
        title: 'Spring Boot 3.0과 Virtual Threads 활용하기',
        excerpt: 'Spring Boot 3.0에서 도입된 Virtual Threads를 활용한 고성능 웹 애플리케이션 개발 방법을 알아봅니다.',
        date: '2025-06-20',
        readTime: '5분',
        views: 1240,
        likes: 32,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop'
    },
    {
        id: 2,
        title: 'React Server Components 심화 가이드',
        excerpt: 'RSC의 동작 원리와 실제 프로덕션에서의 활용 사례를 통해 Modern React 개발을 마스터해보세요.',
        date: '2025-06-18',
        readTime: '8분',
        views: 892,
        likes: 28,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop'
    },
    {
        id: 3,
        title: 'Microservices Architecture with Docker',
        excerpt: 'Docker와 Kubernetes를 활용한 마이크로서비스 아키텍처 설계 및 운영 경험을 공유합니다.',
        date: '2025-06-15',
        readTime: '12분',
        views: 756,
        likes: 19,
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=200&fit=crop'
    }
];

export const THEME_COLORS = {
    primary: '#4c6ef5',
    primaryHover: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#21262d',
        text: '#f0f6fc',
        textMuted: '#8b949e',
    },
    light: {
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e5e7eb',
        text: '#1e293b',
        textMuted: '#6b7280',
    }
};

export const BANNER_IMAGE = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop';