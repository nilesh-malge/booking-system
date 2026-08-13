import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const password = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password,
          role: 'STAFF',
        },
      });

      return this.sign(user);
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      console.log('LOGIN:', dto.email);

      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      console.log('USER FOUND:', !!user);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const valid = await bcrypt.compare(dto.password, user.password);
      console.log('PASSWORD VALID:', valid);

      if (!valid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return this.sign(user);
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      throw error;
    }
  }

  private async sign(user: any) {
    return {
      access_token: await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
