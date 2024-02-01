"use client";
import Question from "@/components/Question/Question";
import { useEffect, useState } from "react";
import { getAllPolls } from "@/utils/server/pollActions";
import { Schema } from "mongoose";

type Poll = {
    title: string;
    description: string;
};

export default function Home() {
    const [allPoll, setAllPoll] = useState<Poll[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pollActions = await getAllPolls();
                console.log(pollActions);

                if (pollActions.success) {
                    if (pollActions.polls) {
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-10">
            <Question />
        </div>
    );
}
