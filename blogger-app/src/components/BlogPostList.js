import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

const BlogPostList = () => {
  const { posts } = useContext(BlogContext);

  if (!posts || posts.length === 0) {
    return (
      <div>
        <p>No blog posts yet. <Link to="/create">Create one!</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map(post => (
        <article key={post.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '20px', paddingBottom: '20px' }}>
          <h3>{post.title}</h3>
          <Link to={`/post/${post.id}`}>Read More</Link>
          {' | '}
          <Link to={`/edit/${post.id}`}>Edit</Link>
        </article>
      ))}
    </div>
  );
};

export default BlogPostList;
