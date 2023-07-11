import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Restaurant, RestaurantDocument } from './restaurant.schema';
import {
  CreateRestaurantDto,
  StatsResponseDto,
  UpdateRestaurantDto,
} from './dto';
import {
  PaginatedResponseDto,
  PaginationMeta,
} from 'src/common/pagination/pagination.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant = new this.restaurantModel(restaurant);
    if (!createdRestaurant) {
      throw new BadRequestException('Failed to create restaurant');
    }
    return await createdRestaurant.save();
  }

  async getResturants(
    query?: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponseDto<Restaurant>> {
    const skip = (page - 1) * limit;

    const pipeline = [];
    if (query) {
      const search = {
        $search: {
          index: 'name-search',
          autocomplete: {
            query,
            path: 'name',
          },
        },
      };
      pipeline.push(search);
    }

    pipeline.push({
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        email: 1,
        city: 1,
        location: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    pipeline.push({
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    });

    const [result] = await this.restaurantModel.aggregate(pipeline).exec();
    const { paginatedResults, totalCount } = result;

    const count = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(count / limit);

    const pagination: PaginationMeta = {
      page,
      limit,
      count,
      totalPages,
    };

    return { meta: pagination, items: paginatedResults };
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} does not exist`);
    }
    return restaurant;
  }

  async update(
    id: string,
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const updatedDoc = await this.restaurantModel
      .findByIdAndUpdate(id, restaurant, {
        new: true,
      })
      .exec();
    if (!updatedDoc) {
      throw new NotFoundException(`Restaurant with id ${id} does not exist`);
    }
    return updatedDoc;
  }

  async delete(id: string): Promise<Restaurant | null> {
    const deletedDoc = await this.restaurantModel.findByIdAndDelete(id).exec();
    if (!deletedDoc) {
      throw new NotFoundException(`Restaurant with id ${id} does not exist`);
    }
    return deletedDoc;
  }

  async findNearestRestaurants(
    latitude: number,
    longitude: number,
    { limit, page }: { limit: number; page: number },
  ): Promise<PaginatedResponseDto<Restaurant>> {
    const skip = (page - 1) * limit;
    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance',
          maxDistance: 20,
          spherical: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          email: 1,
          city: 1,
          location: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await this.restaurantModel.aggregate(pipeline).exec();
    const { paginatedResults, totalCount } = result;

    const count = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(count / limit);

    const pagination = {
      page,
      limit,
      count,
      totalPages,
    };

    return { meta: pagination, items: paginatedResults ?? [] };
  }

  async getRestaurantStatistics(): Promise<StatsResponseDto[]> {
    const statistics = await this.restaurantModel.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: '_id',
          foreignField: '_id',
          as: 'cityData',
        },
      },
      {
        $project: {
          city: { $arrayElemAt: ['$cityData.name', 0] },
          count: 1,
        },
      },
    ]);

    return statistics.map((stat) => ({
      city: stat.city,
      count: stat.count,
    }));
  }
}
