import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImageName, setCurrentImageName] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState('');

  const { posts, addPost, updatePost } = useContext(BlogContext); // Get updatePost
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (postId && posts.length > 0) {
      const postToEdit = posts.find(p => p.id === parseInt(postId));
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);

        if (postToEdit.imageFile instanceof File) {
          setImageFile(postToEdit.imageFile);
          setCurrentImageName(postToEdit.imageFile.name);
        } else {
          setImageFile(null);
          setCurrentImageName('');
        }

        if (postToEdit.documentFile instanceof File) {
          setDocumentFile(postToEdit.documentFile);
          setCurrentDocumentName(postToEdit.documentFile.name);
        } else {
          setDocumentFile(null);
          setCurrentDocumentName('');
        }
      } else {
        console.warn(`Post with ID ${postId} not found for editing.`);
        navigate('/'); // Navigate away if post not found
      }
    } else if (!postId) {
      setTitle('');
      setContent('');
      setImageFile(null);
      setCurrentImageName('');
      setDocumentFile(null);
      setCurrentDocumentName('');
    }
  }, [postId, posts, navigate]); // Removed state setters, they are not needed here. `navigate` added.

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setCurrentImageName(event.target.files[0].name);
    } else if (event.target.files && event.target.files.length === 0) {
      // User cancelled file selection, they might want to remove existing.
      // For now, we'll clear the file if they explicitly cancel.
      // To keep an existing file, they should simply not touch the input.
      setImageFile(null);
      setCurrentImageName('');
    }
  };

  const handleDocumentChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDocumentFile(event.target.files[0]);
      setCurrentDocumentName(event.target.files[0].name);
    } else if (event.target.files && event.target.files.length === 0) {
      setDocumentFile(null);
      setCurrentDocumentName('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let targetPostId = postId;

    if (postId) {
      const updatedPostData = {
        title,
        content,
        imageFile, // This will be the new file or the original if not changed
        documentFile, // Same as above
      };
      updatePost(postId, updatedPostData);
      console.log('Updating post with ID:', postId, updatedPostData);
    } else {
      const newPostData = {
        title,
        content,
        imageFile,
        documentFile,
      };
      const newPost = addPost(newPostData); // addPost now returns the new post
      targetPostId = newPost.id; // Get ID for navigation
      console.log('Creating new post:', newPostData);
    }

    setTitle('');
    setContent('');
    setImageFile(null);
    setCurrentImageName('');
    setDocumentFile(null);
    setCurrentDocumentName('');
    event.target.reset();

    if (targetPostId) {
      navigate(`/post/${targetPostId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h2>{postId ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
          />
        </div>
        <div>
          <label htmlFor="imageUpload">Image:</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
          {currentImageName && <p style={{fontSize: '0.9em', color: '#555'}}>Current: {currentImageName}</p>}
        </div>
        <div>
          <label htmlFor="documentUpload">Document:</label>
          <input
            type="file"
            id="documentUpload"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleDocumentChange}
          />
          {currentDocumentName && <p style={{fontSize: '0.9em', color: '#555'}}>Current: {currentDocumentName}</p>}
        </div>
        <button type="submit">{postId ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
};

export default CreatePost;
