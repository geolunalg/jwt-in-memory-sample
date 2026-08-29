// server.js
import cookieParser from "cookie-parser";
import crypto from "crypto";
import jsonServer from "json-server";
import jwt from "jsonwebtoken";

const server = jsonServer.create();
const router = jsonServer.router("./server/db.json");
const middlewares = jsonServer.defaults();

const route = "/api/v1"
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(cookieParser());

// secret: Used to sign access token, normally really long string
// stored as a environment variable 
const secret = "super-secure-fake-secret";

// refreshToken: On a real server this will be stored on a db table
// for this example will just store it in memory
const rfStorage = {};

// create a new access token for authentication,
// token expires after one minute
function getAccessToken() {
  const seconds = 60; // true seconds representation
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
  return token;
}

// creates a new refresh token for authentication
// and stores it in memory for 1 hour
function getRefreshToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hour = 60 * 60 * 1000; // (1hr)
  const createdAt = Date.now();
  const expiresAt = createdAt + hour;
  rfStorage.refreshToken = {
    token,
    createdAt,
    expiresAt,
  }

  return rfStorage.refreshToken.token;
}

server.post(`${route}/login`, (req, res) => {
  const { username, password } = req.body;

  // Fake authentication
  if (username !== "test@example.com" || password !== "password") {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const refreshToken = getRefreshToken();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true when using HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // tell the client to clear the cookie after 1hr
  });

  const accessToken = getAccessToken();
  res.json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: 60, // (seconds)
  });
});

server.post(`${route}/refresh`, (req, res) => {
  const currRfToken = req.cookies.refreshToken;

  // check that the refresh token is valid
  if (!currRfToken || currRfToken != rfStorage?.refreshToken?.token) {
    return res.status(401).json({
      message: "Refresh token is unauthorized",
    });
  }

  // check the refresh token has not expired
  if (Date.now() > rfStorage.refreshToken.expiresAt) {
    return res.status(401).json({
      message: "Refresh token has expired",
    });
  }

  // When the refresh token is used discard it, and send a new
  // refresh token cookie. This will update the value in the client
  const refreshToken = getRefreshToken();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true when using HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // tell the client to clear the cookie after 1hr
  });

  // create a new access token and send it to the client
  const accessToken = getAccessToken();
  res.json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
});

// middleware to check authenticaion for json-server routes in db.json
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