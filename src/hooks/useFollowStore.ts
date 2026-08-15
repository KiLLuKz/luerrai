import { useState, useEffect } from 'react';

const FOLLOWED_STORES_KEY = 'followed_stores';

export function useFollowStore() {
  const [followedStores, setFollowedStores] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(FOLLOWED_STORES_KEY);
    if (saved) {
      try {
        setFollowedStores(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse followed stores from local storage');
      }
    }
  }, []);

  const toggleFollow = (storeId: number) => {
    setFollowedStores(prev => {
      let newFollowed: number[];
      if (prev.includes(storeId)) {
        newFollowed = prev.filter(id => id !== storeId);
      } else {
        newFollowed = [...prev, storeId];
      }
      localStorage.setItem(FOLLOWED_STORES_KEY, JSON.stringify(newFollowed));
      return newFollowed;
    });
  };

  const isFollowed = (storeId: number) => followedStores.includes(storeId);

  return { followedStores, toggleFollow, isFollowed };
}
