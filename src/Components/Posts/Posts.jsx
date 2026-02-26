import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CardPost from '../Shared/CardPost/CardPost';
import Loading from '../Shared/Loadig/Loading';
import { BaseUrl } from '../../env/env.environment';
import { tokenContext } from '../../Context/tokenContext';

export default function Posts({ activeTab }) {
  const { userToken, userData } = useContext(tokenContext);
  const navigate = useNavigate();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', activeTab, userData?._id],
    queryFn: async () => {
      let endpoint = '';
      
      switch(activeTab) {
        case 'my-posts':
          endpoint = `${BaseUrl}/users/${userData?._id}/posts?limit=10`;
          break;
        case 'community':
          endpoint = `${BaseUrl}/posts?limit=10`;
          break;
        case 'saved':
          endpoint = `${BaseUrl}/users/bookmarks?limit=10`;
          break;
        default:
          endpoint = `${BaseUrl}/posts?limit=10`;
      }

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      return data.data?.posts || [];
    },
    enabled: !!userToken,
  });

  const goToPostDetails = (postId) => {
    navigate(`/postDetails/${postId}`);
  };

  if (isLoading) return <Loading />;

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No posts to display
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {posts.map((post) => (
        <div key={post._id} onClick={() => goToPostDetails(post._id)} className="cursor-pointer">
          <CardPost post={post} />
        </div>
      ))}
    </div>
  );
}