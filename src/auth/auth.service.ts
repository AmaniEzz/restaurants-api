import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/services/users.service';
import { User } from '../users/user.schema';
import { AuthResponse } from './dto/auth-response.dto';
import { HashService } from 'src/users/services/hash.service';
import { JwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);

    const passwordMatches = await this.hashService.comparePassword(
      pass,
      user.password,
    );
    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);

    return user;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.generateAccessToken(payload);

    return { accessToken };
  }

  private generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }
}
