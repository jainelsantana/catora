import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@catalogoora.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "CatalogoOra@2026";
  const adminName = process.env.ADMIN_NAME ?? "Administrador CatalogoOra";
  const senhaHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      nome: adminName,
      senhaHash
    },
    create: {
      nome: adminName,
      email: adminEmail,
      senhaHash
    }
  });

  const existingBanner = await prisma.banner.findFirst();
  if (!existingBanner) {
    await prisma.banner.create({
      data: {
        titulo: "Novidades selecionadas para sua vitrine",
        subtitulo:
          "Explore produtos com curadoria, imagens atraentes e uma experiencia leve para encontrar exatamente o que combina com voce.",
        imagem:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
        textoBotao: "Ver produtos",
        linkBotao: "#produtos"
      }
    });
  }

  const produtos = [
    {
      nome: "Luminaria Aura",
      descricaoCurta: "Luminaria de mesa com luz quente e acabamento premium.",
      descricaoCompleta:
        "A Luminaria Aura combina metal escovado, cupula minimalista e controle de intensidade para criar uma luz acolhedora em escritorios, quartos e areas de leitura.",
      preco: 289.9,
      categoria: "Decoracao",
      imagem:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
      ativo: true
    },
    {
      nome: "Mochila Urbana Flex",
      descricaoCurta: "Mochila resistente para rotina, trabalho e viagens curtas.",
      descricaoCompleta:
        "Modelo em tecido impermeavel, compartimento acolchoado para notebook, bolsos internos e alcas ergonomicas para uso diario com conforto.",
      preco: 349.0,
      categoria: "Acessorios",
      imagem:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
      ativo: true
    },
    {
      nome: "Kit Cafe Essencial",
      descricaoCurta: "Conjunto elegante para preparo manual de cafe.",
      descricaoCompleta:
        "Inclui jarra, porta-filtro, medidor e filtros reutilizaveis. Ideal para quem busca um ritual pratico sem abrir mao de apresentacao.",
      preco: 199.5,
      categoria: "Casa",
      imagem:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
      ativo: true
    },
    {
      nome: "Organizador Modulo",
      descricaoCurta: "Organizador modular para mesa e prateleiras.",
      descricaoCompleta:
        "Pecas encaixaveis com divisorias ajustaveis para manter itens pequenos, papelaria e acessorios sempre visiveis e bem acomodados.",
      preco: null,
      categoria: "Organizacao",
      imagem:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85",
      ativo: true
    }
  ];

  for (const produto of produtos) {
    const exists = await prisma.produto.findFirst({ where: { nome: produto.nome } });
    if (!exists) {
      await prisma.produto.create({ data: produto });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
