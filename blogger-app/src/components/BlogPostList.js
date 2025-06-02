import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

const BlogPostList = () => {
  const { posts, deletePost } = useContext(BlogContext);

  if (!posts || posts.length === 0) {
    return (
      <div>
        <p>No blog posts yet. <Link to="/create">Create one!</Link></p>
      </div>
    );
  }

  return (
    <div className="blog-post-list">
      <h2>Blog Posts</h2>
      {posts.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          {/* Optional: Add a short snippet of post.content here if desired */}
          <div className="post-actions">
            <Link to={`/post/${post.id}`} className="button-link">Read More</Link>
            <Link to={`/edit/${post.id}`} className="button-link secondary">Edit</Link>
            <button className="danger" onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                deletePost(post.id);
              }
            }}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogPostList;
