import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: true,
  })
  @IsNotEmpty({
    message: 'Username is required',
  })
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email',
    required: true,
  })
  @IsString({
    message: 'Email must be a string',
  })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'User password',
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ example: 'admin', description: 'User role', required: true })
  @IsString()
  @IsNotEmpty({
    message: 'Role is required',
  })
  role: string;
}
