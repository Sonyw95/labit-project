import React, { createContext, useContext, useReducer, useCallback } from 'react';

const BlogContext = createContext();

const BLOG_ACTIONS = {
    SET_POSTS: 'SET_POSTS',
    ADD_POST: 'ADD_POST',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_FILTERS: 'SET_FILTERS',
    SET_SEARCH: 'SET_SEARCH',
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_TAGS: 'SET_TAGS',
};

const initialState = {
    posts: [],
    categories: [],
    tags: [],
    isLoading: false,
    error: null,
    filters: {
        category: null,
        tags: [],
        sortBy: 'date',
        sortOrder: 'desc',
    },
    searchQuery: '',
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
    },
};

const blogReducer = (state, action) => {
    switch (action.type) {
        case BLOG_ACTIONS.SET_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                pagination: action.payload.pagination || state.pagination,
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
                    post.id === action.payload.id ? action.payload : post
                ),
            };
        case BLOG_ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
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
                filters: { ...state.filters, ...action.payload },
            };
        case BLOG_ACTIONS.SET_SEARCH:
            return {
                ...state,
                searchQuery: action.payload,
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
        default:
            return state;
    }
};

export const BlogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blogReducer, initialState);

    const setPosts = useCallback((posts, pagination) => {
        dispatch({
            type: BLOG_ACTIONS.SET_POSTS,
            payload: { posts, pagination },
        });
    }, []);

    const addPost = useCallback((post) => {
        dispatch({
            type: BLOG_ACTIONS.ADD_POST,
            payload: post,
        });
    }, []);

    const updatePost = useCallback((post) => {
        dispatch({
            type: BLOG_ACTIONS.UPDATE_POST,
            payload: post,
        });
    }, []);

    const deletePost = useCallback((postId) => {
        dispatch({
            type: BLOG_ACTIONS.DELETE_POST,
            payload: postId,
        });
    }, []);

    const setLoading = useCallback((loading) => {
        dispatch({
            type: BLOG_ACTIONS.SET_LOADING,
            payload: loading,
        });
    }, []);

    const setError = useCallback((error) => {
        dispatch({
            type: BLOG_ACTIONS.SET_ERROR,
            payload: error,
        });
    }, []);

    const setFilters = useCallback((filters) => {
        dispatch({
            type: BLOG_ACTIONS.SET_FILTERS,
            payload: filters,
        });
    }, []);

    const setSearchQuery = useCallback((query) => {
        dispatch({
            type: BLOG_ACTIONS.SET_SEARCH,
            payload: query,
        });
    }, []);

    const setCategories = useCallback((categories) => {
        dispatch({
            type: BLOG_ACTIONS.SET_CATEGORIES,
            payload: categories,
        });
    }, []);

    const setTags = useCallback((tags) => {
        dispatch({
            type: BLOG_ACTIONS.SET_TAGS,
            payload: tags,
        });
    }, []);

    const value = {
        ...state,
        setPosts,
        addPost,
        updatePost,
        deletePost,
        setLoading,
        setError,
        setFilters,
        setSearchQuery,
        setCategories,
        setTags,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};