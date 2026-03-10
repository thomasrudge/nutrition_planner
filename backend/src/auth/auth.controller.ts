import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/DTOs/create-user.dto';
import { SigninDto } from './DTOs/signin.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('/signup')
    @Public()
    async signup(@Body() body: CreateUserDto){
        return this.authService.signup(body.email, body.password, body.name)
    }

    @Post('/signin')
    @Public()
    async signin(@Body() body: SigninDto){
        return this.authService.signin(body.email, body.password)
    }
}
