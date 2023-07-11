import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from './city.schema';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private readonly cityModel: Model<CityDocument>,
  ) {}

  async create(city: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel(city);
    return createdCity.save();
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().lean();
  }

  async findById(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).lean();
    if (!city) {
      throw new NotFoundException('City Not Found');
    }
    return city;
  }
}
