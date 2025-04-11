import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async getUsers() {
    return this.userRepository.find({});
  }
}
