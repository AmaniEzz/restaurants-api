import {
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    console.log(createUser);
    // check if user exists
    const user = await this.findByEmail(createUserDto.email);

    if (user) {
      throw new HttpException('User Already exists', HttpStatus.BAD_REQUEST);
    }
    // Hash Password
    createUser.password = await this.hashService.hash(createUser.password);

    return createUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).lean();
  }

  async findWithoutPassword(
    email: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({ email }).lean();
    if (user) {
      const { password, ...rest } = user;

      return rest;
    }
    return null;
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const { password, ...user } = await this.userModel.findById(id).lean();
    return user;
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean();
    if (!updatedUser) {
      throw new HttpException(
        'Update Failed: User Not Found',
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedUser;
  }
}
