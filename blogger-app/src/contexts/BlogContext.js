import React, { createContext, useState } from 'react';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (postData) => {
    let newPostData = { ...postData };
    if (newPostData.imageFile) {
      newPostData.imageFiles = [newPostData.imageFile];
      delete newPostData.imageFile;
    }
    const newPost = {
      layoutType: 'image-top', // Default layout
      ...newPostData,
      id: Date.now(), // Generate a unique ID
    };
    setPosts(prevPosts => [...prevPosts, newPost]);
    return newPost; // Return the new post, potentially useful for navigation
  };

  const updatePost = (postId, updatedData) => {
    let newUpdatedData = { ...updatedData };
    if (newUpdatedData.imageFile) {
      newUpdatedData.imageFiles = [newUpdatedData.imageFile];
      delete newUpdatedData.imageFile;
    }
    const numericPostId = parseInt(postId); // Ensure ID is number for comparison
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === numericPostId ? { ...post, ...newUpdatedData, layoutType: newUpdatedData.layoutType || post.layoutType } : post
      )
    );
  };

  const deletePost = (postId) => {
    const numericPostId = parseInt(postId); // Ensure ID is number for comparison
    setPosts(prevPosts =>
      prevPosts.filter(post => post.id !== numericPostId)
    );
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
};
