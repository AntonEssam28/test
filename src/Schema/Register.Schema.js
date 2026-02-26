import * as z from "zod"; 

export const registerSchema = z.object({
    name:z.string().nonempty("Name is required").min(3,"name must be at least 3 charcters").max(10, "Name must be max 10 characters"),
    email:z.string().nonempty("Email is required").email("Enter a valid email"),
    password:z.string().nonempty("Password is required").regex(/^.{8,}/,'Enter a valid password'),
    rePassword:z.string().nonempty("Confirm Password is required"),
    dateOfBirth:z.string().nonempty("Date of Birth is required").refine((date)=>{
        let currentDate = new Date().getFullYear();
        let selectedYear = new Date(date).getFullYear();
        let age = currentDate - selectedYear;
        return age >= 18 ;
    },"Age not allowed less than 18 years old"),
    gender:z.enum(['female','male'],'Choose Male or Female....')
}).refine((data)=>data.password === data.rePassword,{
    messgae:"password not matched",
    path:["rePassword"]
})