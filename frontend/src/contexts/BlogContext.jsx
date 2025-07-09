import React, { createContext, useContext, useReducer } from 'react';

const BlogContext = createContext();

const blogReducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return { ...state, posts: action.payload };
        case 'ADD_POST':
            return { ...state, posts: [action.payload, ...state.posts] };
        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.id ? action.payload : post
                )
            };
        case 'DELETE_POST':
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload)
            };
        case 'SET_CURRENT_POST':
            return { ...state, currentPost: action.payload };
        case 'SET_TAGS':
            return { ...state, tags: action.payload };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

const initialState = {
    posts: [],
    currentPost: null,
    tags: [],
    categories: [],
    loading: false,
    error: null
};

export const BlogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blogReducer, initialState);

    const setPosts = (posts) => {
        dispatch({ type: 'SET_POSTS', payload: posts });
    };

    const addPost = (post) => {
        dispatch({ type: 'ADD_POST', payload: post });
    };

    const updatePost = (post) => {
        dispatch({ type: 'UPDATE_POST', payload: post });
    };

    const deletePost = (postId) => {
        dispatch({ type: 'DELETE_POST', payload: postId });
    };

    const setCurrentPost = (post) => {
        dispatch({ type: 'SET_CURRENT_POST', payload: post });
    };

    const setTags = (tags) => {
        dispatch({ type: 'SET_TAGS', payload: tags });
    };

    const setCategories = (categories) => {
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
    };

    const setLoading = (loading) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        setPosts,
        addPost,
        updatePost,
        deletePost,
        setCurrentPost,
        setTags,
        setCategories,
        setLoading,
        setError,
        clearError
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