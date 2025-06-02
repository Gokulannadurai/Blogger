import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [currentImageNames, setCurrentImageNames] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  const [layoutType, setLayoutType] = useState('image-top'); // New state for layout

  const { posts, addPost, updatePost } = useContext(BlogContext);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (postId && posts.length > 0) {
      const postToEdit = posts.find(p => p.id === parseInt(postId));
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);

        // Handle imageFiles for editing
        if (postToEdit.imageFiles && postToEdit.imageFiles.length > 0) {
          setImageFiles(postToEdit.imageFiles.filter(f => f instanceof File)); // Ensure they are files
          setCurrentImageNames(postToEdit.imageFiles.map(f => f.name).filter(name => name));
        } else if (postToEdit.imageFile instanceof File) { // Backward compatibility
          setImageFiles([postToEdit.imageFile]);
          setCurrentImageNames([postToEdit.imageFile.name]);
        } else {
          setImageFiles([]);
          setCurrentImageNames([]);
        }

        if (postToEdit.documentFile instanceof File) {
          setDocumentFile(postToEdit.documentFile);
          setCurrentDocumentName(postToEdit.documentFile.name);
        } else {
          setDocumentFile(null);
          setCurrentDocumentName('');
        }
        setLayoutType(postToEdit.layoutType || 'image-top'); // Load layout type
      } else {
        console.warn(`Post with ID ${postId} not found for editing.`);
        navigate('/');
      }
    } else if (!postId) {
      // Resetting form for new post
      setTitle('');
      setContent('');
      setImageFiles([]);
      setCurrentImageNames([]);
      setDocumentFile(null);
      setCurrentDocumentName('');
      setLayoutType('image-top'); // Default layout for new post
    }
  }, [postId, posts, navigate]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(prevFiles => [...prevFiles, ...filesArray]); // Append new files
      setCurrentImageNames(prevNames => [...prevNames, ...filesArray.map(f => f.name)]);
    } else if (event.target.files && event.target.files.length === 0 && postId) {
      // If editing and user cancels, it implies they might want to clear *newly added* files for this session.
      // Existing files (already part of the post) should be handled differently, perhaps with a separate "remove" button per image.
      // For simplicity, this basic implementation will clear all staged files if selection is cancelled.
      // A more robust solution would distinguish between already uploaded and newly staged files.
      setImageFiles([]);
      setCurrentImageNames([]);
    } else if (event.target.files && event.target.files.length === 0 && !postId) {
        // If creating a new post and user cancels, clear the selection
        setImageFiles([]);
        setCurrentImageNames([]);
    }
    // To allow re-selecting the same file(s) if removed and then added again
    event.target.value = null;
  };

  // Function to remove a specific image from the selection
  const removeImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setCurrentImageNames(prevNames => prevNames.filter((_, i) => i !== index));
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
        imageFiles,
        documentFile,
        layoutType, // Include layout type
      };
      updatePost(postId, updatedPostData);
      console.log('Updating post with ID:', postId, updatedPostData);
    } else {
      const newPostData = {
        title,
        content,
        imageFiles,
        documentFile,
        layoutType, // Include layout type
      };
      const newPost = addPost(newPostData);
      targetPostId = newPost.id;
      console.log('Creating new post:', newPostData);
    }

    // Reset form fields
    setTitle('');
    setContent('');
    setImageFiles([]);
    setCurrentImageNames([]);
    setDocumentFile(null);
    setCurrentDocumentName('');
    setLayoutType('image-top'); // Reset layout type
    // event.target.reset();

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
          <label htmlFor="layoutType">Layout:</label>
          <select id="layoutType" value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
            <option value="image-top">Image Top, Text Below</option>
            <option value="image-left">Image Left, Text Right</option>
            <option value="image-right">Image Right, Text Left</option>
          </select>
        </div>
        <div>
          <label htmlFor="imageUpload">Images:</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            multiple // Allow multiple file selection
            onChange={handleImageChange}
          />
          {currentImageNames.length > 0 && (
            <div style={{marginTop: '10px'}}>
              <p style={{fontSize: '0.9em', color: '#555', marginBottom: '0.5rem'}}>Selected images:</p>
              <ul className="selected-images-list">
                {currentImageNames.map((name, index) => (
                  <li key={index}>
                    <span>{name}</span>
                    <button type="button" onClick={() => removeImage(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
