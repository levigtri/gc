import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createProdutoDto: CreateProdutoDto) {
    return this.prismaService.produto.create({
      data: createProdutoDto,
    });
  }

  findAll() {
    return this.prismaService.produto.findMany();
  }

  findOne(id: number) {
    return this.prismaService.produto.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return this.prismaService.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prismaService.produto.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') { //Código de erro do Prisma para "Registro não encontrado"
        throw new NotFoundException(`Produto com id ${id} não encontrado`);
      }
      throw error;
    }
  }
}