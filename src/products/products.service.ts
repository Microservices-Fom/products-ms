import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { envs } from 'src/config';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('⚙ ProductService');
  onModuleInit() {
    this.$connect();
    this.logger.log(`Data base 📚 ${envs.dataBaseUrl} conected`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({where: {available: true}});
    const totalPages = Math.ceil(totalProducts / limit);
    const data = await this.product.findMany({
      where: {available: true},
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: data,
      meta: {
        page: page,
        total: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true
      },
    });

    if (!product) {
      throw new NotFoundException(`Poduct with id ${id} not found, sorry 😢`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
   await this.findOne(id)

   const {id: __, ...data}= updateProductDto

    return this.product.update({
      where: {id},
      data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id)

    const product = await this.product.update({
      where: {id},
      data: {
        available: false
      }
    })
    return product
    // return this.product.delete({where:{id}})
  }
}
