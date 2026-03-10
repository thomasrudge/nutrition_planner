import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ){}

    @Get('/:id')
    async findUserId(@Param('id') id:string){

    
        const user = await this.usersService.findOneById(id)

         if (!user){
            throw new NotFoundException("User not found!")
        }

        return user;

    }

    @Get('/email/:email')
    async findUserEmail(@Param('email') email:string){

        
        const user = await this.usersService.findOneByEmail(email)

        if (!user){
            throw new NotFoundException("User not found!")
        }

        return user;

    }

    @Delete('/:id')
    async deleteUser(@Param('id') id:string){
        const user = await this.usersService.delete(id)

        if (!user){
            throw new NotFoundException("User not found!")
        }
        return user
    }

    
    // @Post()
    // createUser(@Body() body: CreateUserDto){
    //     return this.usersService.create(body.name, body.email,body.password)
    // }
    
    @Patch('/:id')
    async updateUser(@Param('id') id:string, @Body() body: UpdateUserDto){
        const user =  await this.usersService.update(id, body)

        if (!user){
            throw new NotFoundException("User not found!")
        }

        return user;
    }
}
