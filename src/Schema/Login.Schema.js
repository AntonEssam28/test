import * as z from "zod"; 

export const loginSchema = z.object({
    email:z.string().nonempty("Email is required").email("Enter a valid email"),
    password:z.string().nonempty("Password is required").regex(/^.{8,}/,'Enter a valid password'), 
})