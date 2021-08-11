import mongoose, { Schema, Document } from 'mongoose';
import { UserModel } from './user.model';

interface UserRecover {
    user: UserModel['_id'],
    password: string, 
    timeout: number,
}

export interface UserRecoverModelType extends UserRecover, Document {};

const UserRecoverModel = new Schema({
    user: { type: Schema.Types.ObjectId, required: true},
    password: { type: String, required: true},
    timeout: { type: Number, required: true }
});

export default mongoose.model<UserRecoverModelType>('UserRecoverModel', UserRecoverModel);
