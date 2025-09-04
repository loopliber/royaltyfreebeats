
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Purchase } from '@/api/entities';
import { BeatLike } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Heart, Music, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateLicensePDF } from '@/api/functions';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [likedBeats, setLikedBeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userPurchases = await Purchase.filter({ user_id: currentUser.id }, '-created_date');
      setPurchases(userPurchases);

      const userLikes = await BeatLike.filter({ user_id: currentUser.id }, '-created_date');
      setLikedBeats(userLikes);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLicense = async (purchase) => {
    try {
      const { data } = await generateLicensePDF({
        beatTitle: purchase.beat_title,
        licenseType: purchase.license_type,
        amount: purchase.amount_paid,
        purchaseDate: purchase.created_date
      });

      // Create and download the license file
      const blob = new Blob([data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${purchase.beat_title}-license.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error downloading license:', error);
      alert('Error downloading license. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              You need to be logged in to view your profile.
            </p>
            <Button onClick={() => User.login()} className="bg-[var(--primary)] hover:bg-blue-600">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-[var(--text-primary)]">
                    {user.full_name || 'Music Lover'}
                  </CardTitle>
                  <p className="text-[var(--text-secondary)]">{user.email}</p>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="outline">{purchases.length} Purchases</Badge>
                    <Badge variant="outline">{likedBeats.length} Liked Beats</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="purchases" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                My Purchases
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Liked Beats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="purchases">
              {purchases.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                    <p className="text-[var(--text-secondary)]">
                      Start building your beat collection today!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Music className="w-8 h-8 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[var(--text-primary)]">
                                {purchase.beat_title}
                              </h4>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {purchase.license_type.charAt(0).toUpperCase() + purchase.license_type.slice(1)} License
                              </p>
                              <p className="text-sm text-[var(--text-secondary)]">
                                ${purchase.amount_paid} • {new Date(purchase.created_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadLicense(purchase)}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              License
                            </Button>
                            <Button size="sm" className="bg-[var(--primary)] hover:bg-blue-600">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes">
              {likedBeats.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No liked beats yet</h3>
                    <p className="text-[var(--text-secondary)]">
                      Like beats you love to save them here!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {likedBeats.map((like) => (
                    <Card key={like.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Music className="w-8 h-8 text-gray-500" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-[var(--text-primary)]">
                              {like.beat_title}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Liked on {new Date(like.created_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Heart className="w-6 h-6 text-red-500 fill-current" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
