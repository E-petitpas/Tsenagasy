import { Request, Response, NextFunction } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import prisma from '../config/db'

export async function addUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { mail, name } = req.body as { mail?: string | null; name?: string | null }

    const email = mail?.trim()
    if (!email) {
      return res.status(400).json({ message: "Le champ 'email' est requis" })
    }

    const user = await prisma.user.create({
      data: { email, name: name ?? null },
    })

    return res.status(201).json({ message: 'Ok', user })
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' })
    }
    return next(error)
  }
}
