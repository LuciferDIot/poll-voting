"use server";
import Poll from "../models/pollModel";
import Option from "../models/optionModel";
import Category from "../models/categoryModel";
import Vote from "../models/voteModel";

export async function createPoll({
    formData,
    count,
}: {
    formData: FormData;
    count: number;
}) {
    const title: string | null = formData.get("title")?.toString() ?? null;
    const description: string | null =
        formData.get("description")?.toString() ?? null;
    const category_id: string | null =
        formData.get("category_id")?.toString() ?? null;

    try {
        if (title && title.length > 0 && count > 0) {
            const poll = await Poll.create({
                title: title,
                description: description,
                category_id: category_id,
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
                    throw new Error(`Option at index ${i} is missing`);
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
        const deletedPoll = await Poll.findByIdAndDelete(pollId);

        if (!deletedPoll) {
            return {
                success: false,
                message: "Poll not found",
            };
        }

        const deleteOptionsResult = await Option.deleteMany({ poll_id: pollId });

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
        const poll = await Poll.findOne({ _id:pollId }).populate('category_id');

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
                options: options
            }
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


export async function voteToPoll(pollId: string, optionId: string, userId: string) {
    try {
        const existingVote = await Vote.findOne({ poll_id: pollId, user_id: userId });
        if (existingVote) {
            return {
                success: false,
                message: "You have already voted for this poll",
            };
        }

        const newVote = await Vote.create({ poll_id: pollId, option_id: optionId, user_id: userId });
        
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
        const polls = await Poll.find().populate('category_id');
        return {
            success: true,
            polls: polls,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}


export async function getAllCategories() {
    try {
        const categories = await Category.find();
        return {
            success: true,
            categories: categories,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        };
    }
}

