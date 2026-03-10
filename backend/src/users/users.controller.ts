import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, Body, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './DTOs/update-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './users.entity';

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
  
    async deleteUser(@Param('id') id:string, @CurrentUser() currentUser: { userId: string }){
        if (currentUser.userId !== id){
            throw new ForbiddenException("You can only delete your own account.")
        }
        const user = await this.usersService.delete(id)

        if (!user){
            throw new NotFoundException("User not found!")
        }
        return user
    }

    
    @Patch('/:id')
    async updateUser(@Param('id') id:string, @Body() body: UpdateUserDto, @CurrentUser() currentUser: { userId: string } ){

        if (currentUser.userId !== id){
            throw new ForbiddenException("You can only modify your own account.")
        }

        const user =  await this.usersService.update(id, body)

        if (!user){
            throw new NotFoundException("User not found!")
        }

        return user;
    }
}
