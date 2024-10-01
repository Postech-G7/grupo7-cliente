import { Pagamento } from "../../entities/pagamento";
import { PagamentoVersao } from "../../entities/pagamento.versao";

export interface IPagamento {
  criar: (pagamento: Pagamento) => Promise<PagamentoVersao | null>;
  buscaUltimaVersao: (
    identificadorExterno: string,
    cpf: string
  ) => Promise<Pagamento | null>;
}
