import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const user =
      (await this.usersService.findByEmail(identifier)) ||
      (await this.usersService.findByUsername(identifier));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
      username: user.username,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}