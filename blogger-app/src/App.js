import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './contexts/BlogContext'; // Import BlogProvider
import Header from './components/Header';
import Footer from './components/Footer';
import BlogPostList from './components/BlogPostList';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  return (
    <BlogProvider> {/* Wrap Router (or its contents) with BlogProvider */}
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<BlogPostList />} />
              <Route path="/post/:postId" element={<BlogPost />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/edit/:postId" element={<CreatePost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App;
