// tests/apiClient.test.js
import { apiClient } from '../services/apiClient';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

describe('API Client Tests', () => {
    beforeEach(() => {
        // 각 테스트 전에 API 클라이언트 초기화
        jest.clearAllMocks();
    });

    describe('Authentication API', () => {
        test('로그인 성공', async () => {
            const mockResponse = {
                data: {
                    user: { id: 1, name: 'Test User', email: 'test@example.com' },
                    token: 'mock-jwt-token'
                }
            };

            // API 모킹
            jest.spyOn(apiClient.api, 'post').mockResolvedValue(mockResponse);

            const result = await apiClient.auth.login({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result.data.user.email).toBe('test@example.com');
            expect(result.data.token).toBe('mock-jwt-token');
        });

        test('카카오 로그인', async () => {
            const mockResponse = {
                data: {
                    user: { id: 2, name: 'Kakao User', email: 'kakao@example.com' },
                    token: 'mock-kakao-token'
                }
            };

            jest.spyOn(apiClient.api, 'get').mockResolvedValue(mockResponse);

            const result = await apiClient.auth.kakaoLogin();

            expect(result.data.user.email).toBe('kakao@example.com');
            expect(result.data.token).toBe('mock-kakao-token');
        });

        test('로그아웃', async () => {
            jest.spyOn(apiClient.api, 'post').mockResolvedValue({ data: { success: true } });

            const result = await apiClient.auth.logout();

            expect(result.data.success).toBe(true);
        });
    });

    describe('Posts API', () => {
        test('포스트 목록 조회', async () => {
            const mockPosts = {
                data: [
                    { id: 1, title: 'Test Post 1', content: 'Content 1' },
                    { id: 2, title: 'Test Post 2', content: 'Content 2' }
                ]
            };

            jest.spyOn(apiClient.api, 'get').mockResolvedValue(mockPosts);

            const result = await apiClient.posts.getAll();

            expect(result.data).toHaveLength(2);
            expect(result.data[0].title).toBe('Test Post 1');
        });

        test('포스트 생성', async () => {
            const newPost = {
                title: 'New Post',
                content: '<p>New content</p>',
                tags: ['react', 'javascript']
            };

            const mockResponse = {
                data: { id: 3, ...newPost, createdAt: new Date().toISOString() }
            };

            jest.spyOn(apiClient.api, 'post').mockResolvedValue(mockResponse);

            const result = await apiClient.posts.create(newPost);

            expect(result.data.id).toBe(3);
            expect(result.data.title).toBe('New Post');
        });

        test('포스트 업데이트', async () => {
            const updateData = {
                title: 'Updated Post',
                content: '<p>Updated content</p>'
            };

            const mockResponse = {
                data: { id: 1, ...updateData, updatedAt: new Date().toISOString() }
            };

            jest.spyOn(apiClient.api, 'put').mockResolvedValue(mockResponse);

            const result = await apiClient.posts.update(1, updateData);

            expect(result.data.title).toBe('Updated Post');
        });

        test('포스트 삭제', async () => {
            jest.spyOn(apiClient.api, 'delete').mockResolvedValue({ data: { success: true } });

            const result = await apiClient.posts.delete(1);

            expect(result.data.success).toBe(true);
        });
    });

    describe('Comments API', () => {
        test('댓글 목록 조회', async () => {
            const mockComments = {
                data: [
                    { id: 1, content: 'Great post!', postId: 1 },
                    { id: 2, content: 'Thanks for sharing', postId: 1 }
                ]
            };

            jest.spyOn(apiClient.api, 'get').mockResolvedValue(mockComments);

            const result = await apiClient.comments.getByPost(1);

            expect(result.data).toHaveLength(2);
            expect(result.data[0].content).toBe('Great post!');
        });

        test('댓글 생성', async () => {
            const newComment = {
                content: 'New comment',
                postId: 1
            };

            const mockResponse = {
                data: { id: 3, ...newComment, createdAt: new Date().toISOString() }
            };

            jest.spyOn(apiClient.api, 'post').mockResolvedValue(mockResponse);

            const result = await apiClient.comments.create(1, { content: 'New comment' });

            expect(result.data.content).toBe('New comment');
        });
    });

    describe('Batch Operations', () => {
        test('배치 요청 처리', async () => {
            const batchRequests = [
                { method: 'GET', url: '/posts', id: 'posts' },
                { method: 'GET', url: '/tags', id: 'tags' },
                { method: 'GET', url: '/categories', id: 'categories' }
            ];

            const mockResponse = {
                data: {
                    posts: { data: [] },
                    tags: { data: [] },
                    categories: { data: [] }
                }
            };

            jest.spyOn(apiClient.api, 'post').mockResolvedValue(mockResponse);

            const result = await apiClient.batch.execute(batchRequests);

            expect(result.data).toHaveProperty('posts');
            expect(result.data).toHaveProperty('tags');
            expect(result.data).toHaveProperty('categories');
        });
    });
});