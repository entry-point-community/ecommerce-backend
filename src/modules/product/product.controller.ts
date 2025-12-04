import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductByIdDto } from './dto/get-product-by-id.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query() getProductsDto: GetProductsDto) {
    return this.productService.findAll(getProductsDto);
  }

  @Get('/:id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    const product = this.productService.findById(id);

    if (!product) {
      // Status code 404
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
