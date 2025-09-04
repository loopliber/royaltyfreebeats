import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Beat Making Blog | Free Beats & Music Production Tips | RoyaltyFreeBeats.io";
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await BlogPost.filter({ published: true }, '-created_date');
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading blog posts...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-6">
            Beat Making Blog
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Learn music production, beat making tips, and how to use royalty free beats for your projects. 
            Get insights from industry professionals and discover the latest trends in hip hop, trap, and instrumental music.
          </p>
        </motion.div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-secondary)] text-lg">No blog posts found. Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[var(--border)]"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={post.featured_image || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} min read</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Link to={createPageUrl(`blog-post?slug=${post.slug}`)}>
                    <Button variant="ghost" className="w-full justify-between group hover:bg-blue-50 hover:text-[var(--primary)]">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* SEO Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl p-8 border border-[var(--border)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-6">
            Music Production & Beat Making Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-[var(--text-secondary)] leading-relaxed">
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Learn Beat Making</h3>
              <p>Discover tutorials, tips, and techniques for creating professional beats and instrumentals.</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Industry Insights</h3>
              <p>Stay updated with the latest trends in hip hop, trap, drill, and other popular music genres.</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Licensing & Copyright</h3>
              <p>Understanding music licensing, royalty free beats, and how to protect your musical creations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}