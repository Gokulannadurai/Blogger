import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Header = () => {
  return (
    <AppBar position="static" sx={{ marginBottom: '2rem' }}> {/* Added marginBottom for spacing below header */}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/" sx={{ textTransform: 'none', fontSize: '1.25rem' }}>
            My React Blog
          </Button>
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/create">
            Create Post
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
