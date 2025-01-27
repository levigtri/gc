import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { DbModule } from 'src/db/db.module';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [DbModule],
  controllers: [ProdutoController],
  providers: [ProdutoService, PrismaService],
  exports: [ProdutoService],
})
export class ProdutoModule { }