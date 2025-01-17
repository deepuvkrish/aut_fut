import { db } from "@/lib/dbConfig";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";


export async function POST(req:Request){
    try{
        const body = await req.json();
        const{email, username, password} = body;


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

        return NextResponse.json({ user: newUser, message:"User Created sucessfully.!"}, {status:201});
    }catch(error){

    }
}