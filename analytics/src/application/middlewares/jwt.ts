import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next): Promise<void> {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("Authorization header is required");
    const token = authorization.split(" ")[1];
    if (!token) throw new Error("JWT token is required");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.headers.playerId = decoded.id;
      next();
    } catch (e: any) {
      throw new Error("Invalid token");
    }
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}
