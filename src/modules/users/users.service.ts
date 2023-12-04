import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository:Repository<User>){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'; 
  }

  async findAll() {
    return await this.userRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id:number, updateUserDto:UpdateUserDto):Promise<UpdateResult>{
    return await this.userRepository.update(id, updateUserDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
