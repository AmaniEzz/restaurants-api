import { ApiProperty } from '@nestjs/swagger';

export class RestaurantStatisticsDto {
  @ApiProperty({ example: 'New York', description: 'City name' })
  city: string;

  @ApiProperty({ example: 10, description: 'Number of restaurants' })
  count: number;
}
