import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Johhny Doe', description: 'User name' })
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'johndoeupdate@example.com',
    description: 'User email',
  })
  readonly email?: string;
}
