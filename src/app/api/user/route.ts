import { db } from "@/lib/dbConfig";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';


// Define a schema for input validation

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })



export async function POST(req:Request){
    try{
        const body = await req.json();
        const{email, username, password} = userSchema.parse(body);


        //Check existing emails:-
        const existingUserByEmail = await db.user.findUnique({
            where: {email: email}
        });
        if(existingUserByEmail){
            return NextResponse.json({user:null, message:"User email already exists!"},{status:409})
        }

        //Check Existing Users by Username:-
        const existingUserByUsername = await db.user.findUnique({
            where:{username:username}
        });
        if(existingUserByUsername){
            return NextResponse.json({user:null, message:"Username not available!"},{status:409})   
        }


        const hashedPassWord = await hash(password, 10)
        const newUser = await db.user.create({
            data:{
                username,
                email,
                password:hashedPassWord
            }
        })

        const {password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({ user: rest, message:"User Created sucessfully.!" }, { status:201 });
    }catch(error){
        return NextResponse.json({ message:"OOPS...Something went wrong.!" }, { status: 500 })
    }
}