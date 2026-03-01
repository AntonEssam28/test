import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { tokenContext } from '../../Context/tokenContext';
import Loading from '../../Components/Shared/Loadig/Loading';
import CardPost from '../../Components/Shared/CardPost/CardPost';
import CreatePost from '../../Components/Shared/CreatePost/CreatePost';
import { BaseUrl } from '../../env/env.environment';

export default function Profile() {
  const { userData, userToken, setUserData } = useContext(tokenContext);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('posts'); 

  // ================== Get User Posts ==================
  const getUserPosts = async () => {
    if (!userData?._id || !userToken) {
      throw new Error('Missing user ID or token');
    }

    const { data } = await axios.get(
      `${BaseUrl}/users/${userData._id}/posts?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return data.data;
  };

  const {
    data: posts = [],
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ['profilePost', userData?._id],
    queryFn: getUserPosts,
    select: (res) => res?.posts || [],
    enabled: !!userData?._id && !!userToken,
    staleTime: 5 * 60 * 1000,
  });

  // ================== Get User Stats ==================
  const getUserStats = async () => {
    if (!userData?._id || !userToken) return null;
    
    try {

      const { data } = await axios.get(
        `${BaseUrl}/users/${userData._id}/stats`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      
      return { 
        followers: 0, 
        following: 0, 
        bookmarks: 0 
      };
    }
  };

  const { data: stats } = useQuery({
    queryKey: ['userStats', userData?._id],
    queryFn: getUserStats,
    initialData: { followers: 0, following: 0, bookmarks: 0 },
    enabled: !!userData?._id && !!userToken,
  });

  // ================== Get Saved Posts ==================
  const getSavedPosts = async () => {
    if (!userData?._id || !userToken) return [];

    try {
      const { data } = await axios.get(
        `${BaseUrl}/users/${userData._id}/saved-posts`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return data.data?.posts || [];
    } catch (error) {
      return [];
    }
  };

  const { data: savedPosts = [] } = useQuery({
    queryKey: ['savedPosts', userData?._id],
    queryFn: getSavedPosts,
    enabled: activeTab === 'saved' && !!userData?._id && !!userToken,
  });

  // ================== Upload Profile Photo ==================
  const {
    mutate: uploadProfilePhoto,
    isLoading: isUploadingPhoto,
  } = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('photo', file);

      const { data } = await axios.put(
        `${BaseUrl}/users/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      return data;
    },

    onSuccess: (data) => {
      const updatedUser = data?.data?.user || data?.user || data;

      if (updatedUser) {
        setUserData((prev) => ({ ...prev, ...updatedUser }));
    
        queryClient.invalidateQueries(['userStats']);
      }

      toast.success(data?.message || 'Profile picture updated successfully');
    },

    onError: (err) => {
      console.log('Upload error:', err);
      toast.error(err?.response?.data?.message || 'Error Uploading Photo');
    },
  });

  // ================== Upload Cover Photo ==================
  const {
    mutate: uploadCoverPhoto,
    isLoading: isUploadingCover,
  } = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('cover', file);

      const { data } = await axios.put(
        `${BaseUrl}/users/upload-cover`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      return data;
    },

    onSuccess: (data) => {
      const updatedUser = data?.data?.user || data?.user || data;

      if (updatedUser) {
        setUserData((prev) => ({ ...prev, ...updatedUser }));
      }

      toast.success(data?.message || 'Cover picture updated successfully');
    },

    onError: (err) => {
      console.log('Upload error:', err);
      toast.error(err?.response?.data?.message || 'Error Uploading Cover');
    },
  });

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    uploadProfilePhoto(file);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover image size should be less than 5MB');
      return;
    }
    
    uploadCoverPhoto(file);
  };

  // ================== UI States ==================
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  if (isPostsLoading) {
    return <Loading />;
  }

  if (isPostsError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <p className="text-xl text-red-600 mb-4">Something went wrong</p>
        <p className="text-gray-700">
          {postsError?.message || 'Failed to load profile data'}
        </p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ================== Main Render ==================
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <img
              src={userData.cover || "https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"}
              className="w-full h-48 object-cover"
              alt="cover"
            />
            
            
            <label className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-md hover:bg-gray-50 cursor-pointer">
              {isUploadingCover ? 'Uploading...' : 'Add cover'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoChange}
                disabled={isUploadingCover}
              />
            </label>
          </div>

          
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              
              <div className="relative">
                <img
                  src={userData.photo || 'https://via.placeholder.com/150'}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  alt={userData.name}
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600">
                  {isUploadingPhoto ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>

              
              <h2 className="mt-4 text-xl font-bold">{userData.name}</h2>
              
              <div className="flex justify-center gap-12 mt-4">
                <div className="text-center">
                  <div className="font-bold text-xl">{stats?.followers || 0}</div>
                  <div className="text-gray-500 text-sm">FOLLOWERS</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{stats?.following || 0}</div>
                  <div className="text-gray-500 text-sm">FOLLOWING</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{stats?.bookmarks || 0}</div>
                  <div className="text-gray-500 text-sm">BOOKMARKS</div>
                </div>
              </div>

              
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Route Posts member
                </span>
              </div>

              
              <div className="flex justify-center gap-6 mt-4">
                <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100">
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`px-4 py-2 ${
                    activeTab === 'posts' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  MY POSTS
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 ${
                    activeTab === 'saved' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  SAVED POSTS
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          <div className="lg:col-span-1 space-y-6">
          
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {userData.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{userData.email}</p>
                    <p className="text-xs text-gray-500">Active on Route Posts</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  1
                </span>
              </div>
            </div>

            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">SAVED POSTS</span>
                <span className="text-gray-500">{savedPosts.length || 0}</span>
              </div>
            </div>

            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 py-2 text-center ${
                    activeTab === 'posts' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  MyPosts
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 py-2 text-center ${
                    activeTab === 'saved' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'posts' && <CreatePost />}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-4">
                {activeTab === 'posts' ? 'Your Posts' : 'Saved Posts'}
              </h3>
              
              {activeTab === 'posts' ? (
                posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <CardPost key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No posts yet
                  </p>
                )
              ) : (
                
                savedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <CardPost key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No saved posts yet
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}