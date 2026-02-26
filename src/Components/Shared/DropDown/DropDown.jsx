import React, { useContext } from 'react'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { BaseUrl } from '../../../env/env.environment';
import { tokenContext } from '../../../Context/tokenContext'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify'

export default function DropDown({postId}) {
  let {userToken} = useContext(tokenContext);

      async function deleteUserPosts(){
    let {data} = await axios.delete(`${BaseUrl}/posts/${postId}`,{
      headers:{
        'Authorization': `Bearer ${userToken}`
        }
    })
    return data;
  }

    const queryClient = useQueryClient(); 
let {mutate} = useMutation({
    mutationFn: deleteUserPosts,
    onSuccess:(data)=>{
        toast.success(data.message)
        queryClient.invalidateQueries({
            queryKey:['post']
        }),
        queryClient.invalidateQueries({
            queryKey:['profilePost']
        })  
    },
    onError:(error)=>{
        toast.error(data.message)
    }
})

  return (
    <>
       <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered"><BsThreeDotsVertical /></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new"><FaEdit />Update</DropdownItem>
        <DropdownItem key="copy" onClick={mutate}><MdDeleteSweep /> Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    </>
  )
}
