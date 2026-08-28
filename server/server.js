// server.js
import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const server = jsonServer.create();
const router = jsonServer.router("./server/db.json");
const middlewares = jsonServer.defaults();

const route = "/api/v1"
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cookieParser());

// auth secret
const secret = "super-secure-fake-secret";

server.post(`${route}/login`, (req, res) => {
  const { username, password } = req.body;

  // Fake authentication
  if (username !== "test@example.com" || password !== "password") {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const seconds = 60; // true secons representation
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + seconds;
  const token = jwt.sign(
    {
      iss: "Fake Server", // service name
      sub: 1,
      iat: issuedAt,
      exp: expiresAt,
      type: "access" // this can be ommited
    },
    secret,
    {
      algorithm: "HS256",
    },
  );

  const refreshToken = jwt.sign(
    {
      sub: "1",
      type: "refresh",
    },
    "fake-refresh-secret",
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true when using HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
});

server.post(`${route}/refresh`, (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      "fake-refresh-secret"
    );

    const accessToken = jwt.sign(
      {
        sub: payload.sub,
        username: "test@example.com",
        role: "user",
      },
      "fake-secret",
      {
        expiresIn: "15m",
      }
    );

    res.json({
      accessToken,
      tokenType: "Bearer",
      expiresIn: 900,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
});

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, secret);
    console.log('Token is valid:', decoded);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token expired at:', err.expiredAt); // Access the specific expiration time
    } else {
      console.error('Invalid token:', err.message);
    }
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