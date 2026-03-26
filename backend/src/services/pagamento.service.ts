import pagarme from "pagarme";

import { env } from "../env";

export type PagarmePaymentResult = {
  provider: "pagarme" | "fallback";
  status: "pago" | "pendente";
  transactionId?: string | null;
  raw?: unknown;
};

type PagarmeCustomer = {
  name: string;
  email?: string | null;
  cpf?: string | null;
  phone?: string | null;
};

type PagarmePaymentInput = {
  sessaoId: string;
  amount: number;
  customer: PagarmeCustomer;
  splitPercent: number;
};

const toCents = (value: number) => Math.max(0, Math.round(value * 100));

export const pagamentoService = {
  async processPagarmePayment(input: PagarmePaymentInput): Promise<PagarmePaymentResult> {
    if (!env.pagarMeApiKey) {
      return { provider: "fallback", status: "pago" };
    }

    const client = await pagarme.client.connect({ api_key: env.pagarMeApiKey });

    const amount = toCents(input.amount);

    if (amount <= 0) {
      throw new Error("Valor invalido para pagamento");
    }

    const customer: Record<string, unknown> = {
      external_id: `sessao-${input.sessaoId}`,
      name: input.customer.name,
      type: "individual",
      country: "br",
      email: input.customer.email ?? undefined,
      documents: input.customer.cpf
        ? [{ type: "cpf", number: input.customer.cpf }]
        : undefined,
      phone_numbers: input.customer.phone ? [input.customer.phone] : undefined,
    };

    const transaction = await client.transactions.create({
      amount,
      payment_method: "boleto",
      customer,
      metadata: {
        sessaoId: input.sessaoId,
        splitPercent: input.splitPercent,
      },
    });

    const status =
      transaction?.status === "paid" || transaction?.status === "authorized"
        ? "pago"
        : "pendente";

    return {
      provider: "pagarme",
      status,
      transactionId: transaction?.id ?? null,
      raw: transaction,
    };
  },
};
