import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Blog from './Blog';
import blogsReducer from '../store/slice/blogSlice/blogs.slice';
import authReducer from '../store/slice/authSlice/auth.slice';

// Mock the thunks
vi.mock('../store/slice/blogSlice/blogs.thunk', () => ({
  getAllBlogsThunk: vi.fn(() => ({ type: 'blogs/getAllBlogs' })),
  getSingleBlogThunk: vi.fn(() => ({ type: 'blogs/getSingleBlog' })),
}));

vi.mock('../store/slice/blogSlice/interactionSlice/interact.thunk', () => ({
  likeBlogThunk: vi.fn(() => ({ type: 'blogs/likeBlog' })),
  addCommentThunk: vi.fn(() => ({ type: 'blogs/addComment' })),
  deleteCommentThunk: vi.fn(() => ({ type: 'blogs/deleteComment' })),
}));

// Mock components
vi.mock('../components/ShareButton', () => ({
  default: ({ blog }) => <div data-testid="share-button">Share {blog.title}</div>,
}));

vi.mock('../components/PageHeader', () => ({
  default: () => <div data-testid="page-header">Page Header</div>,
}));

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockBlog = {
  _id: 'blog123',
  title: 'Test Blog Post',
  content: 'This is a test blog post content with enough words to calculate reading time. '.repeat(50),
  author: {
    _id: 'author123',
    username: 'testauthor',
    avatar: 'https://example.com/avatar.jpg',
  },
  tags: ['javascript', 'testing', 'react'],
  likes: [{ userId: 'user1' }, { userId: 'user2' }],
  views: 100,
  comments: [
    {
      _id: 'comment1',
      text: 'Great post!',
      commentedBy: {
        _id: 'commenter1',
        username: 'commenter1',
        avatar: 'https://example.com/commenter1.jpg',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'comment2',
      text: 'Very informative',
      commentedBy: {
        _id: 'commenter2',
        username: 'commenter2',
        avatar: 'https://example.com/commenter2.jpg',
      },
      createdAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
};

const mockUser = {
  _id: 'user123',
  username: 'testuser',
  avatar: 'https://example.com/user.jpg',
};

function createMockStore(initialState = {}) {
  return configureStore({
    reducer: {
      blogs: blogsReducer,
      authReducer: authReducer,
    },
    preloadedState: {
      blogs: {
        blogList: [mockBlog],
        loading: false,
        error: null,
        ...initialState.blogs,
      },
      authReducer: {
        user: mockUser,
        isAuthenticated: true,
        ...initialState.authReducer,
      },
    },
  });
}

function renderWithProviders(ui, { store = createMockStore(), ...options } = {}) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>,
    options
  );
}

describe('Blog Component', () => {
  let mockNavigate;
  let mockUseParams;

  beforeEach(async () => {
    mockNavigate = vi.fn();
    mockUseParams = vi.fn(() => ({ blogTitle: encodeURIComponent('Test Blog Post') }));
    
    const routerDom = await import('react-router-dom');
    routerDom.useNavigate.mockReturnValue(mockNavigate);
    routerDom.useParams.mockImplementation(mockUseParams);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render blog title correctly', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('should render blog content', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText(/This is a test blog post content/)).toBeInTheDocument();
    });

    it('should render author information', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText('@testauthor')).toBeInTheDocument();
      expect(screen.getByAltText('Author profile')).toHaveAttribute('src', mockBlog.author.avatar);
    });

    it('should render all tags', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText('#javascript')).toBeInTheDocument();
      expect(screen.getByText('#testing')).toBeInTheDocument();
      expect(screen.getByText('#react')).toBeInTheDocument();
    });

    it('should render reading time correctly', () => {
      renderWithProviders(<Blog />);
      const readingTimeElements = screen.getAllByText(/mins read/i);
      expect(readingTimeElements.length).toBeGreaterThan(0);
    });

    it('should render engagement stats (likes, views, comments)', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state', () => {
      const store = createMockStore({
        blogs: { blogList: [], loading: true, error: null },
      });
      renderWithProviders(<Blog />, { store });
      expect(screen.getByText(/Loading blog/i)).toBeInTheDocument();
    });

    it('should show error state', () => {
      const store = createMockStore({
        blogs: { blogList: [], loading: false, error: 'Failed to load blog' },
      });
      renderWithProviders(<Blog />, { store });
      expect(screen.getByText('Failed to load blog')).toBeInTheDocument();
    });

    it('should show "Blog not found" when blog does not exist', async () => {
      const routerDom = await import('react-router-dom');
      routerDom.useParams.mockReturnValue({ blogTitle: 'NonExistentBlog' });
      renderWithProviders(<Blog />);
      expect(screen.getByText('Blog not found')).toBeInTheDocument();
    });
  });

  describe('Comment Functionality', () => {
    it('should render all comments', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByText('Great post!')).toBeInTheDocument();
      expect(screen.getByText('Very informative')).toBeInTheDocument();
    });

    it('should render comment input field', () => {
      renderWithProviders(<Blog />);
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });

    it('should show "No comments yet" message when there are no comments', () => {
      const blogWithoutComments = { ...mockBlog, comments: [] };
      const store = createMockStore({
        blogs: { blogList: [blogWithoutComments], loading: false, error: null },
      });
      renderWithProviders(<Blog />, { store });
      expect(screen.getByText('No comments yet on this blog.')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to tag filter when tag is clicked', async () => {
      renderWithProviders(<Blog />);
      const tagElement = screen.getByText('#javascript');
      
      fireEvent.click(tagElement);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/all-blogs?tag=javascript');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle blog without tags', () => {
      const blogWithoutTags = { ...mockBlog, tags: [] };
      const store = createMockStore({
        blogs: { blogList: [blogWithoutTags], loading: false, error: null },
      });
      renderWithProviders(<Blog />, { store });
      expect(screen.queryByText(/#/)).not.toBeInTheDocument();
    });

    it('should handle blog without likes', () => {
      const blogWithoutLikes = { ...mockBlog, likes: [] };
      const store = createMockStore({
        blogs: { blogList: [blogWithoutLikes], loading: false, error: null },
      });
      renderWithProviders(<Blog />, { store });
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle missing author avatar with default', () => {
      const blogWithoutAvatar = {
        ...mockBlog,
        author: { ...mockBlog.author, avatar: null },
      };
      const store = createMockStore({
        blogs: { blogList: [blogWithoutAvatar], loading: false, error: null },
      });
      renderWithProviders(<Blog />, { store });
      const avatarImg = screen.getByAltText('Author profile');
      expect(avatarImg.src).toContain('dicebear.com');
    });
  });
});