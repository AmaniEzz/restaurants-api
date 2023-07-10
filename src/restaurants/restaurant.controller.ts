import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/users/enums/role.enum';
import { AccessTokenAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { PaginationParams } from 'src/common/pagination/pagination.params';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { ApiPaginatedResponse } from 'src/common/pagination/api-pagination.response';
import { IsOptional } from 'class-validator';
import {
  PaginatedDto,
  PaginatedResponseDto,
} from 'src/common/pagination/pagination.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiOkResponse({
    description: 'List of restaurants',
    type: Restaurant,
    isArray: true,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search restaurants by name',
  })
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @Get()
  async getResturants(
    @Query('query', new DefaultValuePipe('')) query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<Restaurant>> {
    return this.restaurantService.getResturants(query, page, limit);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiCreatedResponse({
    description: 'Restaurant created successfully',
    type: Restaurant,
  })
  @ApiBody({ type: CreateRestaurantDto })
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() restaurant: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantService.create(restaurant);
  }

  @Get('nearset')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Find nearest restaurants' })
  @ApiPaginatedResponse({
    model: Restaurant,
    description: 'List of nearest restaurants',
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    example: 40.7193,
    required: false,
  })
  @ApiQuery({
    name: 'longitude',
    type: Number,
    example: -73.9928,
    required: false,
  })
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  async findNearestRestaurants(
    @Query('longitude', new DefaultValuePipe(0.0), ParseFloatPipe)
    longitude: number,
    @Query('latitude', new DefaultValuePipe(0.0), ParseFloatPipe)
    latitude: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ): Promise<PaginatedDto<Restaurant>> {
    const options = {
      limit,
      page,
    };
    return this.restaurantService.findNearestRestaurants(
      latitude,
      longitude,
      options,
    );
  }

  @Get('statistics')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get restaurant statistics by city' })
  @ApiOkResponse({ description: 'Restaurant statistics', type: Object })
  async getRestaurantStatisticsByCity(): Promise<any> {
    return this.restaurantService.getRestaurantStatistics();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiOkResponse({ description: 'Restaurant found', type: Restaurant })
  @ApiParam({ name: 'id', description: 'Restaurant ID', type: String })
  async findById(@Param('id') id: string): Promise<Restaurant | null> {
    return this.restaurantService.findById(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Update restaurant by ID' })
  @ApiOkResponse({
    description: 'Restaurant updated successfully',
    type: Restaurant,
  })
  @ApiNoContentResponse({ description: 'Restaurant not found' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiParam({ name: 'id', description: 'Restaurant ID', type: String })
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    return this.restaurantService.update(id, restaurant);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Delete restaurant by ID' })
  @ApiOkResponse({
    description: 'Restaurant deleted successfully',
    type: Restaurant,
  })
  @ApiNoContentResponse({ description: 'Restaurant not found' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', type: String })
  async delete(@Param('id') id: string): Promise<Restaurant | null> {
    return this.restaurantService.delete(id);
  }
}
