
const navCategories = [
    {
        head: 'group',
        title: 'Dev',
        path: 'blog/dev',
        icon: 'carbon:cics-program',
        child: [
            {
                head: 'group',
                title: 'Java',
                path: 'blog/dev/java',
                icon: 'ri:java-line',
                child: [
                    {
                        head: 'element',
                        title: 'Basic',
                        subTitle: 'java > basic',
                        path: 'blog/dev/java?type=basic',
                        icon: 'ic:baseline-code',
                    },
                    {
                        head: 'element',
                        title: 'Spring',
                        subTitle: 'java > spring',
                        path: 'blog/dev/java?type=spring',
                        icon: 'cib:spring',
                    },
                ]
            },
            {
                head: 'group',
                title: 'React',
                path: 'blog/dev/react',
                icon: 'mdi:react',
                child: [
                    {
                        head: 'element',
                        title: 'Basic',
                        subTitle: 'react > basic',
                        path: '/blog/dev/react?type=basic',
                        icon: 'ic:baseline-code',
                    },
                    {
                        head: 'element',
                        title: 'Material',
                        subTitle: 'react > material',
                        path: 'blog/dev/react?type=material',
                        icon: 'mdi:material-ui',
                    },
                ]
            },
            {
                head: 'group',
                title: 'DB',
                path: '/admin',
                icon: 'material-symbols-light:database',
                child: null
            },
        ]
    },

    {
        head: 'group',
        title: 'Admin',
        path: '/admin',
        icon: 'ri:admin-line',
        child: null
    },

]
export default navCategories;
