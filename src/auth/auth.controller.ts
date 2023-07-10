import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginRequestDto } from './dto/auth.dto';
import { User } from 'src/users/user.schema';
import { CurrentUser } from './decorator/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Login user' })
  @ApiOkResponse({
    description: 'The users logged in successfully.',
    type: AuthResponse,
  })
  @ApiBody({
    description: 'Credentials of user',
    type: LoginRequestDto,
  })
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@CurrentUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }
}
