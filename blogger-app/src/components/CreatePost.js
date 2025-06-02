import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'; // For form background

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // For file uploads
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // For image uploads

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [currentImageNames, setCurrentImageNames] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  const [layoutType, setLayoutType] = useState('image-top');

  const { posts, addPost, updatePost } = useContext(BlogContext);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (postId && posts.length > 0) {
      const postToEdit = posts.find(p => p.id === parseInt(postId));
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        // Assuming imageFiles in context are File objects or can be reconstructed as such if needed.
        // For simplicity, we're not trying to re-populate the FileList objects for editing existing images here.
        // We'll keep existing image names if they are stored as strings or some other reference.
        // This example focuses on uploading new images or replacing all.
        // A more complex scenario would handle individual image additions/removals from an existing set.
        if (postToEdit.imageFiles && Array.isArray(postToEdit.imageFiles)) {
            // If imageFiles are actual File objects (e.g., from a previous edit session not yet saved)
            const fileObjects = postToEdit.imageFiles.filter(f => f instanceof File);
            setImageFiles(fileObjects);
            setCurrentImageNames(fileObjects.map(f => f.name));
        } else {
            // If imageFiles are just names/URLs from saved post, display them but don't add to imageFiles state
            // This part might need adjustment based on how `postToEdit.imageFiles` is structured for saved posts.
            // For now, we assume `currentImageNames` is primarily for newly staged files.
             setCurrentImageNames(postToEdit.imageFiles ? postToEdit.imageFiles.map(f => typeof f === 'string' ? f : f.name) : []);
        }


        if (postToEdit.documentFile instanceof File) {
          setDocumentFile(postToEdit.documentFile);
          setCurrentDocumentName(postToEdit.documentFile.name);
        } else if (typeof postToEdit.documentFile === 'string') { // Assuming name is stored if not a File object
            setCurrentDocumentName(postToEdit.documentFile);
        } else {
          setDocumentFile(null);
          setCurrentDocumentName('');
        }
        setLayoutType(postToEdit.layoutType || 'image-top');
      } else {
        navigate('/');
      }
    } else {
      setTitle('');
      setContent('');
      setImageFiles([]);
      setCurrentImageNames([]);
      setDocumentFile(null);
      setCurrentDocumentName('');
      setLayoutType('image-top');
    }
  }, [postId, posts, navigate]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      // Filter out duplicates by name before adding
      const newFiles = filesArray.filter(newFile => !imageFiles.some(existingFile => existingFile.name === newFile.name));
      const newFileNames = newFiles.map(f => f.name);

      setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
      setCurrentImageNames(prevNames => [...prevNames, ...newFileNames]);
    }
    event.target.value = null; // Allow re-selecting the same file(s)
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setCurrentImageNames(prevNames => prevNames.filter((_, index) => index !== indexToRemove));
  };

  const handleDocumentChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDocumentFile(event.target.files[0]);
      setCurrentDocumentName(event.target.files[0].name);
    } else {
      setDocumentFile(null);
      setCurrentDocumentName('');
    }
    event.target.value = null; // Allow re-selecting the same file
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setCurrentDocumentName('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postData = {
      title,
      content,
      imageFiles, // Pass File objects for new/updated images
      documentFile, // Pass File object for new/updated document
      layoutType,
    };

    if (postId) {
      updatePost(postId, postData);
    } else {
      const newPost = addPost(postData); // addPost should ideally return the new post with ID
      // navigate(`/post/${newPost.id}`); // Navigate after getting ID
    }
    // Resetting form fields - consider if navigation should happen first or if ID is needed
    setTitle('');
    setContent('');
    setImageFiles([]);
    setCurrentImageNames([]);
    setDocumentFile(null);
    setCurrentDocumentName('');
    setLayoutType('image-top');

    if(!postId) {
        // For new post, navigate to home or new post page if ID is available
        navigate('/'); // Or /post/newPostId if addPost returns it and it's handled
    } else {
        // For edited post, navigate to the post's page
        navigate(`/post/${postId}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          {postId ? 'Edit Post' : 'Create New Post'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="layout-type-label">Layout</InputLabel>
            <Select
              labelId="layout-type-label"
              id="layoutType"
              value={layoutType}
              label="Layout"
              onChange={(e) => setLayoutType(e.target.value)}
            >
              <MenuItem value="image-top">Image Top, Text Below</MenuItem>
              <MenuItem value="image-left">Image Left, Text Right</MenuItem>
              <MenuItem value="image-right">Image Right, Text Left</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mb: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
            <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth>
              Upload Images
              <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
            </Button>
            {currentImageNames.length > 0 && (
              <List dense sx={{mt: 1}}>
                {currentImageNames.map((name, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete image" onClick={() => removeImage(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Box sx={{ mb: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth>
              Upload Document
              <input type="file" hidden onChange={handleDocumentChange} accept=".pdf,.doc,.docx,.txt" />
            </Button>
            {currentDocumentName && (
              <List dense sx={{mt: 1}}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete document" onClick={removeDocument}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ bgcolor: 'action.hover', borderRadius: 1 }}
                >
                  <ListItemText primary={currentDocumentName} />
                </ListItem>
              </List>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ py: 1.5 }}
          >
            {postId ? 'Update Post' : 'Create Post'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
