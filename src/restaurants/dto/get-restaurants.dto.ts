import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NearestLocationDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  longitude: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  latitude: number;
}

export class SearchByNameDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
