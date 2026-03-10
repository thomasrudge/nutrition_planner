import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/DTOs/create-user.dto';
import { SigninDto } from './DTOs/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('/signup')
    async signup(@Body() body: CreateUserDto){
        return this.authService.signup(body.email, body.password, body.name)
    }

    @Post('/signin')
    async signin(@Body() body: SigninDto){
        return this.authService.signin(body.email, body.password)
    }
}
