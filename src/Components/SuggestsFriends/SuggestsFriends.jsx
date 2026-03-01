import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../../Context/tokenContext';
import { BaseUrl } from '../../env/env.environment';
import Loading from '../../Components/Shared/Loadig/Loading';

export default function SuggestedFriends() {
  const { userToken } = useContext(tokenContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ================= FETCH SUGGESTIONS =================
  const {
    data: friends = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['suggestedFriends'],
    queryFn: async () => {
      const response = await axios.get(
        `${BaseUrl}/users/suggestions?limit=10`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("Suggestions Response:", response.data);

      return response.data.data?.suggestions || [];
    },
    enabled: !!userToken,
  });

  // ================= FOLLOW / UNFOLLOW =================
  const { mutate: toggleFollow, isPending } = useMutation({
    mutationFn: async (userId) => {
      await axios.put(
        `${BaseUrl}/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedFriends'] });
    },
  });

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <Loading />
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-red-500 text-sm">
          {error?.message || 'Something went wrong'}
        </p>
      </div>
    );
  }

  // ================= EMPTY STATE =================
  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold text-gray-800 mb-2">
          Suggested Friends
        </h3>
        <p className="text-sm text-gray-500 text-center">
          No suggestions available
        </p>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">
          Suggested Friends
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {friends.length}
        </span>
      </div>

      {/* Friends List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            {/* Avatar */}
            <div
              onClick={() => goToProfile(friend._id)}
              className="cursor-pointer flex-shrink-0"
            >
              <img
                src={
                  friend.photo ||
                  `https://ui-avatars.com/api/?name=${friend.name}`
                }
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4
                onClick={() => goToProfile(friend._id)}
                className="font-semibold text-sm cursor-pointer hover:underline truncate"
              >
                {friend.name}
              </h4>

              <p className="text-xs text-gray-500 truncate">
                @{friend.username}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {friend.followersCount || 0} followers
              </p>
            </div>

            {/* Follow Button */}
            <button
              disabled={isPending}
              onClick={() => toggleFollow(friend._id)}
              className="text-blue-600 hover:text-blue-800 flex-shrink-0 p-1 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
              title="Follow"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}