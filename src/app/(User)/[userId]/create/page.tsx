"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPoll, getAllCategories } from "@/utils/server/pollActions";

interface Props {}
type Category = { _id: string; name: string };

export const Page = (props: Props) => {
    const [inputCounts, setInputCounts] = useState(1);
    const [inputFields, setInputFields] = useState([{ id: inputCounts }]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [allCategories, setAllCategories] = useState<Category[] | null>(null);
    const router = useRouter();

    const addInputField = () => {
        setInputCounts(inputCounts + 1);
        setInputFields([...inputFields, { id: inputCounts }]);
    };

    const removeInputField = (id: number) => {
        if (inputFields.length > 1) {
            const updatedInputFields = inputFields.filter(
                (field) => field.id !== id
            );
            setInputFields(updatedInputFields);
        }
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(event.currentTarget);
            const userObj = localStorage.getItem("user");
            if (userObj) {
                const user_ID = JSON.parse(userObj)?._id;

                const res = await createPoll({
                    formData,
                    count: inputCounts,
                    user_id: user_ID,
                });
                toast.success(res.message);
            } else {
                toast.error("Please sign In first");
                router.push("/login", { scroll: false });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await getAllCategories();
                if (categories.success && categories.categories != null) {
                    const categoriesArray: Category[] = Object.entries(
                        categories.categories
                    ).map(([key, value]) => ({ _id: key, name: value }));
                    setAllCategories(categoriesArray);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();

        const userObj = localStorage.getItem("user");
        if (!userObj) {
            toast.error("Please sign In first");
            router.push("/login", { scroll: false });
        }
    }, [router]);

    return (
        <div className="w-screen h-screen flex justify-center items-center overflow-y-scroll pt-16">
            <form
                onSubmit={onSubmit}
                className="bg-gray-200 rounded-md p-10 text-left border-blue-300 border-2"
            >
                <div className="p-4 flex flex-col child:w-100 child:py-4 child-input:rounded-md child-input:border-blue-300 child-input:border-2 child-input:p-2 child-input:w-full child-label:font-bold chil">
                    <div className="flex w-full flex-row justify-between">
                        <label className="text-xl" htmlFor="title">
                            Title
                        </label>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-10 py-2 rounded-md"
                        >
                            Submit
                        </button>
                    </div>
                    <input type="text" name="title" id="title" />
                </div>

                <div className="p-4 child:flex child:flex-col child:w-100 child:py-4 child-input:rounded-md child-input:border-blue-300 child-input:border-2 child-input:p-2 child-input:w-full child-label:font-bold chil">
                    <label className="text-xl" htmlFor="description">
                        Description
                    </label>
                    <input type="text" name="description" id="description" />
                </div>

                {allCategories && (
                    <div className="p-4 child:flex child:flex-col child:w-100 child:py-4 child-input:rounded-md child-input:border-blue-300 child-input:border-2 child-input:p-2 child-input:w-full child-label:font-bold chil">
                        <label className="text-xl" htmlFor="category_id">
                            Category
                        </label>
                        <select
                            name="category_id"
                            id="category_id"
                            className="p-4 flex flex-col w-full py-4 rounded-md border-blue-300 child-input:border-2 "
                        >
                            {allCategories.map(
                                (category: { _id: string; name: string }) => (
                                    <option
                                        key={category._id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                <div className="p-4 flex flex-col items-center child-input:rounded-md child-input:border-blue-300 child-input:border-2 child-input:p-2 child-input:w-full child-label:font-bold chil">
                    <label className="text-xl w-full text-left">Answers</label>
                    {inputFields.map((inputField, index) => (
                        <div
                            key={inputField.id}
                            className="flex flex-row py-2 gap-4 justify-between w-full"
                        >
                            <input
                                className="w-full"
                                type="text"
                                name={`answer_${inputField.id}`}
                                id={`answer_${inputField.id}`}
                            />

                            <button
                                className="bg-red-500 text-white px-10 py-2 rounded-md"
                                onClick={() => removeInputField(inputField.id)}
                                type="button"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addInputField}
                        className="bg-blue-500 text-white px-10 py-2 mt-4 rounded-md"
                    >
                        Add Answer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
