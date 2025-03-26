// message model
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reciever: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    content: {
        type: String,
        required: true,
    },
    sentiment: {
        type: Object, // store the complete result from Hugging Face
        default: {},
    },
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
