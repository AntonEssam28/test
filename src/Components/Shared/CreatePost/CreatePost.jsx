import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Button} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { tokenContext } from '../../../Context/tokenContext'
import { IoMdImages } from "react-icons/io";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BaseUrl } from "../../../env/env.environment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { set } from "zod";


export default function CreatePost() {
    let{userData,userToken} = useContext(tokenContext);
    let inputFile = useRef();
    let [selectedFile,setSelectedFile] = useState(null)
    let [imgSrc,setSrc] = useState(null)

    let {register, handleSubmit,reset} = useForm({
        defaultValues:{
            body:'',
            
        }
    })

function submitForm(data){
    console.log(data)
    const fd = new FormData();
    fd.append('body', data.body);
    fd.append('image', selectedFile);
    mutate(fd)

}

function getImageFile(e){
    setSrc(URL.createObjectURL(e.target.files[0]))
    setSelectedFile(e.target.files[0])
}

async function creeateUserPost(formData){
    let {data} = await axios.post(`${BaseUrl}/posts`,formData,{
        headers:{
            Authorization: `Bearer ${userToken}`,
        }
    })
    return data;
}  

let queryClient = useQueryClient()

let {mutate} = useMutation({
    mutationFn: creeateUserPost,
    onSuccess: (data)=>{
        toast.success(data.message)
        reset(),
        setSrc(null),
        queryClient.invalidateQueries({
            queryKey:['post']
        }),
        queryClient.invalidateQueries({
            queryKey:['profilePost']
        })
    },

    onError: ()=>{}
})

return (
    <Card className=" mx-auto md:w-[60%] max-w-130">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src={userData?.photo}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{userData?.name}</p>
          <p className="text-small text-default-500">Create a post</p>
        </div>
      </CardHeader>
      <Divider />
      <form onSubmit={handleSubmit(submitForm)}>
         <CardBody>
        <Input {...register('body')} type="text" placeholder="What's on your mind?"/>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex justify-end w-full items-center">
            {imgSrc && <img src={imgSrc} width='100' alt="Preview" />}
            <IoMdImages size={30} className="text-sky-700 mx-2"  onClick={()=>inputFile.current.click()}/>
            <input type="file" hidden onChange={getImageFile} ref={inputFile} />
            <Button type="submit" color="primary">Create a post</Button>
        </div>
        
      </CardFooter>
      </form>
     
    </Card>
  );
}
