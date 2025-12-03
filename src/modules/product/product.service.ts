import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/infra/database/prisma.service';
import { GetProductsDto, ProductSortBy } from './dto/get-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(getProductsDto: GetProductsDto) {
    switch (getProductsDto.sort) {
      case ProductSortBy.RECOMMENDED:
        return this.getRecommendedProducts(getProductsDto.limit);
      default:
        const products = await this.prisma.product.findMany({
          take: getProductsDto.limit,
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            description: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        });

        return products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        }));
    }
  }

  // TODO: Implement recommended algorithm
  private async getRecommendedProducts(limit: number) {
    const products = await this.prisma.product.findMany({
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
