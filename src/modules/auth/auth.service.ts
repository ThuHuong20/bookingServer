import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}
  async login(loginUserDto:LoginUserDto):Promise<any>{
    const user=await this.userRepository.findOne(
      {
        where:{ userName:loginUserDto.userName}
      }
    )
  
    if(!user){
      throw new HttpException("User Name is not exist", HttpStatus.UNAUTHORIZED)
    };
    if(user.password!=loginUserDto.password) {
      throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED)
    }
    const payload={id:user.id, userName:user.userName, role:user.role }
    return this.generateToken(payload);
  }
   private async generateToken(payload: {id: number, userName: string}) {

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    })
    await this.userRepository.update(
      {userName:payload.userName},
      {refreshToken,}
    )
    return {accessToken, refreshToken}
   }
   async refreshToken(refreshToken: string): Promise<any> {
    try {
        const verify = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('SECRET')
        })
        const checkExistToken = await this.userRepository.findOneBy({ userName:verify.userName, refreshToken })
        if (checkExistToken) {
            return this.generateToken({ id: verify.id, userName:verify.userName })
        } else {
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
        }

    } catch (error) {
        throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
    }
}
  create(createAuthDto: CreateAuthDto) {
    
  }

  async checkToken(userName: string) {
    const user= await this.userRepository.findOne(
      {
        where:{ userName: userName}
      }
    )
    console.log("🚀 ~ file: auth.service.ts:73 ~ AuthService ~ checkToken ~ user:", user)
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
