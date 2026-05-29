import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@common/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'driver@school.edu.om' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ahmed Al-Balushi' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '+96891234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ enum: Role, example: Role.DRIVER })
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fcmToken?: string;
}