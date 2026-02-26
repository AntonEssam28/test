import React, { useContext, useRef, useState } from 'react'
import PlaceHolder from '../../../assets/images/img.png'
import { Link } from 'react-router-dom'
import PostComments from '../Postcomments/PostComments'
import { Button, Input } from '@heroui/react'
import { FiSend } from "react-icons/fi"
import { IoMdImages } from "react-icons/io"
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { tokenContext } from '../../../Context/tokenContext'
import { BaseUrl } from '../../../env/env.environment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function Comments({ post, details }) {

  const { userToken } = useContext(tokenContext)
  const [selectedImage, setSelectedImage] = useState(null)
  const inputFile = useRef()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: '',
    }
  })

  const queryClient = useQueryClient()

  // ================= SEND DATA =================
  async function sendData(formData) {
    if (!post?._id) {
      throw new Error("Post ID is missing")
    }

    const { data } = await axios.post(
      `${BaseUrl}/posts/${post._id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      }
    )

    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendData,
    onSuccess: (data) => {
      reset()
      setSelectedImage(null)
      toast.success(data?.message || "Comment added successfully")

      queryClient.invalidateQueries({ queryKey: ['getCommments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.log(error)
      toast.error(error?.response?.data?.message || "Error adding comment")
    }
  })

  // ================= CREATE COMMENT =================
  function createPostComment(data) {
    if (!data.content && !selectedImage) {
      toast.error("Comment cannot be empty")
      return
    }

    const formData = new FormData()
    formData.append('content', data.content)

    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    mutate(formData)
  }

  function getImageFile(e) {
    setSelectedImage(e.target.files[0])
  }

  return (
    <>
      {/* Comments Count */}
      <div className="flex items-center justify-end text-gray-500">
        <button className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
          <span>{post?.commentsCount}</span>
        </button>
      </div>

      <hr className="mt-2 mb-2" />

      {/* Header */}
      <div className='flex justify-between w-full'>
        <p className="text-gray-800 font-semibold">Comment</p>
        {!details && (
          <Link to={`postDetails/${post?._id}`}>
            <p className="text-sky-700">View Details...</p>
          </Link>
        )}
      </div>

      <hr className="mt-2 mb-2" />

      {/* Form */}
      <form onSubmit={handleSubmit(createPostComment)}>
        <div className='flex items-center gap-2'>

          <Input
            type="text"
            placeholder="Enter your comment"
            {...register("content")}
          />

          <IoMdImages
            size={25}
            className='text-sky-700 cursor-pointer'
            onClick={() => inputFile.current.click()}
          />

          <input
            onChange={getImageFile}
            ref={inputFile}
            type="file"
            hidden
          />

          <Button
            type='submit'
            isLoading={isPending}
            className='bg-transparent p-0 m-0'
          >
            <FiSend size={25} className='text-sky-700' />
          </Button>

        </div>
      </form>

      {/* Show Top Comment */}
      <div className="mt-4">

        {!details && post?.commentsCount > 0 ? (
          <div className="flex items-center space-x-2">
            <img
              src={
                post?.topComment?.commentCreator?.photo?.includes('undefined')
                  ? PlaceHolder
                  : post?.topComment?.commentCreator?.photo
              }
              alt="User Avatar"
              className="w-6 h-6 rounded-full"
            />

            <div>
              <p className="text-gray-800 font-semibold">
                {post?.topComment?.commentCreator?.name}
              </p>
              <p className="text-gray-500 text-sm">
                {post?.topComment?.content}
              </p>
            </div>
          </div>
        ) : (
          !details && <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {details && <PostComments post={post} />}

      </div>
    </>
  )
}
