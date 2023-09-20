import { env, Postgres } from "@cubos/kube-templates";

export default [
  new Postgres(
    {
      name: "postgres",
      namespace: "grana-solidaria",
    },
    {
      version: "13.2",
      cpu: { request: "20m", limit: "100m" },
      memory: "128Mi",
      databases: [
        {
          name: "grana",
          users: ["grana"],
        },
      ],
      users: [
        {
          username: "grana",
          password: env.POSTGRES_PASSWORD,
        },
      ],
    },
  ),
];
