import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HandMetal } from "lucide-react";

const Navbar = () => {
  return (
    <div className=" bg-sky-500 py-2  fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between ">
        <Link href="/">
          <HandMetal />
        </Link>
        <Link className={buttonVariants()} href="/sign-in">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
