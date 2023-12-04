import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ExecutionContext, Req, Res, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService: JwtService, private configService: ConfigService) { }
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successfully!' })
  @ApiResponse({ status: 401, description: 'Login fail!' })
  @UsePipes(ValidationPipe)
  login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    console.log('login api');
    console.log(loginUserDto);
    return this.authService.login(loginUserDto)
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): Promise<any> {
    console.log('refresh token api')
    return this.authService.refreshToken(refresh_token);
  }
  @Get("checkToken")
  async findAll(@Req() req: Request, @Res() res: Response) {
    const request = req
    const token = this.extractTokenFromHeader(request);
    console.log("🚀 ~ file: auth.controller.ts:36 ~ AuthController ~ findAll ~ token:", token)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET')
      })
      console.log("🚀 ~ file: auth.controller.ts:49 ~ AuthController ~ findAll ~ payload:", payload)

      if (payload.role == "ADMIN") {

        return res.status(HttpStatus.OK).json(true)
      } else {
        return res.status(HttpStatus.CREATED).json(false)
      }
    } catch (err) {
      throw new HttpException({
        status: 419,
        message: "Server Err"
      }, 419)
    }

  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
    return type === 'Bearer' ? token : undefined;
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
