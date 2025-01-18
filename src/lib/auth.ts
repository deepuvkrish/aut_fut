import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./dbConfig";
import { compare } from "bcrypt";

export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(db),
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn: '/sign-in'
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "johndoa@email.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                return null;
            }

            // Validate the type of the email
            if (typeof credentials.email !== 'string') {
                return null;
            }


            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email } 
            });

            if(!existingUser){
                return null;
            }
            const passwordMatch = await compare(`${credentials.password}`, existingUser.password);

 
            if(!passwordMatch){
                return null;
            }


            return{
                id:`${existingUser.id}`,
                username:existingUser.username,
                email:existingUser.email
            }
          }
        })
      ]
}