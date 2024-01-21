import mongoose from 'mongoose';
import { postSchema } from './postSchema';
import { commentSchema } from './commentSchema';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    race: String,
    posts: postSchema,
    comments: commentSchema,
});

const User = model('User', userSchema);

export default User;