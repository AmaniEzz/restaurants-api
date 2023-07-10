import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from './services/users.service';
import { User } from './user.schema';
import { AccessTokenAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayload } from 'src/auth/strategy/jwt.strategy';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  @UsePipes(ValidationPipe)
  @Post('/signup')
  async CreateUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Me' })
  @ApiOkResponse({ description: 'User found', type: User })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @UseGuards(AccessTokenAuthGuard)
  @Get('me')
  async me(
    @CurrentUser() payload: JwtPayload,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.findWithoutPassword(payload.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiOkResponse({ description: 'User updated successfully', type: User })
  @ApiUnauthorizedResponse({ description: 'User is Unauthorized' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AccessTokenAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(id, user);
  }
}
