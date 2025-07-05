import React, {createContext, useContext, useReducer, useCallback, useEffect} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Blog Context
const BlogContext = createContext();

// Blog actions
const BLOG_ACTIONS = {
    SET_POSTS: 'SET_POSTS',
    ADD_POST: 'ADD_POST',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_SELECTED_TAGS: 'SET_SELECTED_TAGS',
    SET_SORT_BY: 'SET_SORT_BY',
    SET_VIEW_MODE: 'SET_VIEW_MODE',
    ADD_BOOKMARK: 'ADD_BOOKMARK',
    REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
    INCREMENT_VIEW: 'INCREMENT_VIEW',
    TOGGLE_LIKE: 'TOGGLE_LIKE',
    SET_COMMENTS: 'SET_COMMENTS',
    ADD_COMMENT: 'ADD_COMMENT',
    UPDATE_COMMENT: 'UPDATE_COMMENT',
    DELETE_COMMENT: 'DELETE_COMMENT',
};

// Initial state
const initialState = {
    posts: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedTags: [],
    sortBy: 'latest', // latest, popular, views, likes
    viewMode: 'grid', // grid, list
    bookmarks: [],
    comments: {},
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        hasMore: true,
    },
};

// Blog reducer
const blogReducer = (state, action) => {
    switch (action.type) {
        case BLOG_ACTIONS.SET_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                pagination: {
                    ...state.pagination,
                    ...action.payload.pagination,
                },
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
            };

        case BLOG_ACTIONS.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
            };

        case BLOG_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };

        case BLOG_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case BLOG_ACTIONS.SET_SEARCH_QUERY:
            return {
                ...state,
                searchQuery: action.payload,
            };

        case BLOG_ACTIONS.SET_SELECTED_TAGS:
            return {
                ...state,
                selectedTags: action.payload,
            };

        case BLOG_ACTIONS.SET_SORT_BY:
            return {
                ...state,
                sortBy: action.payload,
            };

        case BLOG_ACTIONS.SET_VIEW_MODE:
            return {
                ...state,
                viewMode: action.payload,
            };

        case BLOG_ACTIONS.ADD_BOOKMARK:
            return {
                ...state,
                bookmarks: [...state.bookmarks, action.payload],
            };

        case BLOG_ACTIONS.REMOVE_BOOKMARK:
            return {
                ...state,
                bookmarks: state.bookmarks.filter(id => id !== action.payload),
            };

        case BLOG_ACTIONS.INCREMENT_VIEW:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload
                        ? { ...post, views: (post.views || 0) + 1 }
                        : post
                ),
            };

        case BLOG_ACTIONS.TOGGLE_LIKE:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? {
                            ...post,
                            likes: action.payload.liked
                                ? (post.likes || 0) + 1
                                : Math.max((post.likes || 0) - 1, 0),
                            isLiked: action.payload.liked,
                        }
                        : post
                ),
            };

        case BLOG_ACTIONS.SET_COMMENTS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.payload.postId]: action.payload.comments,
                },
            };

        case BLOG_ACTIONS.ADD_COMMENT:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.payload.postId]: [
                        ...(state.comments[action.payload.postId] || []),
                        action.payload.comment,
                    ],
                },
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                        : post
                ),
            };

        case BLOG_ACTIONS.UPDATE_COMMENT:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.payload.postId]: state.comments[action.payload.postId]?.map(comment =>
                        comment.id === action.payload.comment.id
                            ? { ...comment, ...action.payload.comment }
                            : comment
                    ) || [],
                },
            };

        case BLOG_ACTIONS.DELETE_COMMENT:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [action.payload.postId]: state.comments[action.payload.postId]?.filter(
                        comment => comment.id !== action.payload.commentId
                    ) || [],
                },
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, commentCount: Math.max((post.commentCount || 0) - 1, 0) }
                        : post
                ),
            };

        default:
            return state;
    }
};

