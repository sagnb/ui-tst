import { runDeploy } from "./run-deploy";

// Resolves only once the deployment should actually terminate — while
// every service is healthy, startServices' promise (inside runDeploy)
// simply never resolves, which is what keeps this process alive.
const code = await runDeploy();
process.exit(code);
