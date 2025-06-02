import React, { createContext, useState } from 'react';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (postData) => {
    const newPost = {
      ...postData,
      id: Date.now(), // Generate a unique ID
    };
    setPosts(prevPosts => [...prevPosts, newPost]);
    return newPost; // Return the new post, potentially useful for navigation
  };

  const updatePost = (postId, updatedData) => {
    const numericPostId = parseInt(postId); // Ensure ID is number for comparison
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === numericPostId ? { ...post, ...updatedData } : post
      )
    );
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost }}>
      {children}
    </BlogContext.Provider>
  );
};
