import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Classic 45 minute haircut' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 45 })
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  duration: number;

  @ApiProperty({ example: 29.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
