import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { getCheckoutSession } from '@/api/functions';

export default function Success() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Fetch session details from Stripe
      getCheckoutSession({ session_id: sessionId })
        .then(({ data }) => {
          setSession(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching session:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[var(--surface)] border-[var(--border)]">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-[var(--text-primary)]">Payment Successful!</CardTitle>
              <p className="text-[var(--text-secondary)]">
                Thank you for your purchase. Your beats are ready for download.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {session?.line_items?.data?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-[var(--primary)]" />
                    <div>
                      <h4 className="font-medium text-[var(--text-primary)]">
                        {item.description}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {item.amount_total === 0 ? 'FREE (2-for-1 Deal Applied)' : `$${(item.amount_total / 100).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[var(--primary)] hover:bg-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
              
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-[var(--text-primary)]">Total Paid:</span>
                  <span className="text-xl font-bold text-[var(--primary)]">
                    ${session ? (session.amount_total / 100).toFixed(2) : '0.00'}
                  </span>
                </div>
                
                <Link to={createPageUrl('Browse')}>
                  <Button className="w-full bg-[var(--primary)] hover:bg-blue-600">
                    Browse More Beats
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}