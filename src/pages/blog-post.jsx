import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (slug) {
      loadPost(slug);
      loadRelatedPosts();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, []);

  const loadPost = async (slug) => {
    try {
      const posts = await BlogPost.filter({ slug: slug, published: true });
      if (posts.length > 0) {
        const foundPost = posts[0];
        setPost(foundPost);
        
        // Update page title and meta description
        document.title = foundPost.meta_title || `${foundPost.title} | RoyaltyFreeBeats.io Blog`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', foundPost.meta_description || foundPost.excerpt);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
    }
    setLoading(false);
  };

  const loadRelatedPosts = async () => {
    try {
      const posts = await BlogPost.filter({ published: true }, '-created_date', 3);
      setRelatedPosts(posts);
    } catch (error) {
      console.error('Error loading related posts:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading post...</p>
      </div>
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Post Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-6">The blog post you're looking for doesn't exist.</p>
        <Link to={createPageUrl("blog")}>
          <Button>← Back to Blog</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to={createPageUrl("blog")} className="inline-flex items-center text-[var(--primary)] hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time} min read</span>
                </div>
              </div>
              
              <Button onClick={handleShare} variant="outline" size="sm" className="self-start sm:self-auto">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag className="w-4 h-4 text-[var(--text-secondary)] mt-1" />
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              className="text-[var(--text-primary)] leading-relaxed"
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold text-[var(--text-primary)] mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold text-[var(--text-primary)] mt-5 mb-2">{children}</h3>,
                p: ({children}) => <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="text-[var(--text-primary)] mb-4 ml-6 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="text-[var(--text-primary)] mb-4 ml-6 space-y-2">{children}</ol>,
                li: ({children}) => <li className="list-disc">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-[var(--primary)] pl-4 italic text-[var(--text-secondary)] my-6">{children}</blockquote>,
                code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                a: ({children, href}) => <a href={href} className="text-[var(--primary)] hover:underline">{children}</a>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map(relatedPost => (
              <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[var(--border)]">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={relatedPost.featured_image || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop`}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <Link to={createPageUrl(`blog-post?slug=${relatedPost.slug}`)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}