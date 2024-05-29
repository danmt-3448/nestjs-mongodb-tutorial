import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from 'src/posts/dtos/CreatePost.dto';
import { Post } from 'src/schemas/Post.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser || !findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const newPost = await new this.postModel(createPostDto);
    const saveNewPost = await newPost.save();

    await findUser.updateOne({ $push: { posts: saveNewPost._id } });
    return saveNewPost;
  }
}
