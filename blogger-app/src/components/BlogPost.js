import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import { BlogContext } from '../contexts/BlogContext';

const BlogPost = () => {
  const { posts } = useContext(BlogContext);
  const { postId } = useParams();

  const [imageUrl, setImageUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');

  const post = posts.find(p => p.id === parseInt(postId));

  useEffect(() => {
    let newImageUrl = '';
    let newDocumentUrl = '';

    if (post && post.imageFile instanceof File) {
      newImageUrl = URL.createObjectURL(post.imageFile);
      setImageUrl(newImageUrl);
    } else {
      setImageUrl('');
    }

    if (post && post.documentFile instanceof File) {
      newDocumentUrl = URL.createObjectURL(post.documentFile);
      setDocumentUrl(newDocumentUrl);
    } else {
      setDocumentUrl('');
    }

    return () => {
      if (newImageUrl) {
        URL.revokeObjectURL(newImageUrl);
      }
      if (newDocumentUrl) {
        URL.revokeObjectURL(newDocumentUrl);
      }
    };
  }, [post]);

  if (!post) {
    return <div>Post not found.</div>;
  }

  const paragraphs = post.content.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  return (
    <article>
      <h1>{post.title}</h1>

      {imageUrl && (
        <img src={imageUrl} alt={post.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
      )}

      {paragraphs}

      {documentUrl && post.documentFile && (
        <p style={{marginTop: '20px'}}>
          <strong>Document:</strong>{' '}
          <a href={documentUrl} download={post.documentFile.name}>
            {post.documentFile.name}
          </a>
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to={`/edit/${postId}`} className="button-link">Edit Post</Link>
      </div>
    </article>
  );
};

export default BlogPost;
