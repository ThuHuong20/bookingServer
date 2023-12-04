import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.register({
    global:true,
    secret:'123456',
    signOptions:{expiresIn:"1d"} 
  }),
  ConfigModule
],
  controllers: [AuthController], 
  providers: [AuthService],
})
export class AuthModule {}
