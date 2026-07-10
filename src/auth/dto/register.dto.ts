import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Secur3Pass!',
    minLength: 8,
    description:
      'At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
    message:
      'password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: 'Alice', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
