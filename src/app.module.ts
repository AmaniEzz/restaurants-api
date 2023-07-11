import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// should place this at very first line
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { CityModule } from './cities/city.module';
import { RestaurantModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import config from './config/config';

@Module({
  imports: [
    envModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    CityModule,
    RestaurantModule,
    AuthModule,
  ],
})
export class AppModule {}
