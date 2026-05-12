"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function addTransaction(formData: FormData) {
  const type = formData.get("type") as string
  const amount = parseFloat(formData.get("amount") as string)
  const concept = formData.get("concept") as string
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()
  const photo = formData.get("photo") as File | null
  const wallet = (formData.get("wallet") as string) || "personal"

  let photoUrl = null

  if (photo && photo.size > 0) {
    const blob = await put(photo.name, photo, {
      access: 'public',
    })
    photoUrl = blob.url
  }

  await prisma.transaction.create({
    data: {
      type,
      amount,
      concept,
      date,
      photoUrl,
      wallet,
    },
  })

  revalidatePath("/")
}

export async function getTransactions(wallet: string = "personal") {
  const transactions = await prisma.transaction.findMany({
    where: { wallet },
    orderBy: { date: "desc" },
  })
  
  const totalIngresos = transactions
    .filter((t) => t.type === "ingreso")
    .reduce((acc, t) => acc + t.amount, 0)
    
  const totalEgresos = transactions
    .filter((t) => t.type === "egreso")
    .reduce((acc, t) => acc + t.amount, 0)
    
  const total = totalIngresos - totalEgresos
  
  return {
    transactions,
    totalIngresos,
    totalEgresos,
    total,
  }
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("No autorizado")

  const newPassword = formData.get("newPassword") as string
  if (!newPassword || newPassword.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres")
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { username: session.user.name as string },
    data: { password: hashedPassword },
  })

  revalidatePath("/settings")
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (session?.user?.name !== "admin") throw new Error("Solo el administrador puede crear usuarios")

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) throw new Error("Campos requeridos")

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })

  revalidatePath("/settings")
}

export async function getUsers() {
  const session = await getServerSession(authOptions)
  if (session?.user?.name !== "admin") return []

  return prisma.user.findMany({
    select: { id: true, username: true },
    orderBy: { username: "asc" },
  })
}
export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.name !== "admin") throw new Error("No autorizado")

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.username === "admin") throw new Error("No puedes eliminar al administrador principal")

  await prisma.user.delete({
    where: { id: userId },
  })

  revalidatePath("/settings")
}
