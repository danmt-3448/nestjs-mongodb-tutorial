import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();
    if (existingUser)
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );

    if (settings) {
      const newSettings = new this.userSettingsModel(settings);
      const savedNewSettings = await newSettings.save();
      const newUser = new this.userModel({
        ...createUserDto,
        settings: savedNewSettings._id,
      });

      return newUser.save();
    }
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  getUsers() {
    return this.userModel.find();
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }

  async updateUser(id: string, { settings, ...updateUserDto }: UpdateUserDto) {
    if (settings) {
      const idSettings = await this.userModel.findById(id);
      await this.userSettingsModel.findByIdAndUpdate(
        idSettings.settings,
        settings,
        {
          new: true,
        },
      );
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
