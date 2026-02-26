import React from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import Comments from "../Comments/Comments";


export default function CardPost({ post,isDetails }) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-gray-100 h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-lg">

            
              <HeaderCard post={post} />
            

            
            <Comments post={post} details={isDetails}/>
          </div>
        </div>
      </div>
    </>
  );
}
