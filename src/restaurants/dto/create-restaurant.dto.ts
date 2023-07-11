import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Restaurant A',
    description: 'The name of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'restaurantA@example.com',
    description: 'The email of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '64ac604975079dea6685b08b',
    description: 'The ID of the city where the restaurant is located',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  city: string;

  @ApiProperty({
    example: 'https://example.com/restaurantA.jpg',
    description: 'The URL of the restaurant image',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    example: { type: 'Point', coordinates: [-73.99279, 40.719296] },
    description:
      'The geolocation coordinates [longitude, latitude] of the restaurant',
  })
  @IsNotEmpty()
  @IsObject()
  location: {
    type: string;
    coordinates: [number, number];
  };
}
