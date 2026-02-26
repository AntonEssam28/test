import axios from 'axios'
import React, { useContext } from 'react'
import { BaseUrl } from '../../../env/env.environment'
import { useQuery } from '@tanstack/react-query'
import { tokenContext } from '../../../Context/tokenContext'

export default function PostComments({post}) {
    let{userToken} = useContext(tokenContext)

    async function getPostComments(){
    let {data} = await axios.get(`${BaseUrl}/posts/${post?._id}/comments?page=1&limit=10`,{
            headers:{
                'Authorization': `Bearer ${userToken}`,
            }
        })
    return data.data.comments
    }

let {data,isLoading}  = useQuery({
    queryFn: getPostComments,
    queryKey: ['getCommments']
})

if(isLoading){
    return <p className='text-center text-sky-600'>Loading comments...</p>
}

  return (
    <div>
      { data.map((comment)=>{
    return <div key={comment._id} className="flex items-center space-x-2">
                  <img src={comment?.commentCreator?.photo.includes('undefined') ? PlaceHolder : comment?.commentCreator?.photo} alt="User Avatar" className="w-6 h-6 rounded-full" />

                  <div>
                    <p className="text-gray-800 font-semibold">{comment?.commentCreator?.name}</p>
                    <p className="text-gray-500 text-sm">{comment?.content}</p>
                  </div>

                </div>
  })}
 

    </div>
  )
}
