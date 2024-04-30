import express from "express";

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.get("/alunos", async (req: Request, res: Response) => {
  const alunos = await prisma.aluno.findMany();
  console.log(alunos);
  res.json(alunos);
});

app.post(
  "/alunos",
  async (
    req: Request & {
      body: {
        nome: string;
        idade: number;
        email: string;
        curso: string;
        hobbies: string[];
        numero_telefone: number;
        ddd_telefone: string;
      };
    },
    res: Response
  ) => {
    const aluno = await prisma.aluno.create({
      data: {
        nome: req.body.nome,
        idade: req.body.idade,
        email: req.body.email,
        curso: req.body.curso,
        hobbies: req.body.hobbies,
        telefone: {
          create: {
            numero: req.body.numero_telefone,
            ddd: req.body.ddd_telefone,
          },
        },
      },
    });

    return res.json(aluno);
  }
);

app.put("/alunos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nome,
    idade,
    email,
    curso,
    hobbies,
    numero_telefone,
    ddd_telefone,
  } = req.body;

  try {
    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        nome,
        idade,
        email,
        curso,
        hobbies,
        telefone: {
          update: {
            numero: numero_telefone,
            ddd: ddd_telefone,
          },
        },
      },
    });

    return res.json(aluno);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/alunos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const aluno = await prisma.aluno.delete({
      where: { id },
    });

    return res.json({ message: `User ${id} deleted` });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(3333, () => "server running on port 3333");
