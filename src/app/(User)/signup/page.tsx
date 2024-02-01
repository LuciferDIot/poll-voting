"use client";
import React, { FormEvent, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signup } from "@/utils/server/userActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {};

export default function Page({}: Props) {
    const [clicked, setClicked] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        toast.error("Hello coders it was easy!");
    }, []);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(event.currentTarget);
            const res = await signup({ formData });

            if (res.success) {
                toast.success(res.message);
                router.push("/", { scroll: false });
                localStorage.setItem("user", JSON.stringify(res.user));
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else toast.error("Something went wrong");
        }
    };

    return (
        <Suspense fallback={<div>Loading . . .</div>}>
            <div className="flex w-screen h-screen justify-center items-center">
                <div className="w-[500px] border-4 border-blue-900 rounded-lg p-10">
                    <form
                        onSubmit={onSubmit}
                        className="p-4 child:flex child:flex-col child:w-100 child:py-4 child-input:rounded-md child-input:border-blue-300 child-input:border-2 child-input:p-2 child-input:w-full child-label:font-bold chil"
                    >
                        <div>
                            <label htmlFor="username">UserName:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <div className="relative w-full h-fit">
                                <input
                                    type={clicked ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    required
                                />
                                <Image
                                    className="absolute top-0 right-0 w-fit h-full p-2"
                                    src={
                                        clicked
                                            ? "/show-svgrepo-com.svg"
                                            : "/hide-svgrepo-com.svg"
                                    }
                                    alt={"hide show"}
                                    width={100}
                                    height={100}
                                    onClick={() => setClicked(!clicked)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center text-white bg-blue-900 rounded-lg p-2"
                        >
                            Submit
                        </button>
                    </form>

                    <div className="p-4">
                        <div className="flex justify-between">
                            Already have a account{" "}
                            <Link href={"/login"} className="text-blue-300">
                                Login here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
