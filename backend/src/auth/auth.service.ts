import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async signin(email:string, password:string){

        const user = await this.usersService.findOneByEmail(email);

        if (!user){
            throw new NotFoundException('User not found!')
        }

        const [salt,storedHash] = user.password.split('.');

        const hash = (await scrypt(password,salt,32)) as Buffer;

        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException('bad password')
        } 

        return this.jwtService.sign({sub: user.id});



    }

    async signup(email:string, password:string, name:string){
        // See if email is in use
        const users = await this.usersService.findOneByEmail(email);

        if (users){
            throw new BadRequestException('Email in use')
        }

        // Hash users password

        // Generate salt
        const salt = randomBytes(8).toString('hex');
        

        // hash salt and password
        const hash = (await scrypt(password,salt,32)) as Buffer;
        // 32 characters as the output

        // join hashed result and salt together
        const result = salt + '.'+ hash.toString('hex');

        //create new user and save it
        const user = await this.usersService.create(name, email, result);

        // return the user
        return this.jwtService.sign({sub: user.id});

    }
}
