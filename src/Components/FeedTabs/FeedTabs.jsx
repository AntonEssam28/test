import React from 'react';

export default function FeedTabs({ activeTab, setActiveTab, userName, userPhoto }) {
  const tabs = [
    { id: 'my-posts', label: 'My Posts', icon: '📝' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'saved', label: 'Saved', icon: '🔖' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 font-medium text-sm flex items-center gap-2 transition-colors relative
              ${activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <img
            src={userPhoto || 'https://via.placeholder.com/40'}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm">{userName || 'Anton'}</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Public
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}