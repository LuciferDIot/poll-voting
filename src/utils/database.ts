import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export const connectToDataBase = async () => {
    if (isConnected) {
        console.log("DB connected already");
        return;
    } else {
        mongoose.Promise = global.Promise;
        const URL = "mongodb://0.0.0.0:27017/PollVote";
        try {
            await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            isConnected = true;
            console.log("DB connected successfully");
        } catch (error) {
            console.error("Error connecting to database:", error);
        }
    }
};
