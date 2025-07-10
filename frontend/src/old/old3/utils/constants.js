import {lazy} from "react";

export const TECH_STACK = ['Java', 'Spring', 'React'];

export const NAVIGATION_ITEMS = [
    { icon: 'IconHome', label: '홈', href: '/home',  root: true,
        subLinks: []
    },
    { icon: 'IconDevicesCode', label: '기술', href: '/posts', root: false,
        subLinks: [
            {
                icon: 'IconCoffee', label: 'Java', href: '/posts/java', badge: '10', root: true, subLinks: []
            },
            {
                icon: 'IconLeaf', label: 'Spring', href: '/posts/spring', badge: '10', root: true, subLinks: []
            }
        ]
    },
    { icon: 'IconTags', label: '태그', href: '/tag', root: true,
        subLinks: []
    },
    // { icon: IconTrendingUp, label: '인기글', href: '/trending', hasLinks: false, root: true, subLinks: [] },
    // { icon: IconBookmark, label: '북마크', href: '/bookmarks', hasLinks: false, root: true, subLinks: [] },
    { icon: 'IconUser', label: '소개', href: '/about', root: true,
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
        title: "모바일 앱 UI/UX 디자인 트렌드 2025",
        excerpt: "2025년에 주목해야 할 모바일 앱 디자인 트렌드와 사용자 경험 개선 방법을 살펴보겠습니다.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
        author: {
            name: "김디자이너",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
        },
        category: "디자인",
        readTime: "5분",
        views: 1250,
        likes: 89,
        createdAt: "2025-06-24",
        tags: ["UI/UX", "모바일", "트렌드"]
    },
    {
        id: 2,
        title: "React와 TypeScript로 만드는 모던 웹 애플리케이션",
        excerpt: "실무에서 바로 사용할 수 있는 React와 TypeScript 베스트 프랙티스를 공유합니다.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        author: {
            name: "박개발자",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        },
        category: "개발",
        readTime: "8분",
        views: 2100,
        likes: 156,
        createdAt: "2025-06-23",
        tags: ["React", "TypeScript", "JavaScript"]
    },
    {
        id: 3,
        title: "AI와 머신러닝이 바꾸는 웹 개발의 미래",
        excerpt: "인공지능 기술이 웹 개발에 미치는 영향과 개발자가 준비해야 할 역량에 대해 알아봅니다.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        author: {
            name: "이엔지니어",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        },
        category: "AI/ML",
        readTime: "12분",
        views: 3420,
        likes: 234,
        createdAt: "2025-06-22",
        tags: ["AI", "머신러닝", "웹개발"]
    },
    {
        id: 4,
        title: "성능 최적화를 위한 Next.js 14 활용법",
        excerpt: "Next.js 14의 새로운 기능들을 활용하여 웹 애플리케이션의 성능을 극대화하는 방법을 알아봅니다.",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        author: {
            name: "최프론트",
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face"
        },
        category: "프레임워크",
        readTime: "10분",
        views: 1890,
        likes: 145,
        createdAt: "2025-06-21",
        tags: ["Next.js", "성능", "최적화"]
    },
    {
        id: 5,
        title: "클라우드 네이티브 애플리케이션 개발 가이드",
        excerpt: "컨테이너와 마이크로서비스 아키텍처를 활용한 클라우드 네이티브 애플리케이션 개발 방법론을 소개합니다.",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop",
        author: {
            name: "정클라우드",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
        },
        category: "클라우드",
        readTime: "15분",
        views: 987,
        likes: 67,
        createdAt: "2025-06-20",
        tags: ["클라우드", "컨테이너", "마이크로서비스"]
    },
    {
        id: 6,
        title: "사이버 보안 트렌드와 개발자가 알아야 할 것들",
        excerpt: "최신 사이버 보안 위협과 개발 과정에서 고려해야 할 보안 요소들을 정리했습니다.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
        author: {
            name: "홍보안",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
        },
        category: "보안",
        readTime: "7분",
        views: 1567,
        likes: 92,
        createdAt: "2025-06-19",
        tags: ["보안", "사이버", "개발"]
    }
];

