"use server";
import { Poll } from "../models/pollModel";
import { Option } from "../models/optionModel";
import { Category } from "../models/categoryModel";
import { Vote } from "../models/voteModel";
import { connectToDataBase } from "../database";
import { getUserById } from "./userActions";
import { Schema } from "mongoose";

// import multer from 'multer';
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

export async function createPoll({
    formData,
    count,
    user_id,
}: {
    formData: FormData;
    count: number;
    user_id: number;
}) {
    const title: string | null = formData.get("title")?.toString() ?? null;
    const description: string | null =
        formData.get("description")?.toString() ?? null;
    const categoryname: string | null =
        formData.get("category_id")?.toString() ?? null;
    let category_id: number | null = null;
    

    try {
        if (categoryname) {
            category_id = (await getCategoryByName(categoryname)).category_id;
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }

    try {
        
        await connectToDataBase();
        if (title && title.length > 0 && count > 0) {
            console.log("Poll creating!!!");
            console.log(title, description, category_id, user_id);

            const poll = await Poll.create({
                title: title,
                description: description,
                category_id: category_id,
                user_id: user_id,
            });

            for (let i = 0; i < count; i++) {
                const text: string | null =
                    formData.get(`answer_${i}`)?.toString() ?? null;
                if (text) {
                    await Option.create({
                        poll_id: poll.id,
                        option_text: text,
                    });
                } else {
                    console.log(`Option at index ${i} is missing`);
                }
            }

            return {
                success: true,
                message: "Poll created successfully",
            };
        } else {
            throw new Error(
                "Title is required and count must be greater than 0"
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }
}

export async function editPoll({
    formData,
    count,
    pollId,
}: {
    formData: FormData;
    count: number;
    pollId: string;
}) {
    const title: string | null = formData.get("title")?.toString() ?? null;
    const description: string | null =
        formData.get("description")?.toString() ?? null;
    const category_id: string | null =
        formData.get("category_id")?.toString() ?? null;

    try {
        await connectToDataBase();

        if (title && title.length > 0) {
            await Poll.findOneAndUpdate(
                { _id: pollId },
                {
                    title: title,
                    description: description,
                    category_id: category_id,
                }
            );

            const deleteResult = await Option.deleteMany({ pollId: pollId });
            if (deleteResult.deletedCount > 0) {
                console.log(
                    `Deleted ${deleteResult.deletedCount} options with pollId ${pollId}`
                );

                for (let i = 0; i < count; i++) {
                    const text: string | null =
                        formData.get(`answer_${i}`)?.toString() ?? null;
                    if (text) {
                        await Option.create({
                            poll_id: pollId,
                            option_text: text,
                        });
                    } else {
                        throw new Error(`Option at index ${i} is missing`);
                    }
                }
            } else {
                return {
                    success: false,
                    message: "Havent found any answers of the question",
                };
            }

            return {
                success: true,
                message: "Poll edited successfully",
            };
        } else {
            throw new Error("Title is required");
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }
}

export async function deletePoll(pollId: string) {
    try {
        await connectToDataBase();

        const deletedPoll = await Poll.findByIdAndDelete(pollId);

        if (!deletedPoll) {
            return {
                success: false,
                message: "Poll not found",
            };
        }

        const deleteOptionsResult = await Option.deleteMany({
            poll_id: pollId,
        });

        return {
            success: true,
            message: `Poll '${deletedPoll.title}' and ${deleteOptionsResult.deletedCount} options deleted successfully`,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }
}

export async function getPollById(pollId: string) {
    try {
        await connectToDataBase();

        const poll = await Poll.findOne({ _id: pollId }).populate(
            "category_id"
        );

        if (!poll) {
            return {
                success: false,
                message: "Poll not found",
            };
        }

        const options = await Option.find({ poll_id: pollId });

        return {
            success: true,
            poll: {
                _id: poll._id,
                title: poll.title,
                description: poll.description,
                category: poll.category_id,
                options: options,
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }
}

export async function voteToPoll(
    pollId: string,
    optionId: string,
    userId: string
) {
    try {
        await connectToDataBase();

        const existingVote = await Vote.findOne({
            poll_id: pollId,
            user_id: userId,
        });
        if (existingVote) {
            return {
                success: false,
                message: "You have already voted for this poll",
            };
        }

        const newVote = await Vote.create({
            poll_id: pollId,
            option_id: optionId,
            user_id: userId,
        });

        return {
            success: true,
            vote: newVote,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
            };
        }
    }
}

export async function getAllPolls() {
    try {
        await connectToDataBase();

        const polls = await Poll.find();
        console.log('successfully responsed');
        const newPolls = polls.map(poll => {
            const options = getAllOptionsByPollId(poll._id);
            console.log("POLL", options);
            
            return{
            _id: Number(poll._id),
            title: poll.title,
            description: poll.description,
            options
          }});

        
        
        return {
            success: true,
            polls: newPolls,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
        };
    }
}

export async function getAllCategories() {
    try {
        await connectToDataBase();

        const categories = await Category.find();
        const obj: { [key: number]: string } = {};
        categories.forEach((category) => {
            obj[category._id] = category.name;
        });

        return {
            success: true,
            categories: obj,
            message: "successfully",
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            categories: null,
        };
    }
}

export async function addCategories() {
    const categories = [
        "Social",
        "Technology",
        "Business",
        "Sport",
        "Entertainment",
        "Education",
        "Politics",
        "Religious",
        "News",
        "Food",
    ];

    categories.forEach(async (element) => {
        await Category.create({
            name: element,
        });
    });
}

export async function getCategoryByName(categoryName: string) {
    try {
        await connectToDataBase();

        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return {
                success: false,
                message: "category not found",
            };
        }

        return {
            success: true,
            message: "Found",
            category_id: category._id,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                category_id: null,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
                category_id: null,
            };
        }
    }
}

export async function getAllOptionsByPollId(poll_id: Schema.Types.ObjectId) {
    try {
        await connectToDataBase();

        const options = await Option.find({ poll_id: poll_id});
        

        if (!options) {
            return {
                success: false,
                message: "options not found",
            };
        }

        return {
            success: true,
            message: "Found",
            category_id: options,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                category_id: null,
            };
        } else {
            return {
                success: false,
                message: "An unexpected error occurred",
                category_id: null,
            };
        }
    }
}
