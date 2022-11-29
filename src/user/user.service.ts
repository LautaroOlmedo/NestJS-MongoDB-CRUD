import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './interfaces/user.interface'
import { CreateUserDTO } from './dto/user.dto'


@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>){}
    async getAllUsers(page: number): Promise<User[]>{
        try{
            let usersInDb = await this.userModel.find();
            let users = []
            for(let i = 5 * page; i < usersInDb.length; i++){
                users.push(usersInDb[i]);
                if(users.length === 5) break;
            };
            return users; 
        } catch(e){
            console.log(e);
        };
    };
    
    async getUserById(userId: string): Promise<User>{
        try {
            console.log(typeof userId);
            const user = await this.userModel.findById(userId);
            
            return user;
        } catch(e){
            console.log(e);
        };
    };

    async createUser(createUserDTO: CreateUserDTO): Promise<User>{
        try {
            const userCreated = new this.userModel(createUserDTO);
            // if(userCreated){
            //     await userCreated.save();
            // }
            return await userCreated.save();
        } catch(e){
            console.log(e);
        };
    };

    async updateUser(userId: string, createUserDTO: CreateUserDTO): Promise<User>{
        try {
            const userUpdated = await this.userModel.findByIdAndUpdate(userId, createUserDTO, {new: true});
            return userUpdated;
        } catch(e){
            console.log(e);
        };
    };

    async deleteUser(userId: string): Promise<User>{
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(userId);
            return deletedUser;
        } catch(e){
            console.log(e);
        };
    };

    async bannedUser(userId: string, createUserDTO: CreateUserDTO): Promise<User>{
        try {
            const userBanned = await this.userModel.findByIdAndUpdate(userId, createUserDTO, {new: true});
            return userBanned;
        } catch(e){
            console.log(e);
        };
    };
};
