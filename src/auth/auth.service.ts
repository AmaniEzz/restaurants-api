import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/services/users.service';
import { User } from '../users/user.schema';
import { AuthResponse } from './dto/auth-response.dto';
import { HashService } from 'src/users/services/hash.service';
import { JwtPayload } from './strategy/jwt.strategy';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User does not exist');

    const passwordMatches = await this.hashService.comparePassword(
      pass,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Password is incorrect');

    return user;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    let accessToken: string;
    try {
      accessToken = await this.generateAccessToken(payload);
    } catch (error) {
      throw new UnauthorizedException('Failed to Generate Access Token');
    }
    return { accessToken };
  }

  private generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
