import React, { useContext } from 'react'
import PlaceHolder from '../../../assets/images/img.png'; 
import DropDown from '../DropDown/DropDown';
import {tokenContext} from '../../../Context/TokenContext';



export default function HeaderCard({post}) {
  let{userData} = useContext(tokenContext); 

  return (
    <>
        <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <img src={post?.user?.photo} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-gray-800 font-semibold">{post?.user?.name}</p>
                    <p className="text-gray-500 text-sm">{post?.createdAt?.split("T")[0]}</p>
                  </div>
                </div>
                <div className="text-gray-500 cursor-pointer">
                  {userData?._id === post?.user?._id && (<DropDown postId={post._id}/>)}
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <p>{post?.body}</p>
              </div>

              {/* Image */}
              <div className="mb-4">
                <img src={post?.image ? post?.image : PlaceHolder} alt="Post Image" className="w-full h-75 object-cover rounded-md" />
              </div>
    </>
  )
}
