import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { BlogContext } from '../contexts/BlogContext';

const BlogPost = () => {
  const { posts, deletePost } = useContext(BlogContext);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState([]); // Changed to array for multiple images
  const [documentUrl, setDocumentUrl] = useState('');

  const post = posts.find(p => p.id === parseInt(postId));

  useEffect(() => {
    const newImageUrls = [];
    let newDocumentUrl = '';

    if (post) {
      // Handle multiple image files
      if (post.imageFiles && post.imageFiles.length > 0) {
        post.imageFiles.forEach(file => {
          if (file instanceof File) {
            newImageUrls.push(URL.createObjectURL(file));
          }
        });
      } else if (post.imageFile instanceof File) { // Backward compatibility
        newImageUrls.push(URL.createObjectURL(post.imageFile));
      }
      setImageUrls(newImageUrls);

      // Handle document file
      if (post.documentFile instanceof File) {
        newDocumentUrl = URL.createObjectURL(post.documentFile);
        setDocumentUrl(newDocumentUrl);
      } else {
        setDocumentUrl('');
      }
    } else {
      setImageUrls([]);
      setDocumentUrl('');
    }

    return () => {
      newImageUrls.forEach(url => URL.revokeObjectURL(url));
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

  const layoutType = post.layoutType || 'image-top'; // Default to image-top if undefined

  let galleryStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: layoutType === 'image-left' ? 'flex-start' : layoutType === 'image-right' ? 'flex-start' : 'center'
  };
  let textContentStyle = {};
  let contentWrapperStyle = {};

  if (layoutType === 'image-left') {
    contentWrapperStyle = { display: 'flex', flexDirection: 'row', gap: '20px' };
    galleryStyle = {...galleryStyle, flex: '1', minWidth: '200px'};
    textContentStyle = {flex: '2'};
  } else if (layoutType === 'image-right') {
    contentWrapperStyle = { display: 'flex', flexDirection: 'row-reverse', gap: '20px' };
    galleryStyle = {...galleryStyle, flex: '1', minWidth: '200px'};
    textContentStyle = {flex: '2'};
  } else { // 'image-top' or default
    contentWrapperStyle = { display: 'flex', flexDirection: 'column' };
    // For image-top, gallery images might have a different max-width or justification if needed
    // but the default galleryStyle already handles center justification for this case.
  }

  const imageGalleryComponent = imageUrls.length > 0 && (
    <div className="image-gallery" style={galleryStyle}>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`${post.title} - image ${index + 1}`}
          style={{
            maxWidth: layoutType === 'image-left' || layoutType === 'image-right' ? '100%' : '300px',
            height: 'auto',
          }}
        />
      ))}
    </div>
  );

  const textContentComponent = (
    <div className="text-content" style={textContentStyle}>
      {paragraphs}
      {documentUrl && post.documentFile && (
        <p className="document-link" style={{marginTop: '20px'}}>
          <strong>Document:</strong>{' '}
          <a href={documentUrl} download={post.documentFile.name}>
            {post.documentFile.name}
          </a>
        </p>
      )}
    </div>
  );

  return (
    <article className="blog-post-content">
      <h1>{post.title}</h1>
      <div className="content-wrapper" style={contentWrapperStyle}>
        {imageGalleryComponent}
        {textContentComponent}
      </div>
      <div className="blog-post-actions">
        <Link to={`/edit/${postId}`} className="button-link secondary">Edit Post</Link>
        <button className="danger" onClick={() => {
          if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(postId);
            navigate('/');
          }
        }}>Delete Post</button>
      </div>
    </article>
  );
};

export default BlogPost;
