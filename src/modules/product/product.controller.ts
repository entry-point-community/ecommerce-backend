import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { SearchProductDto } from './dto/search-product.dto';

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

  @Post('/search')
  @AllowAnonymous()
  search(@Body() searchProductDto: SearchProductDto) {
    return this.productService.searchProducts(searchProductDto);
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
