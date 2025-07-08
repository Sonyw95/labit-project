
// ========================================
// contexts/BlogContext.jsx - 블로그 컨텍스트
// ========================================
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {useMountedState} from "@/hooks/useMountedState.js";

const BlogContext = createContext(undefined);

// 액션 타입
const BLOG_ACTIONS = {
    SET_POSTS: 'SET_POSTS',
    ADD_POST: 'ADD_POST',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_FILTERS: 'SET_FILTERS',
    SET_PAGINATION: 'SET_PAGINATION',
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_TAGS: 'SET_TAGS',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

// 초기 상태
const initialState = {
    posts: [],
    categories: [],
    tags: [],
    currentPost: null,
    isLoading: false,
    error: null,
    filters: {
        category: '',
        tag: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
};

// 블로그 리듀서
const blogReducer = (state, action) => {
    switch (action.type) {
        case BLOG_ACTIONS.SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                isLoading: false,
                error: null,
            };

        case BLOG_ACTIONS.ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
            };

        case BLOG_ACTIONS.UPDATE_POST:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.id ? { ...post, ...action.payload } : post
                ),
                currentPost: state.currentPost?.id === action.payload.id
                    ? { ...state.currentPost, ...action.payload }
                    : state.currentPost,
            };

        case BLOG_ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                currentPost: state.currentPost?.id === action.payload ? null : state.currentPost,
            };

        case BLOG_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        case BLOG_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case BLOG_ACTIONS.SET_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload,
                },
                pagination: {
                    ...state.pagination,
                    page: 1, // 필터 변경 시 첫 페이지로
                },
            };

        case BLOG_ACTIONS.SET_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        case BLOG_ACTIONS.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            };

        case BLOG_ACTIONS.SET_TAGS:
            return {
                ...state,
                tags: action.payload,
            };

        case BLOG_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// BlogProvider 컴포넌트
export const BlogProvider = ({ children, apiClient }) => {
    console.log('BlogProvider Render')
    const [state, dispatch] = useReducer(blogReducer, initialState);
    const isMounted = useMountedState();

    // 포스트 목록 가져오기
    const fetchPosts = useCallback(async (options = {}) => {
        if (!isMounted()) {
            return;
        }

        dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });

        try {
            const params = {
                ...state.filters,
                ...state.pagination,
                ...options,
            };

            const response = await apiClient.blog.getPosts(params);

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.SET_POSTS, payload: response.posts });
            dispatch({
                type: BLOG_ACTIONS.SET_PAGINATION,
                payload: {
                    total: response.total,
                    totalPages: response.totalPages,
                    page: response.page,
                    limit: response.limit,
                },
            });

            return response;
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [state.filters, state.pagination, apiClient.blog, isMounted]);

    // 포스트 생성
    const createPost = useCallback(async (postData) => {
        if (!isMounted()) {
            return;
        }

        try {
            const response = await apiClient.blog.createPost(postData);

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.ADD_POST, payload: response });
            return response;
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [apiClient.blog, isMounted]);

    // 포스트 업데이트
    const updatePost = useCallback(async (id, postData) => {
        if (!isMounted()) {
            return;
        }

        try {
            const response = await apiClient.blog.updatePost(id, postData);

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.UPDATE_POST, payload: response });
            return response;
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [apiClient.blog, isMounted]);

    // 포스트 삭제
    const deletePost = useCallback(async (id) => {
        if (!isMounted()) {
            return;
        }

        try {
            await apiClient.blog.deletePost(id);

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.DELETE_POST, payload: id });
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [apiClient.blog, isMounted]);

    // 필터 설정
    const setFilters = useCallback((filters) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: BLOG_ACTIONS.SET_FILTERS, payload: filters });
    }, [isMounted]);

    // 페이지네이션 설정
    const setPagination = useCallback((pagination) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: BLOG_ACTIONS.SET_PAGINATION, payload: pagination });
    }, [isMounted]);

    // 카테고리 가져오기
    const fetchCategories = useCallback(async () => {
        if (!isMounted()) {
            return;
        }

        try {
            const response = await apiClient.blog.getCategories();

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.SET_CATEGORIES, payload: response });
            return response;
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [apiClient.blog, isMounted]);

    // 태그 가져오기
    const fetchTags = useCallback(async () => {
        if (!isMounted()) {
            return;
        }

        try {
            const response = await apiClient.blog.getTags();

            if (!isMounted()) {
                return;
            }

            dispatch({ type: BLOG_ACTIONS.SET_TAGS, payload: response });
            return response;
        } catch (error) {
            if (isMounted()) {
                dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            }
            throw error;
        }
    }, [apiClient.blog, isMounted]);

    // 에러 클리어
    const clearError = useCallback(() => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: BLOG_ACTIONS.CLEAR_ERROR });
    }, [isMounted]);

    const value = {
        ...state,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
        setFilters,
        setPagination,
        fetchCategories,
        fetchTags,
        clearError,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};

// useBlog 훅
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};