import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { supabase } from '../../lib/supabaseClient';

interface UserAvatarProps {
  userProfile?: Partial<UserProfile> | null;
  className?: string;
  fallbackText?: string;
  forceInitials?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userProfile, 
  className = "", 
  fallbackText = "?",
  forceInitials = false
}) => {
  const [authPhotoUrl, setAuthPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthPhoto = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.avatar_url) {
        setAuthPhotoUrl(session.user.user_metadata.avatar_url);
      }
    };
    fetchAuthPhoto();
  }, []);

  const profileAvatarUrl = userProfile?.avatar_url;

  // Priority 2: Auth Provider Photo URL
  const providerUrl = authPhotoUrl;

  const displayUrl = forceInitials ? null : (profileAvatarUrl || providerUrl);

  const getInitials = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.substring(0, 2).toUpperCase();
    }
    if (userProfile?.public_display_name) {
      return userProfile.public_display_name.substring(0, 2).toUpperCase();
    }
    if (userProfile?.email) {
      return userProfile.email.substring(0, 2).toUpperCase();
    }
    return fallbackText;
  };

  return (
    <Avatar className={`border-2 border-background shadow-sm ${className}`}>
      {displayUrl && <AvatarImage src={displayUrl} alt={userProfile?.full_name || 'User'} className="object-cover" />}
      <AvatarFallback className="bg-primary/10 text-primary font-bold">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
