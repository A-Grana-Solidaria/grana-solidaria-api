import { CertificateV1 } from "@cubos/kube-templates";

export default [
  new CertificateV1(
    { namespace: "grana-solidaria" },
    { issuer: "letsencrypt-http", domain: "api.granasolidaria.com.br" },
  ),
];
