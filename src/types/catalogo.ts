export type Produto = {
  id: string;
  nome: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  preco: number | null;
  categoria: string;
  imagem: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem: string | null;
  textoBotao: string;
  linkBotao: string;
  atualizadoEm: string;
};

export type AdminUser = {
  nome: string;
  email: string;
};
