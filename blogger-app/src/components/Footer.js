import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // Padding top and bottom
        px: 2, // Padding left and right
        mt: 'auto', // Margin top auto to push to bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} My React Blog
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
