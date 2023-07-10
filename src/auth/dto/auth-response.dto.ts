import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.schema';

export class AuthResponse {
  @ApiProperty({
    description: 'The json web token for the user logged',
  })
  accessToken: string;
}
