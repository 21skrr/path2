import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchArticles, apiClient } from '../services/api';

export type PostCategory = 'ACTUALITÉ RH' | 'INTERVIEW' | 'ETUDE' | 'NOMINATION';

export interface Post {
  id: number | string;
  category: PostCategory;
  tag?: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  image?: string;
  href: string;
}

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<Post, 'id' | 'href' | 'date' | 'readTime'>) => Promise<void>;
  deletePost: (id: number | string) => Promise<void>;
  updatePost: (id: number | string, data: Partial<Post>) => Promise<void>;
  refreshPosts: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Some initial seed data if localStorage is empty
const INITIAL_POSTS: Post[] = [
  {
    id: 'seed-1',
    category: 'ACTUALITÉ RH',
    tag: 'À LA UNE',
    title: '[LIVRE] Augmenting Human Resource Management with Artificial Intelligence',
    excerpt: 'Une analyse approfondie de l\'impact de l\'IA sur les pratiques RH modernes au Maroc et en Afrique.',
    content: 'Long article text goes here...',
    date: '28 MARS 2026',
    readTime: '5 min',
    href: '/articles/seed-1',
  },
];

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchArticles();
      
      // Transform Backend ArticleDTO to Frontend Post model
      const transformedPosts: Post[] = response.data.map((art: any) => ({
        id: art.id,
        category: art.category as PostCategory,
        title: art.title,
        excerpt: art.content ? art.content.substring(0, 150) + '...' : '',
        content: art.content,
        date: art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'short', year: 'numeric'
        }).toUpperCase() : 'DATE INCONNUE',
        readTime: '5 min',
        image: art.imageUrl,
        href: `/articles/${art.id}`,
      }));

      setPosts(transformedPosts.length > 0 ? transformedPosts : INITIAL_POSTS);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts from backend', err);
      setError('Impossible de charger les articles du serveur.');
      setPosts(INITIAL_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async (postData: Omit<Post, 'id' | 'href' | 'date' | 'readTime'>) => {
    try {
      await apiClient.post('/articles', {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        imageUrl: postData.image,
        isPremium: false
      });
      loadPosts();
    } catch (err) {
      console.error('Failed to add post', err);
      alert('Erreur lors de la création de l\'article');
    }
  };

  const deletePost = async (id: number | string) => {
    try {
      await apiClient.delete(`/articles/${id}`);
      loadPosts();
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const updatePost = async (id: number | string, data: Partial<Post>) => {
    try {
      await apiClient.put(`/articles/${id}`, data);
      loadPosts();
    } catch (err) {
      console.error('Failed to update post', err);
    }
  };

  return (
    <PostsContext.Provider value={{ posts, loading, error, addPost, deletePost, updatePost, refreshPosts: loadPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
