"use client";

import Image from "next/image";

interface Props {}

const Question = (props: Props) => {
    return (
        <div className="bg-gray-200 rounded-md p-4 text-left border-blue-300 border-2">
            <div>
                <div className="title font-bold py-2">
                    Who will win mens T20 world cup
                </div>
                <div className="img bg-cover">
                    <Image
                        src={"/T20.webp"}
                        width={"400"}
                        height={"300"}
                        alt={""}
                        className="w-full h-full"
                    />
                </div>
            </div>
            <div className="answers flex flex-col flex-shrink-0 text-sm child:py-1 child:m-1 child:text-center child:rounded-md child:border-blue-300 child:border-2 text-blue-400 hover:child:bg-blue-200 hover:child:cursor-pointer">
                <div>Pakistan</div>
                <div>Australia</div>
                <div>England</div>
                <div>India</div>
                <div>South Africa</div>
                <div>New Zealand</div>
            </div>
        </div>
    );
};

export default Question;
