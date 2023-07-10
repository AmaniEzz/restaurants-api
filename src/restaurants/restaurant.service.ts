import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Restaurant } from './restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import {
  PaginatedResponseDto,
  PaginationMeta,
} from 'src/common/pagination/pagination.dto';
import { RestaurantStatisticsDto } from './dto/cities-stats.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(restaurant: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant = new this.restaurantModel(restaurant);
    return await createdRestaurant.save();
  }

  async getResturants(
    query?: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponseDto<Restaurant>> {
    try {
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
    } catch (error) {
      throw new HttpException(
        'Failed To Find Restaurants',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: new Error(error.response),
        },
      );
    }
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).exec();
  }

  async update(
    id: string,
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findByIdAndUpdate(id, restaurant, {
        new: true,
      })
      .exec();
  }

  async delete(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }

  async findNearestRestaurants(
    latitude: number,
    longitude: number,
    { limit, page }: { limit: number; page: number },
  ): Promise<PaginatedResponseDto<Restaurant>> {
    try {
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

      return { meta: pagination, items: paginatedResults };
    } catch (error) {
      throw new HttpException(
        'Failed To Find Nearst Restaurants',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: new Error(error.response),
        },
      );
    }
  }

  async getRestaurantStatistics(): Promise<RestaurantStatisticsDto[]> {
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
          _id: 0,
        },
      },
    ]);

    return statistics.map((stat) => ({
      city: stat.city,
      count: stat.count,
    }));
  }
}
