import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ResponseRestaurantDto {
  @ApiProperty({
    example: '60d9e1a05b69af1234567890',
    description: 'The ID of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

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
    example: 'https://example.com/restaurantA.jpg',
    description: 'The URL of the restaurant image',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    example: { type: 'Point', coordinates: [40.7128, -74.006] },
    description:
      'The geolocation coordinates [longitude, latitude] of the restaurant',
  })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  location: {
    type: string;
    coordinates: [number, number];
  };
}
