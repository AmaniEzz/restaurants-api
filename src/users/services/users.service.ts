import {
  BadRequestException,
  NotFoundException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    // check if user exists
    const user = await this.findByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('User Already exists');
    }
    // Hash Password
    createUser.password = await this.hashService.hash(createUser.password);

    return createUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findWithoutPassword(email: string): Promise<Omit<User, 'password'>> {
    const user = (await this.userModel.findOne({ email })).toJSON();
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean();
    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }
    return updatedUser;
  }
}
