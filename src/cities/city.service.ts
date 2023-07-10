import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './city.schema';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City.name) private readonly cityModel: Model<City>,
  ) {}

  async create(city: CreateCityDto): Promise<City> {
    const createdCity = new this.cityModel(city);
    return createdCity.save();
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().exec();
  }

  async findById(id: string): Promise<City | null> {
    return this.cityModel.findById(id).exec();
  }
}
