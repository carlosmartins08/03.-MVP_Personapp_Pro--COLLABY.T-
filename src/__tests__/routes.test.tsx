import { describe, expect, it, vi } from "vitest";
import type { RouteObject } from "react-router-dom";
import { createRoutesFromElements, matchRoutes } from "react-router-dom";
import { appRouteElements } from "@/routes/appRoutes";

vi.mock("@/components/auth/RouteGuard", () => ({
  RouteGuard: ({ children }: { children?: unknown }) => children,
}));

vi.mock("@/components/layout/LayoutProfissional", () => ({
  LayoutProfissional: () => null,
}));

vi.mock("@/components/layout/LayoutPaciente", () => ({
  LayoutPaciente: () => null,
}));

vi.mock("@/pages/Login", () => ({ default: () => null }));
vi.mock("@/pages/RecuperarSenha", () => ({ default: () => null }));
vi.mock("@/pages/RedefinirSenha", () => ({ default: () => null }));
vi.mock("@/pages/VerificarEmail", () => ({ default: () => null }));
vi.mock("@/pages/NotFound", () => ({ default: () => null }));
vi.mock("@/pages/DashboardPrincipalPsicologo", () => ({ default: () => null }));
vi.mock("@/components/profissional/DashboardProfissional", () => ({ default: () => null }));
vi.mock("@/components/profissional/DashboardFinanceiro", () => ({ default: () => null }));
vi.mock("@/pages/TelaPacientes", () => ({ default: () => null }));
vi.mock("@/pages/TelaPerfilPaciente", () => ({ default: () => null }));
vi.mock("@/pages/TelaEvolucaoPaciente", () => ({ default: () => null }));
vi.mock("@/pages/TelaAgendaSemanal", () => ({ default: () => null }));
vi.mock("@/pages/TelaSessoes", () => ({ default: () => null }));
vi.mock("@/pages/TelaSessaoDetalhada", () => ({ default: () => null }));
vi.mock("@/pages/TelaServicos", () => ({ default: () => null }));
vi.mock("@/pages/TelaFinanceiro", () => ({ default: () => null }));
vi.mock("@/pages/TelaAlertasClinicos", () => ({ default: () => null }));
vi.mock("@/pages/TelaConfigConta", () => ({ default: () => null }));
vi.mock("@/pages/TelaComportamentoPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaResumoPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaSessoesPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaDiarioPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaPagamentosPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaRecibosPaciente", () => ({ default: () => null }));
vi.mock("@/pages/paciente/TelaPerfilPacienteAutenticado", () => ({ default: () => null }));
vi.mock("@/components/paciente/DashboardPacienteMobile", () => ({ default: () => null }));

type FlatRoute = {
  fullPath: string;
  route: RouteObject;
};

const joinPaths = (base: string, segment?: string) => {
  if (!segment) return base || "/";
  if (segment.startsWith("/")) return segment;
  if (!base || base === "/") return `/${segment}`;
  return `${base}/${segment}`;
};

const normalizePath = (path: string) => {
  if (!path) return "/";
  const normalized = path.replace(/\/+/g, "/");
  if (normalized === "/") return "/";
  return normalized.replace(/\/$/, "");
};

const flattenRoutes = (routes: RouteObject[], basePath = ""): FlatRoute[] => {
  const result: FlatRoute[] = [];

  for (const route of routes) {
    const hasPath = typeof route.path === "string";
    const currentPath = route.index
      ? basePath || "/"
      : hasPath
      ? joinPaths(basePath, route.path)
      : basePath || "/";

    if (route.children?.length) {
      result.push({ fullPath: normalizePath(currentPath), route });
      result.push(...flattenRoutes(route.children, currentPath));
      continue;
    }

    if (route.index || hasPath) {
      result.push({ fullPath: normalizePath(currentPath), route });
    }
  }

  return result;
};

const samplePath = (path: string) => {
  if (path === "*") return "/rota-nao-existe";
  const normalized = normalizePath(path);
  const replaced = normalized
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) return "exemplo";
      if (segment === "*") return "exemplo";
      return segment;
    })
    .join("/");

  return replaced || "/";
};

describe("App routes", () => {
  const routes = createRoutesFromElements(appRouteElements);
  const flatRoutes = flattenRoutes(routes);
  const wildcard = flatRoutes.find((entry) => entry.route.path === "*");
  const testable = flatRoutes.filter((entry) => entry.route.path !== "*");

  it("matches every configured route path", () => {
    for (const entry of testable) {
      const path = samplePath(entry.fullPath);
      const matches = matchRoutes(routes, path);

      expect(matches, `expected match for ${path}`).not.toBeNull();
      expect(matches?.[matches.length - 1]?.route).toBe(entry.route);
    }
  });

  it("matches the not found route for unknown paths", () => {
    expect(wildcard, "wildcard route not configured").toBeDefined();

    const matches = matchRoutes(routes, "/rota-inexistente");
    expect(matches?.[matches.length - 1]?.route.path).toBe("*");
  });
});
