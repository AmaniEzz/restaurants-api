import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleGuard } from './guards/role.guard';
import { UserService } from 'src/users/services/users.service';
import { AuthController } from './auth.controller';
import { HashService } from 'src/users/services/hash.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RoleGuard,
    UserService,
    HashService,
  ],
})
export class AuthModule {}
