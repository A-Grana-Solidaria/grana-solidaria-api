import { env, StatelessApp } from "@cubos/kube-templates";

export default [
  new StatelessApp(
    {
      name: "api",
      namespace: "grana-solidaria",
    },
    {
      replicas: 2,
      image: `${env.CI_REGISTRY_IMAGE}:v${env.CI_PIPELINE_ID}`,
      cpu: { request: "10m", limit: "200m" },
      memory: { request: "10Mi", limit: "200Mi" },
      envs: {
        DB_USER: "grana",
        DB_HOST: "postgres",
        DB_PW: env.POSTGRES_PASSWORD,
        DB_NAME: "grana",
        DB_PORT: 5432,
        FRONTEND_DOMAIN: "https://app.granasolidaria.com.br",
      },
      forwardEnvs: [
        "ADMIN_EMAIL",
        "ADMIN_PASS",
        "JWT_SECRET",
        "MAILTRAP_HOST",
        "MAILTRAP_PORT",
        "MAILTRAP_USER",
        "MAILTRAP_PASS",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "S3_BUCKET",
      ],
      ports: [
        {
          type: "http",
          name: "http",
          port: 8081,
          publicUrl: "https://api.granasolidaria.com.br/",
          tlsCert: "cert-api-granasolidaria-com-br",
        },
        {
          type: "http",
          name: "debug",
          port: 9229,
        },
      ],
      check: {
        port: 8081,
        httpGetPath: "/",
      },
    },
  ),
];
