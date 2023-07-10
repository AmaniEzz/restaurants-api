import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SearchByNameDto {
  @ApiProperty({
    example: 'Restaurant',
    description: 'The name or part of the name to search for',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
