import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyRegisterOptions,
} from "fastify";

import { analyticsRoutes } from "./analytics";
import { alertasRoutes } from "./alertas";
import { authRoutes } from "./auth";
import { consultasRoutes } from "./consultas";
import { financeiroRoutes } from "./financeiro";
import { diarioRoutes } from "./diario";
import { notificacoesRoutes } from "./notificacoes";
import { pacientesRoutes } from "./pacientes";
import { profissionaisRoutes } from "./profissionais";
import { recibosRoutes } from "./recibos";
import { sessoesRoutes } from "./sessoes";
import { servicosRoutes } from "./servicos";
import { servicosContratadosRoutes } from "./servicos-contratados";
import { traducoesRoutes } from "./traducoes";
import { vinculosRoutes } from "./vinculos";

export type RoutePlugin = FastifyPluginAsync | FastifyPluginCallback;
export type RoutePluginOptions = FastifyRegisterOptions<FastifyPluginOptions>;

export interface RouteRegistration {
  name: string;
  plugin: RoutePlugin;
  options?: RoutePluginOptions;
  condition?: () => boolean;
}

export type RouteRegistry = RouteRegistration[];

const routeRegistry: RouteRegistry = [
  { name: "auth", plugin: authRoutes },
  { name: "pacientes", plugin: pacientesRoutes },
  { name: "profissionais", plugin: profissionaisRoutes },
  { name: "sessoes", plugin: sessoesRoutes },
  { name: "consultas", plugin: consultasRoutes },
  { name: "servicos", plugin: servicosRoutes },
  { name: "servicosContratados", plugin: servicosContratadosRoutes },
  { name: "recibos", plugin: recibosRoutes },
  { name: "alertas", plugin: alertasRoutes },
  { name: "analytics", plugin: analyticsRoutes },
  { name: "financeiro", plugin: financeiroRoutes },
  { name: "diario", plugin: diarioRoutes },
  { name: "vinculos", plugin: vinculosRoutes },
  { name: "notificacoes", plugin: notificacoesRoutes },
  { name: "traducoes", plugin: traducoesRoutes },
];

export interface RegisterRoutesConfig {
  commonOptions?: RoutePluginOptions;
  filter?: (entry: RouteRegistration) => boolean;
  overrides?: Partial<Record<RouteRegistration["name"], RoutePluginOptions>>;
}

function mergeOptions(
  ...items: Array<RoutePluginOptions | undefined>
): RoutePluginOptions | undefined {
  const merged = items
    .filter((item): item is RoutePluginOptions => Boolean(item))
    .reduce<RoutePluginOptions>((acc, entry) => ({ ...acc, ...entry }), {} as RoutePluginOptions);

  return Object.keys(merged).length ? merged : undefined;
}

export async function registerRoutes(
  app: FastifyInstance,
  config: RegisterRoutesConfig = {},
  registry: RouteRegistry = routeRegistry
) {
  const { commonOptions, filter, overrides } = config;

  for (const entry of registry) {
    if (entry.condition?.() === false) {
      continue;
    }

    if (filter && !filter(entry)) {
      continue;
    }

    const options = mergeOptions(
      commonOptions,
      entry.options,
      overrides?.[entry.name]
    );

    await app.register(entry.plugin, options);
  }
}
