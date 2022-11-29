import { Controller, Get, Post, Put, Delete, Res, HttpStatus, Param, Query, Body, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('/')
    async getUsers(@Res() res, @Query('year') year: string ,@Query('page') page: number): Promise<{}>{
        // if(typeof page !== "number" || page < 0) return res.status(HttpStatus.BAD_REQUEST).json({message: "Page need a positive number value"});
        try {
            if(!page) page = 1;
            if(page < 1) return res.status(HttpStatus.BAD_REQUEST).json({message: `canot found page ${page}`});

            let allUsers = await this.userService.getAllUsers(page - 1);
            if(year){
                if(typeof year !== "string") return res.status(HttpStatus.BAD_REQUEST).json({message: "Year will be a string value"});
                allUsers = allUsers.filter((user) => user.year.includes(year));
            };

            const response = {
                currentPage: page,
                previousPage: `http://localhost:3001/api/videogames/page/${Number(page) - 1}`,
                nextPage: `http://localhost:3001/api/videogames/page/${Number(page) + 1}`,
                students: allUsers
            };

            if(page == 1) response.previousPage = null;
            if(response.students.length < 5) response.nextPage = null;

            return res.status(HttpStatus.OK).json(response);
        }catch(e){
            console.log(e);
            return res.status(HttpStatus.NOT_FOUND).json({message: "Internal Error"});   
        };
    };

    @Get('/:userId')
    async getUserById(@Res() res, @Param('userId') userId): Promise<{}> {
        if(!userId) throw new NotFoundException('ID is required');
        if(userId.length < 23 || userId.length > 25) throw new NotFoundException('ID need 23 characters');
        const user = await this.userService.getUserById(userId);
     
        if(!user) throw new NotFoundException('User does not exist');
        return res.status(HttpStatus.OK).json({
             acepted: true,
             user: user
         });
    };

    @Post("/create")
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO): Promise<{}>{
        try {
            if(!createUserDTO.active || !createUserDTO.name|| !createUserDTO.age){
                return res.status(HttpStatus.BAD_REQUEST).json({message: "Missing info"});
            };
            const userCreated = await this.userService.createUser(createUserDTO);
           
            if(userCreated){
                return res.status(HttpStatus.CREATED).json({
                    recived: "true",
                    created: "true",
                    user: userCreated
                });
            };
            return res.status(HttpStatus.CONFLICT).json({message: "Missing info"})
        } catch(e){
            console.log(e);
            return res.status(HttpStatus.NOT_FOUND).json({messge: "Internal Error"})
        };
    };

    @Put("/update/:userId")
    async updateUser(@Res() res, @Param('userId') userId, @Body() createUserDTO: CreateUserDTO):Promise<{}>{
        if(!userId) throw new NotFoundException('ID is required');
        if(userId.length < 23 || userId.length > 25) throw new NotFoundException('ID need 23 characters');
        const user = await this.userService.updateUser(userId, createUserDTO)
        if(!user) throw new NotFoundException('User does not exist');
        return res.status(HttpStatus.OK).json({
            recived: true,
            message: "User update satifactory",
            userDeleted: user 
        });   
    };

    @Delete("/delete/:userId")
    async deleteUser(@Res() res, @Param('userId') userId): Promise<{}>{
        if(!userId) throw new NotFoundException('ID is required');
        if(userId.length < 23 || userId.length > 25) throw new NotFoundException('ID need 23 characters');
        const userDeleted = await this.userService.deleteUser(userId);
        if(!userDeleted) throw new NotFoundException('User does not exist');
        return res.status(HttpStatus.OK).json({
            recived: true,
            message: "User deleted satifactory",
            userDeleted: userDeleted     
        });
    };

    @Put('/banned/:userId')
    async bannedUser(@Res() res, @Param('userId') userId, @Body() createUserDTO: CreateUserDTO): Promise<{}>{
        if(!userId) throw new NotFoundException('ID is required');
        if(userId.length < 23 || userId.length > 25) throw new NotFoundException('ID need 23 characters');
        const user = await this.userService.updateUser(userId, createUserDTO)
        if(!user) throw new NotFoundException('User does not exist');
        return res.status(HttpStatus.OK).json({
            recived: true,
            message: "User update satifactory",
            userDeleted: user 
        });   
    };
};
