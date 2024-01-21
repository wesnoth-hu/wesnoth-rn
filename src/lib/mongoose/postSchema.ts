import mongoose from 'mongoose';
import { commentSchema } from './commentSchema';

const { Schema, model} = mongoose;

export const postSchema = new Schema({
    // author, content, comments, createdAt, updatedAt
    author: String,
    content: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
    comments: commentSchema,
});

const Post = model('Post', postSchema);

export default Post;