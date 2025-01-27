import * as dotenv from 'dotenv';
const result = dotenv.config({ path: '../.env' });
// console.log('dotenv result:', result);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await prisma.produto.deleteMany();
  });

  it('/produtos (POST) - Deve criar um novo produto', async () => {
    const novoProduto = {
      nome: 'Pizza',
      descricao: 'Sabor Calabresa',
      preco: 50,
    };

    const response = await request(app.getHttpServer())
      .post('/produtos')
      .send(novoProduto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(novoProduto.nome);
    expect(response.body.descricao).toBe(novoProduto.descricao);
    expect(response.body.preco).toBe(novoProduto.preco);

    createdId = response.body.id;
    console.log("id do produto", createdId);
  });

  it('/produtos (GET) - Deve listar todos os produtos', async () => {
    const response = await request(app.getHttpServer())
      .get('/produtos')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdId,
          nome: 'Pizza',
          descricao: 'Sabor Calabresa',
          preco: 50,
        }),
      ]),
    );
  });

  it('PATCH /produtos/:id - Deve atualizar o produto criado', async () => {
    const atualizacao = {
      nome: 'Pizza Calabresa Grande',
      preco: 60,
    };

    const response = await request(app.getHttpServer())
      .patch(`/produtos/${createdId}`)
      .send(atualizacao)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdId);
    expect(response.body.nome).toBe(atualizacao.nome);
    expect(response.body.preco).toBe(atualizacao.preco);
  });

  it('DELETE /produtos/:id - Deve deletar o produto criado', async () => {
    await request(app.getHttpServer())
      .delete(`/produtos/${createdId}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
});
