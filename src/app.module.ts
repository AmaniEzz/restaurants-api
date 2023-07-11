import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { CityModule } from './cities/city.module';
import { RestaurantModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    CityModule,
    RestaurantModule,
    AuthModule,
  ],
})
export class AppModule {}
