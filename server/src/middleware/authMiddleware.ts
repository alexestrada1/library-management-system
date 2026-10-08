import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Makes sure the request has a valid token.
export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  // The client sends: Authorization: Bearer <token>
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not logged in. Token missing." });
  }

  const token = header.split(" ")[1]; // grab the part after "Bearer "
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "Server is missing JWT_SECRET" });
  }

  try {
    // verify checks the signature AND the expiry. It throws if either is bad.
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// MIDDLEWARE 2: adminOnly
// Must run AFTER protect, because it reads req.user.
export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}
