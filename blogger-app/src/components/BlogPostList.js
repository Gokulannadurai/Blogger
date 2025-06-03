import React, { useContext, useState } from 'react'; // Import useState
import { Link as RouterLink } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'; // Added
import InputAdornment from '@mui/material/InputAdornment'; // Added

// Icons
import SearchIcon from '@mui/icons-material/Search'; // Added
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BlogPostList = () => {
  const { posts, deletePost } = useContext(BlogContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  // Determine content to render based on posts and filteredPosts
  let contentToRender;

  if (posts.length === 0) {
    // State 1: No posts at all
    contentToRender = (
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
          sx={{ mt: 2 }}
        >
          Create One!
        </Button>
      </Box>
    );
  } else if (filteredPosts.length === 0 && searchQuery !== '') {
    // State 2: Search active, no matching posts
    contentToRender = (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          No posts found matching your search: "{searchQuery}"
        </Typography>
      </Box>
    );
  } else if (filteredPosts.length > 0) {
    // State 3: Posts to display (either all or filtered)
    contentToRender = (
      <Grid container spacing={3}>
        {filteredPosts.map(post => (
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
    );
  } else {
    // This case handles posts.length > 0, filteredPosts.length === 0, and searchQuery === ''
    // This means all posts were filtered out by an empty search query, which shouldn't happen with the current title-only filter.
    // Or, it could mean there are posts, but none match an empty search (if the filter logic was different).
    // For the current setup, this implies an empty list of posts if search is empty, which is typically not desired unless there are other filters.
    // However, to prevent rendering nothing, we can show a generic "No posts available" or similar,
    // or even the "Create One" prompt if it makes sense in the context.
    // Given the current filter logic, if searchQuery is empty, filteredPosts should be equal to posts.
    // So this state should ideally not be reached if posts.length > 0.
    // If it is reached, it implies an unexpected state or a need to refine the filtering logic for empty queries further.
    // For robustness, let's assume it means "no posts match current criteria (which is an empty search)".
    // This might be the same as "No posts yet" if we interpret an empty search as showing everything.
    // Let's ensure that if posts.length > 0 and searchQuery is empty, filteredPosts is not empty.
    // The current filter `post.title.toLowerCase().includes('')` will always be true. So `filteredPosts` will be `posts`.
    // Thus, this `else` block should only be hit if `posts.length > 0` and `filteredPosts.length == 0` and `searchQuery == ''`.
    // This is an inconsistent state with the current filter.
    // For safety, we can show a generic message or nothing.
    // Let's re-evaluate the conditions. The provided prompt example has a simpler structure.
    // The primary conditions are:
    // 1. posts.length === 0  -> "No posts yet" (covers initial empty state)
    // 2. filteredPosts.length === 0 AND searchQuery !== '' -> "No results for query"
    // 3. filteredPosts.length > 0 -> Show posts (covers initial state with posts, and search results)
    // This structure is better. The initial `if (!posts || posts.length === 0)` in the original code was a guard for `posts` being undefined or empty.
    // We can simplify the rendering logic based on these three main states.
    // The `contentToRender` variable is a good approach.
    // If posts.length > 0, but filteredPosts.length === 0 AND searchQuery === '', it implies all posts were filtered out by an empty search,
    // which means the filter logic might be too aggressive or there's a misunderstanding.
    // With `String.prototype.includes('')` returning true, this state (`posts.length > 0 && filteredPosts.length === 0 && searchQuery === ''`)
    // should not occur. So, the three primary states are sufficient.
    contentToRender = null; // Or a fallback message if this state is somehow reachable
  }


  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
        Blog Posts
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          label="Search Posts"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '100%', maxWidth: '600px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {contentToRender}
    </Box>
  );
};

export default BlogPostList;
