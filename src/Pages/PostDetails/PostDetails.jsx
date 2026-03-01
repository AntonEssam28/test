import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CardPost from '../../Components/Shared/CardPost/CardPost';
import Loading from '../../Components/Shared/Loadig/Loading';
import { useQuery } from '@tanstack/react-query';
import { tokenContext } from '../../Context/tokenContext';
import { BaseUrl } from '../../env/env.environment';


export default function PostDetails() {
    let { userToken } = useContext(tokenContext);
    let[postDetails,setDetails] = useState({});
    let {postId} = useParams()


    async function getSinglePost(){
      let{data} = await  axios.get(`${BaseUrl}/posts/${postId}`,{
            headers:{
                'Authorization': `Bearer ${userToken}`,
            }
        })
        return data.data
    }

let { data, isLoading, isError, isFetching } = useQuery({
    queryFn: getSinglePost,

    queryKey: ['singlepost', postId],
    select: (data) => data?.post
})

 


    if(isLoading){
        return <Loading/>
    }

    if(isError){
        return <p className='text-red-500 text-center'>There is an error please try again late</p>
    }

  return (
    <>
    <CardPost isDetails={true} post={data}/>
      
    </>
  )
}
