const http = require("node:http");

const PORT = Number(process.env.PORT) || 10000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    res.writeHead(200);
    res.end(JSON.stringify({
      app: "AXIS",
      status: "online",
      message: "Backend AXIS funcionando!"
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    error: "Rota não encontrada"
  }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AXIS backend iniciado na porta ${PORT}`);
});