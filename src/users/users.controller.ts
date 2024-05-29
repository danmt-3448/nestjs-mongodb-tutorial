import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const rs = await this.usersService.createUser(createUserDto);

    return { message: 'success', result: rs };
  }

  @Get()
  async getUsers() {
    const rs = await this.usersService.getUsers();
    return { message: 'success', result: rs };
  }

  //users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const rs = await this.usersService.getUserById(id);
    if (!rs) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return rs;
  }

  //user/:id
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const rs = await this.usersService.updateUser(id, updateUserDto);
    if (!rs) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return { message: 'success', result: rs };
  }

  //user/:id
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId)
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const rs = await this.usersService.deleteUser(id);
    if (!rs) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return { message: 'success', result: rs };
  }
}
