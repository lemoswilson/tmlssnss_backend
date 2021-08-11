import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10)
		return await bcrypt.hash(password, salt)
	} catch (erro) {
		throw new Error('hashing failed')
	}
}

export async function comparePassword(inputPassword: string, hashedPassword: string){
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error('wrong password')
    }
}

export interface User {
	first_name: string,
	last_name: string,
	email: string,
	password: string,
}

export interface updateUser extends User {
	old_password: string,
	confirmPassword: string,
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true}
})

UserSchema.pre<UserModel>('save', async function (next){
	try {
		if (this.password) {
			this.password = await hashPassword(this.password)
		}
		next()
	} catch (error){
		next(error);
	}
})

export default mongoose.model<UserModel>('UserModel', UserSchema);