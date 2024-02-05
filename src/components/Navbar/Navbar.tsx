import React from "react";
import Link from "next/link";

type Props = {};

export default function Navbar({}: Props) {
    return (
        <div className="flex justify-around p-10 font-bold bg-blue-900 text-white sticky top-0 z-10">
            <Link href={"/"}>Home</Link>
            <Link href={"/login"}>Login</Link>
            <Link href={"/signup"}>SignUp</Link>
        </div>
    );
}
