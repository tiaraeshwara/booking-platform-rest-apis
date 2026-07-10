import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    if (withPassword) {
      return this.usersRepository
        .createQueryBuilder('user')
        .addSelect(['user.password', 'user.refreshToken'])
        .where('user.email = :email', { email })
        .getOne();
    }

    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(payload: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }

  async setRefreshToken(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: refreshTokenHash,
    });
  }
}
