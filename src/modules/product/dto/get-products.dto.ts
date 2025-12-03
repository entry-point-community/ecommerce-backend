import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export enum ProductSortBy {
  RECOMMENDED = 'recommended',
}

export class GetProductsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sort?: ProductSortBy;
}
