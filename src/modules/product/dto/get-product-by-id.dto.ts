import { IsString, IsUUID } from 'class-validator';

export class GetProductByIdDto {
  @IsString()
  @IsUUID()
  readonly id: string;
}
