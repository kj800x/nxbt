const execa = require("execa");
const localproxy = require("@kj800x/localproxy-client");
const process = require("process");

async function main() {
  const PORT = await localproxy.getAvailablePort();

  const webserver = execa("python3", ["-m", "nxbt.cli", "webapp", "-p", PORT], {
    stdio: "inherit",
    reject: false,
  });

  const localproxyConfig = {
    id: "nxbt",
    name: "NXBT",
    pid: webserver.pid,
    routes: [
      {
        static: false,
        route: "/",
        hostname: "localhost",
        port: PORT,
        trimRoute: false,
        priority: 0,
        type: "api"
      }
    ]
  }

  await localproxy.register(localproxyConfig);

  process.on("SIGINT", async () => {
    await localproxy.deregister(localproxyApp);
  });

  await webserver;
}

main().catch(console.error)
