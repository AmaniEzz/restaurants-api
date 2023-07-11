import {
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { User } from 'src/users/user.schema';
import { CurrentUser } from '../common/decorator/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
@ApiNotFoundResponse({
  description: 'User not found',
})
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
