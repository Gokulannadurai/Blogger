import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // For centering "No posts" message

// Icons
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BlogPostList = () => {
  const { posts, deletePost } = useContext(BlogContext);

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          No blog posts yet.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/create"
          startIcon={<AddCircleOutlineIcon />}
        >
          Create One!
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}> {/* Added padding to the Box container */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Blog Posts
      </Typography>
      <Grid container spacing={3}> {/* Increased spacing for better visual separation */}
        {posts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: 6, // MUI's elevation shorthand for a deeper shadow
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                {/*
                  Optional: Add a snippet of post.content here
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {post.content.substring(0, 100)}...
                  </Typography>
                */}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-start', padding: '0 16px 16px 16px' }}> {/* Ensure actions are at bottom and spaced */}
                <Button
                  component={RouterLink}
                  to={`/post/${post.id}`}
                  size="small"
                  startIcon={<ReadMoreIcon />}
                >
                  Read More
                </Button>
                <Button
                  component={RouterLink}
                  to={`/edit/${post.id}`}
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{ ml: 1 }} // Add some margin if needed
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(post.id)}
                  startIcon={<DeleteIcon />}
                  sx={{ ml: 'auto' }} // Push delete to the right
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogPostList;
