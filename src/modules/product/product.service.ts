import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/infra/database/prisma.service';
import { GetProductsDto, ProductSortBy } from './dto/get-products.dto';
import { Prisma } from 'generated/prisma/client';
import { SearchProductDto } from './dto/search-product.dto';

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

  public async searchProducts(searchProductsDto: SearchProductDto) {
    const { productName, categoryIds, sortBy, limit } = searchProductsDto;

    const whereClause: Prisma.ProductWhereInput = {};
    const orderByClause: Prisma.ProductOrderByWithRelationInput = {};

    if (productName) {
      whereClause.name = {
        contains: productName,
        mode: 'insensitive',
      };
    }

    if (categoryIds) {
      whereClause.categoryId = {
        in: categoryIds,
      };
    }

    if (sortBy) {
      switch (sortBy) {
        case ProductSortBy.PRICE_ASC:
          orderByClause.price = 'asc';
          break;
        case ProductSortBy.PRICE_DESC:
          orderByClause.price = 'desc';
          break;
        default:
          break;
      }
    }

    const products = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit,
      select: {
        id: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        description: true,
        name: true,
        price: true,
        imageUrl: true,
      },
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));
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

  public async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
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

    if (!product) return null;

    return {
      ...product,
      price: product.price.toNumber(),
    };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
