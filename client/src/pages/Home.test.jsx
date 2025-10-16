import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Home from './Home';
import blogsReducer from '../store/slice/blogSlice/blogs.slice';

// Mock the thunks
vi.mock('../store/slice/blogSlice/blogs.thunk', () => ({
  getAllBlogsThunk: vi.fn(() => ({ type: 'blogs/getAllBlogs' })),
}));

vi.mock('../store/slice/blogSlice/interactionSlice/interact.thunk', () => ({
  viewBlogThunk: vi.fn(() => ({ type: 'blogs/viewBlog' })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock the tour
vi.mock('../components/utils/driverTour', () => ({
  devOdysseyTour: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  };
});

const mockBlogs = [
  {
    _id: 'blog1',
    title: 'First Blog Post',
    content: 'This is the first blog content. '.repeat(100),
    author: {
      _id: 'author1',
      username: 'author1',
      avatar: 'https://example.com/avatar1.jpg',
    },
    tags: ['javascript', 'react'],
    likes: [{ userId: 'user1' }, { userId: 'user2' }],
    views: 150,
    comments: [{ _id: 'comment1' }],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'blog2',
    title: 'Second Blog Post',
    content: 'This is the second blog content. '.repeat(50),
    author: {
      _id: 'author2',
      username: 'author2',
      avatar: 'https://example.com/avatar2.jpg',
    },
    tags: ['testing'],
    likes: [{ userId: 'user1' }],
    views: 75,
    comments: [],
    createdAt: new Date().toISOString(),
  },
];

function createMockStore(initialState = {}) {
  return configureStore({
    reducer: {
      blogs: blogsReducer,
    },
    preloadedState: {
      blogs: {
        blogList: mockBlogs,
        loading: false,
        error: null,
        ...initialState.blogs,
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

describe('Home Component', () => {
  let mockNavigate;

  beforeEach(async () => {
    mockNavigate = vi.fn();
    const routerDom = await import('react-router-dom');
    routerDom.useNavigate.mockReturnValue(mockNavigate);
    
    Storage.prototype.getItem = vi.fn(() => 'list');
    Storage.prototype.setItem = vi.fn();
    global.sessionStorage.getItem = vi.fn();
    global.sessionStorage.setItem = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Hero Section', () => {
    it('should render hero section with welcome message', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
      expect(screen.getByText('DevOdyssey!')).toBeInTheDocument();
    });

    it('should render Get Started button', () => {
      renderWithProviders(<Home />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
    });

    it('should navigate to signup when Get Started is clicked', () => {
      renderWithProviders(<Home />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith('/Signup');
    });
  });

  describe('About Section', () => {
    it('should render "What is DevOdyssey?" heading', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText('What is DevOdyssey?')).toBeInTheDocument();
    });

    it('should render about description', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText(/DevOdyssey is a vibrant, open source platform/i)).toBeInTheDocument();
    });

    it('should render about image', () => {
      renderWithProviders(<Home />);
      const aboutImg = screen.getByAltText('About DevOdyssey');
      expect(aboutImg).toBeInTheDocument();
    });
  });

  describe('Tech Stack Section', () => {
    it('should render Tech Stack heading', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    });

    it('should render all tech stack logos', () => {
      renderWithProviders(<Home />);
      expect(screen.getByAltText('MongoDB')).toBeInTheDocument();
      expect(screen.getByAltText('Express')).toBeInTheDocument();
      expect(screen.getByAltText('React')).toBeInTheDocument();
      expect(screen.getByAltText('Node.js')).toBeInTheDocument();
    });
  });

  describe('Testimonials Section', () => {
    it('should render testimonials heading', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText('What our users say')).toBeInTheDocument();
    });

    it('should render all three testimonials', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText(/DevOdyssey helped me connect/i)).toBeInTheDocument();
      expect(screen.getByText(/I love the featured blogs/i)).toBeInTheDocument();
      expect(screen.getByText(/A must-have platform/i)).toBeInTheDocument();
    });
  });

  describe('Featured Blogs Section', () => {
    it('should render Featured Blogs heading', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText('Featured Blogs')).toBeInTheDocument();
    });

    it('should render blogs in list layout by default', () => {
      renderWithProviders(<Home />);
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    });

    it('should render blogs in grid layout when localStorage is set', () => {
      Storage.prototype.getItem = vi.fn(() => 'grid');
      renderWithProviders(<Home />);
      
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state', () => {
      const store = createMockStore({
        blogs: { blogList: [], loading: true, error: null },
      });
      renderWithProviders(<Home />, { store });
      expect(screen.getByText(/Loading blogs/i)).toBeInTheDocument();
    });

    it('should show error state', () => {
      const store = createMockStore({
        blogs: { blogList: [], loading: false, error: 'Failed to fetch blogs' },
      });
      renderWithProviders(<Home />, { store });
      expect(screen.getByText('Failed to fetch blogs')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty blog list', () => {
      const store = createMockStore({
        blogs: { blogList: [], loading: false, error: null },
      });
      renderWithProviders(<Home />, { store });
      expect(screen.getByText('Featured Blogs')).toBeInTheDocument();
    });

    it('should handle blogs without authors', () => {
      const blogWithoutAuthor = {
        ...mockBlogs[0],
        author: null,
      };
      const store = createMockStore({
        blogs: { blogList: [blogWithoutAuthor], loading: false, error: null },
      });
      renderWithProviders(<Home />, { store });
      expect(screen.getByText('@unknown')).toBeInTheDocument();
    });
  });
});