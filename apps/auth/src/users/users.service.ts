import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }
    try {
      const existingUser = await this.userRepository.findOne({ email });
      if (existingUser) {
        throw new UnauthorizedException('Email already exists');
      }
    } catch (e) {
      if (e.name !== 'NotFoundException') {
        throw e;
      }
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUsers() {
    return this.userRepository.find({});
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto);
  }
}