// Blog Provider
export const BlogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(blogReducer, initialState);
    // const [bookmarks, setBookmarks] = useLocalStorage('blogBookmarks', []);
    const [preferences, setPreferences] = useLocalStorage('blogPreferences', {
        viewMode: 'grid',
        sortBy: 'latest',
    });

    // Load bookmarks and preferences on mount
    useEffect(() => {
        dispatch({ type: BLOG_ACTIONS.REMOVE_BOOKMARK, payload: null });
        // bookmarks.forEach(id => {
        //     dispatch({ type: BLOG_ACTIONS.ADD_BOOKMARK, payload: id });
        // });

        dispatch({ type: BLOG_ACTIONS.SET_VIEW_MODE, payload: preferences.viewMode });
        dispatch({ type: BLOG_ACTIONS.SET_SORT_BY, payload: preferences.sortBy });
    // }, [bookmarks, preferences]);
    }, [preferences]);


    // Save preferences when they change
    useEffect(() => {
        setPreferences('blogPreferences', {
            viewMode: state.viewMode,
            sortBy: state.sortBy,
        });
    }, [state.viewMode, state.sortBy, setPreferences]);

    // // Save bookmarks when they change
    // useEffect(() => {
    //     setBookmarks(state.bookmarks);
    // }, [state.bookmarks, setBookmarks]);

    // Fetch posts
    const fetchPosts = useCallback(async (options = {}) => {
        const {
            page = 1,
            limit = 10,
            search = state.searchQuery,
            tags = state.selectedTags,
            sortBy = state.sortBy,
            reset = false,
        } = options;

        dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy,
                ...(search && { search }),
                ...(tags.length > 0 && { tags: tags.join(',') }),
            });

            const response = await fetch(`/api/posts?${queryParams}`);

            if (!response.ok) {
                throw new Error('게시글을 불러오는데 실패했습니다.');
            }

            const data = await response.json();

            dispatch({
                type: BLOG_ACTIONS.SET_POSTS,
                payload: {
                    posts: reset ? data.posts : [...state.posts, ...data.posts],
                    pagination: {
                        page: data.page,
                        limit: data.limit,
                        total: data.total,
                        hasMore: data.hasMore,
                    },
                },
            });

            return data;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: false });
        }
    }, [state.searchQuery, state.selectedTags, state.sortBy, state.posts]);

    // Create post
    const createPost = useCallback(async (postData) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('게시글 작성에 실패했습니다.');
            }

            const newPost = await response.json();
            dispatch({ type: BLOG_ACTIONS.ADD_POST, payload: newPost });

            return newPost;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Update post
    const updatePost = useCallback(async (postId, updates) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('게시글 수정에 실패했습니다.');
            }

            const updatedPost = await response.json();
            dispatch({ type: BLOG_ACTIONS.UPDATE_POST, payload: updatedPost });

            return updatedPost;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Delete post
    const deletePost = useCallback(async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('게시글 삭제에 실패했습니다.');
            }

            dispatch({ type: BLOG_ACTIONS.DELETE_POST, payload: postId });
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Toggle bookmark
    const toggleBookmark = useCallback((postId) => {
        const isBookmarked = state.bookmarks.includes(postId);

        if (isBookmarked) {
            dispatch({ type: BLOG_ACTIONS.REMOVE_BOOKMARK, payload: postId });
        } else {
            dispatch({ type: BLOG_ACTIONS.ADD_BOOKMARK, payload: postId });
        }
    }, [state.bookmarks]);

    // Toggle like
    const toggleLike = useCallback(async (postId) => {
        const post = state.posts.find(p => p.id === postId);
        const isLiked = post?.isLiked;

        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: isLiked ? 'DELETE' : 'POST',
            });

            if (!response.ok) {
                throw new Error('좋아요 처리에 실패했습니다.');
            }

            dispatch({
                type: BLOG_ACTIONS.TOGGLE_LIKE,
                payload: { postId, liked: !isLiked },
            });
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
        }
    }, [state.posts]);

    // Increment view
    const incrementView = useCallback(async (postId) => {
        try {
            await fetch(`/api/posts/${postId}/view`, {
                method: 'POST',
            });

            dispatch({ type: BLOG_ACTIONS.INCREMENT_VIEW, payload: postId });
        } catch (error) {
            console.warn('View count update failed:', error);
        }
    }, []);

    // Fetch comments
    const fetchComments = useCallback(async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);

            if (!response.ok) {
                throw new Error('댓글을 불러오는데 실패했습니다.');
            }

            const comments = await response.json();
            dispatch({
                type: BLOG_ACTIONS.SET_COMMENTS,
                payload: { postId, comments },
            });

            return comments;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Add comment
    const addComment = useCallback(async (postId, commentData) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error('댓글 작성에 실패했습니다.');
            }

            const newComment = await response.json();
            dispatch({
                type: BLOG_ACTIONS.ADD_COMMENT,
                payload: { postId, comment: newComment },
            });

            return newComment;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Update comment
    const updateComment = useCallback(async (postId, commentId, updates) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('댓글 수정에 실패했습니다.');
            }

            const updatedComment = await response.json();
            dispatch({
                type: BLOG_ACTIONS.UPDATE_COMMENT,
                payload: { postId, comment: updatedComment },
            });

            return updatedComment;
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Delete comment
    const deleteComment = useCallback(async (postId, commentId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('댓글 삭제에 실패했습니다.');
            }

            dispatch({
                type: BLOG_ACTIONS.DELETE_COMMENT,
                payload: { postId, commentId },
            });
        } catch (error) {
            dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    }, []);

    // Search and filter functions
    const setSearchQuery = useCallback((query) => {
        dispatch({ type: BLOG_ACTIONS.SET_SEARCH_QUERY, payload: query });
    }, []);

    const setSelectedTags = useCallback((tags) => {
        dispatch({ type: BLOG_ACTIONS.SET_SELECTED_TAGS, payload: tags });
    }, []);

    const setSortBy = useCallback((sortBy) => {
        dispatch({ type: BLOG_ACTIONS.SET_SORT_BY, payload: sortBy });
    }, []);

    const setViewMode = useCallback((mode) => {
        dispatch({ type: BLOG_ACTIONS.SET_VIEW_MODE, payload: mode });
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: null });
    }, []);

    // Get filtered posts
    const getFilteredPosts = useCallback(() => {
        let filtered = [...state.posts];

        // Apply search filter
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Apply tag filter
        if (state.selectedTags.length > 0) {
            filtered = filtered.filter(post =>
                state.selectedTags.every(tag =>
                    post.tags?.includes(tag)
                )
            );
        }

        // Apply sorting
        switch (state.sortBy) {
            case 'latest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'views':
                filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
            case 'comments':
                filtered.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [state.posts, state.searchQuery, state.selectedTags, state.sortBy]);

    const value = {
        ...state,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
        toggleBookmark,
        toggleLike,
        incrementView,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        setSearchQuery,
        setSelectedTags,
        setSortBy,
        setViewMode,
        clearError,
        getFilteredPosts,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};

// Blog hook
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};