import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'; // MUI Link for document
import Paper from '@mui/material/Paper'; // Optional: for a background to the content

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const BlogPost = () => {
  const { posts, deletePost } = useContext(BlogContext);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState([]);
  const [documentUrl, setDocumentUrl] = useState('');

  const post = posts.find(p => p.id === parseInt(postId));

  useEffect(() => {
    const newImageUrls = [];
    let newDocUrl = '';

    if (post) {
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

      if (post.documentFile instanceof File) {
        newDocUrl = URL.createObjectURL(post.documentFile);
        setDocumentUrl(newDocUrl);
      } else {
        setDocumentUrl('');
      }
    } else {
      setImageUrls([]);
      setDocumentUrl('');
    }

    return () => {
      newImageUrls.forEach(url => URL.revokeObjectURL(url));
      if (newDocUrl) {
        URL.revokeObjectURL(newDocUrl);
      }
    };
  }, [post]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      navigate('/');
    }
  };

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Post not found.
        </Typography>
      </Container>
    );
  }

  const layoutType = post.layoutType || 'image-top';

  const imagesContent = imageUrls.length > 0 && (
    <Box sx={{ mb: layoutType === 'image-top' ? 2 : 0 }}> {/* Add margin bottom only if images are on top */}
      <Grid container spacing={1}>
        {imageUrls.map((url, index) => (
          <Grid item xs={12} sm={imageUrls.length > 1 ? 6 : 12} key={index}> {/* Show smaller if multiple images */}
            <Box
              component="img"
              src={url}
              alt={`${post.title} - image ${index + 1}`}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
                boxShadow: 1,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const textContent = (
    <Box>
      {post.content.split('\n\n').map((paragraph, index) => (
        <Typography variant="body1" paragraph key={index}>
          {paragraph}
        </Typography>
      ))}
      {documentUrl && post.documentFile && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <AttachFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Link href={documentUrl} download={post.documentFile.name} variant="body1">
            {post.documentFile.name}
          </Link>
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}> {/* Changed to lg for more space if needed */}
      <Paper elevation={0} sx={{ padding: { xs: 2, sm: 3, md: 4 }, backgroundColor: 'transparent' }}> {/* Optional Paper for bg */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {post.title}
        </Typography>

        <Grid container spacing={3} direction={layoutType === 'image-right' ? 'row-reverse' : 'row'}>
          {(layoutType === 'image-left' || layoutType === 'image-right') && imageUrls.length > 0 && (
            <Grid item xs={12} md={5}>
              {imagesContent}
            </Grid>
          )}
          {layoutType === 'image-top' && imageUrls.length > 0 && (
             <Grid item xs={12}>
              {imagesContent}
            </Grid>
          )}
          <Grid item xs={12} md={(layoutType === 'image-left' || layoutType === 'image-right') && imageUrls.length > 0 ? 7 : 12}>
            {textContent}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to={`/edit/${postId}`}
            startIcon={<EditIcon />}
          >
            Edit Post
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
          >
            Delete Post
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogPost;
