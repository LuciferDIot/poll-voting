"use client";
import Question from "@/components/Question/Question";
import { useEffect, useState } from "react";
import { getAllPolls } from "@/utils/server/pollActions";
import Link from "next/link";

type Poll = {
    title: string;
    description: string;
};

export default function Home() {
    const [allPoll, setAllPoll] = useState<Poll[] | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pollActions = await getAllPolls();
                console.log(pollActions);

                if (pollActions.success) {
                    if (pollActions.polls) {
                        console.log(pollActions.polls);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
        const userObj = localStorage.getItem("user");

        if (userObj) {
            const user_ID = JSON.parse(userObj)?._id;
            console.log(user_ID);

            setUserId(user_ID);
        }
    }, []);

    return (
        <div className="p-10 flex flex-col items-center">
            <Link
                href={`/${userId}/create`}
                className="p-4 bg-blue-900 rounded-lg mb-4 text-white"
            >
                Create A Post
            </Link>
            <Question />
        </div>
    );
}
