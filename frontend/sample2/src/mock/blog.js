import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
    '무언가 이상한 타이틀',
    '무언가 이상한 타이틀',
    'Designify Agency Landing Page Design',
    '✨What is Done is Done ✨',
    'Fresh Prince',
    'Six Socks Studio',
    'vincenzo de cotiis’ crossing over showcases a research on contamination',
    'Simple, Great Looking Animations in Your Project | Video Tutorial',
];

const posts = [...Array(POST_TITLES.length)].map((_, index) => ({
    id: faker.string.uuid(),
    cover: `/resources/images/covers/cover_${index + 1}.jpg`,
    title: POST_TITLES[index],
    createAt: faker.date.past(),
    view: faker.number.int(),
    comment: faker.number.int(),
    share: faker.number.int(),
    favorite: faker.number.int(),
    author: {
        name: faker.person.fullName(),
        avatarUrl: `/resources/images/avatars/labit_profile_avatar.jpeg`,
    },
}));

export default posts;
