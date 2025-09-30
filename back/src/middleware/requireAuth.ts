// back/src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!

export interface AuthRequest extends Request {
  user?: any
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' })
  }

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET)
    req.user = decoded // payload fourni par Supabase
    next()
  } catch (err) {
    console.error('Auth error:', err)
    return res.status(403).json({ message: 'Token invalide' })
  }
}
