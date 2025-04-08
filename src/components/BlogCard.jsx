import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function BlogCard({ id, showFullContent = false }) {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles:profile_id(full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  if (!post) return null;
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      
      <div className="relative h-56 overflow-hidden">
        <img 
          src={post.image_url || 'https://via.placeholder.com/400x300'} 
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.published_at).toLocaleDateString()}
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.profiles?.full_name}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{showFullContent ? post.content : post.content?.substring(0, 150) + '...'}</p>
        <Link 
          to={`/blog/${post.id}`}
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-300"
        >
          Soma Zaidi
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;