import React, { useContext, useState } from 'react';
import { useNetworkState } from 'react-use';
import { tokenContext } from '../../Context/tokenContext';
import SuggestedFriends from '../../Components/SuggestsFriends/SuggestsFriends';
import CreatePost from '../../Components/Shared/CreatePost/CreatePost';
import Posts from '../../Components/Posts/Posts';
import FeedTabs from '../../Components/FeedTabs/FeedTabs';


export default function Home() {
  const { online } = useNetworkState();
  const { userData } = useContext(tokenContext);
  const [activeTab, setActiveTab] = useState('community'); 

  if (!online) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className='text-center text-4xl text-red-500'>
          You are offline now
        </h1>
      </div>
    );
  }

  return (
    <>
      
        <title>Home</title>
      

      <div className="bg-gray-100 min-h-screen py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            <div className="lg:col-span-3">
              <FeedTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userName={userData?.name}
                userPhoto={userData?.photo}
              />
              
              
                <CreatePost/>
                
              
              
              <Posts activeTab={activeTab} />
            </div>

            <div className="lg:col-span-1">
              <SuggestedFriends />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}