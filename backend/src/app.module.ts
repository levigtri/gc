import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ProdutoModule } from './produto/produto.module';
import { ProdutoController } from './produto/produto.controller';

@Module({
  imports: [DbModule, ProdutoModule],
  controllers: [ProdutoController],
  providers: [],
})
export class AppModule { }