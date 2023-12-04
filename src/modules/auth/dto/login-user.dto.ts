import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto{
    @ApiProperty()
    @IsNotEmpty()
    userName:string;
    
    @ApiProperty()
    @IsNotEmpty()
    password:string;

}