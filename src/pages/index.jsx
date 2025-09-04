import Layout from "./Layout.jsx";

import Browse from "./Browse";

import Genre from "./Genre";

import upload from "./upload";

import Success from "./Success";

import Profile from "./Profile";

import Support from "./Support";

import trap from "./trap";

import hip-hop from "./hip-hop";

import drill from "./drill";

import rnb from "./rnb";

import pop from "./pop";

import boom-bap from "./boom-bap";

import blog from "./blog";

import blog-post from "./blog-post";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Browse: Browse,
    
    Genre: Genre,
    
    upload: upload,
    
    Success: Success,
    
    Profile: Profile,
    
    Support: Support,
    
    trap: trap,
    
    hip-hop: hip-hop,
    
    drill: drill,
    
    rnb: rnb,
    
    pop: pop,
    
    boom-bap: boom-bap,
    
    blog: blog,
    
    blog-post: blog-post,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Browse />} />
                
                
                <Route path="/Browse" element={<Browse />} />
                
                <Route path="/Genre" element={<Genre />} />
                
                <Route path="/upload" element={<upload />} />
                
                <Route path="/Success" element={<Success />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/trap" element={<trap />} />
                
                <Route path="/hip-hop" element={<hip-hop />} />
                
                <Route path="/drill" element={<drill />} />
                
                <Route path="/rnb" element={<rnb />} />
                
                <Route path="/pop" element={<pop />} />
                
                <Route path="/boom-bap" element={<boom-bap />} />
                
                <Route path="/blog" element={<blog />} />
                
                <Route path="/blog-post" element={<blog-post />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}