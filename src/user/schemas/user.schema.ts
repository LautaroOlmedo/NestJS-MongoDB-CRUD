import {Schema} from 'mongoose'

export const UserSchema = new Schema({
    name: {
        type: String, 
        required: true },
    email: {
        type: String, 
        required: true },
    age: {
        type: Number, 
        required: true },
    active: {
        type: Boolean,
        default: true
    },
    year: {
        type: String,
        required: true
    }
});