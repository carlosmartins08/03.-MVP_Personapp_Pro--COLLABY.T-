import assert from "node:assert";

import type { FastifyInstance } from "fastify";
import {
  RegisterRoutesConfig,
  RoutePlugin,
  RoutePluginOptions,
  RouteRegistration,
  registerRoutes,
} from "../routes/registerRoutes";

type RegisterCall = {
  plugin: RoutePlugin;
  options?: RoutePluginOptions;
};

class FakeApp {
  public calls: RegisterCall[] = [];

  public readonly register = async (
    plugin: RoutePlugin,
    options?: RoutePluginOptions
  ) => {
    this.calls.push({ plugin, options });
  };
}

const createRegistry = (entries: RouteRegistration[]): RouteRegistration[] => entries;

const runFilterTest = async () => {
  const app = new FakeApp();

  const firstPlugin: RoutePlugin = async () => {};
  const secondPlugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    { name: "keep", plugin: firstPlugin },
    {
      name: "skip",
      plugin: secondPlugin,
      condition: () => true,
    },
  ]);

  const config: RegisterRoutesConfig = {
    filter: (entry) => entry.name === "keep",
  };

  await registerRoutes(app as unknown as FastifyInstance, config, registry);

  assert.strictEqual(app.calls.length, 1, "filter should allow only one plugin");
  assert.strictEqual(
    app.calls[0].plugin,
    firstPlugin,
    "filter should keep expected plugin"
  );
};

const runOverridesTest = async () => {
  const app = new FakeApp();

  const targetPlugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    {
      name: "target",
      plugin: targetPlugin,
      options: { prefix: "/entry", logLevel: "info" },
    },
  ]);

  const config: RegisterRoutesConfig = {
    commonOptions: { prefix: "/api", logLevel: "debug" },
    overrides: {
      target: { prefix: "/override" },
    },
  };

  await registerRoutes(app as unknown as FastifyInstance, config, registry);

  assert.strictEqual(app.calls.length, 1, "override should not suppress registration");

  const [call] = app.calls;
  assert.deepStrictEqual(
    call.options,
    {
      prefix: "/override",
      logLevel: "info",
    },
    "overrides must merge with common and entry options"
  );
};

const runConditionTest = async () => {
  const app = new FakeApp();

  const plugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    {
      name: "condition",
      plugin,
      condition: () => false,
    },
  ]);

  await registerRoutes(app as unknown as FastifyInstance, {}, registry);

  assert.strictEqual(
    app.calls.length,
    0,
    "condition returning false should skip registration"
  );
};

const runConditionTrueTest = async () => {
  const app = new FakeApp();

  const plugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    {
      name: "condition",
      plugin,
      condition: () => true,
    },
  ]);

  await registerRoutes(app as unknown as FastifyInstance, {}, registry);

  assert.strictEqual(app.calls.length, 1, "condition returning true should register");
};

const runCommonOptionsTest = async () => {
  const app = new FakeApp();

  const plugin: RoutePlugin = async () => {};

  const registry = createRegistry([{ name: "common", plugin }]);

  await registerRoutes(
    app as unknown as FastifyInstance,
    { commonOptions: { prefix: "/api", logLevel: "debug" } },
    registry
  );

  assert.strictEqual(app.calls.length, 1, "common options should apply to entries");
  assert.deepStrictEqual(
    app.calls[0].options,
    { prefix: "/api", logLevel: "debug" },
    "common options should be forwarded when entry options are absent"
  );
};

const runOrderingTest = async () => {
  const app = new FakeApp();

  const firstPlugin: RoutePlugin = async () => {};
  const secondPlugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    { name: "first", plugin: firstPlugin },
    { name: "second", plugin: secondPlugin },
  ]);

  await registerRoutes(app as unknown as FastifyInstance, {}, registry);

  assert.strictEqual(app.calls.length, 2, "both registry entries must register");
  assert.strictEqual(app.calls[0].plugin, firstPlugin, "order must follow registry");
  assert.strictEqual(app.calls[1].plugin, secondPlugin, "order must follow registry");
};

const runMissingOverrideTest = async () => {
  const app = new FakeApp();

  const plugin: RoutePlugin = async () => {};

  const registry = createRegistry([{ name: "target", plugin }]);

  await registerRoutes(
    app as unknown as FastifyInstance,
    { overrides: { other: { prefix: "/unused" } } },
    registry
  );

  assert.strictEqual(app.calls.length, 1, "missing override should not stop registration");
  assert.strictEqual(app.calls[0].options, undefined, "entry options should stay undefined");
};

const runAnalyticsFilterFalseTest = async () => {
  const app = new FakeApp();

  const analyticsPlugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    {
      name: "analytics",
      plugin: analyticsPlugin,
      options: { prefix: "/analytics", logLevel: "debug" },
    },
  ]);

  const config: RegisterRoutesConfig = {
    filter: (entry) => entry.name !== "analytics",
  };

  await registerRoutes(app as unknown as FastifyInstance, config, registry);

  assert.strictEqual(app.calls.length, 0, "analytics entry should skip when disabled");
};

const runAnalyticsFilterTrueTest = async () => {
  const app = new FakeApp();

  const analyticsPlugin: RoutePlugin = async () => {};

  const registry = createRegistry([
    {
      name: "analytics",
      plugin: analyticsPlugin,
      options: { prefix: "/analytics", logLevel: "debug" },
    },
  ]);

  const config: RegisterRoutesConfig = {
    filter: (entry) => entry.name !== "analytics" || true,
  };

  await registerRoutes(app as unknown as FastifyInstance, config, registry);

  assert.strictEqual(app.calls.length, 1, "analytics entry should register when enabled");
  assert.deepStrictEqual(
    app.calls[0].options,
    { prefix: "/analytics", logLevel: "debug" },
    "analytics options should surface when route is registered"
  );
};

const runTests = async () => {
  await runFilterTest();
  await runOverridesTest();
  await runConditionTest();
  await runConditionTrueTest();
  await runCommonOptionsTest();
  await runOrderingTest();
  await runMissingOverrideTest();
  await runAnalyticsFilterFalseTest();
  await runAnalyticsFilterTrueTest();
};

runTests()
  .then(() => {
    console.log("registerRoutes tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
