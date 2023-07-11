import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty()
  city: string;

  @ApiProperty()
  count: number;
}
