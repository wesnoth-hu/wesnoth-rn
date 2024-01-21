import mongoose from 'mongoose';

const { Schema, model} = mongoose;

export const commentSchema = new Schema({
    // author, content, createdAt
    author: String,
    content: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
});

const Comment = model('Post', commentSchema);

export default Comment;