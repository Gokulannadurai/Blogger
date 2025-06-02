import React from 'react';
import { Routes, Route } from 'react-router-dom';
// BlogProvider and Router are now in index.js, wrapping App
import Header from './components/Header';
import Footer from './components/Footer';
import Container from '@mui/material/Container'; // Import Container
import BlogPostList from './components/BlogPostList';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  return (
    // The className="App" div is still useful for the overall flex structure from App.css
    <div className="App">
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}> {/* py for padding top/bottom */}
        <Routes>
          <Route path="/" element={<BlogPostList />} />
          <Route path="/post/:postId" element={<BlogPost />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:postId" element={<CreatePost />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
