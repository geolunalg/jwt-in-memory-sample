// server.js
import jsonServer from "json-server";
import jwt from "jsonwebtoken";

const server = jsonServer.create();
const router = jsonServer.router("./server/db.json");
const middlewares = jsonServer.defaults();

const route = "/api/v1"

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post(`${route}/login`, (req, res) => {
  const { username, password } = req.body;

  // Fake authentication
  if (username !== "test@example.com" || password !== "password") {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      sub: "1",
      username,
      role: "user",
    },
    "fake-secret",
    {
      expiresIn: "1h",
    }
  );

  res.json({
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
});

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

server.use(`${route}/data`, requireAuth);
// Mount json-server under route
server.use(route, router);

server.listen(3000, () => {
  console.log("JSON Server running on http://localhost:3000");
});