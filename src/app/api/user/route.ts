import { db } from "@/lib/dbConfig";
import { NextResponse } from "next/server";

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

        return NextResponse.json(body)
    }catch(error){

    }
}