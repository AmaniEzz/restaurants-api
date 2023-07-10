import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CityService } from './city.service';
import { City } from './city.schema';
import { CreateCityDto } from './dto/create-city.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/users/enums/role.enum';
import { AccessTokenAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get all cities' })
  @ApiOkResponse({ description: 'List of cities', type: City, isArray: true })
  @Get()
  async findAll(): Promise<City[]> {
    return await this.cityService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiOkResponse({ description: 'City found', type: City })
  @ApiNoContentResponse({ description: 'City not found' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<City | null> {
    return await this.cityService.findById(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Create a new city' })
  @ApiCreatedResponse({ description: 'City created successfully', type: City })
  @ApiBody({ type: CreateCityDto })
  @Post()
  async create(@Body() city: CreateCityDto): Promise<City> {
    return await this.cityService.create(city);
  }
}
