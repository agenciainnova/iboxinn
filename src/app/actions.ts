"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"

export async function addTransaction(formData: FormData) {
  const type = formData.get("type") as string
  const amount = parseFloat(formData.get("amount") as string)
  const concept = formData.get("concept") as string
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()
  const photo = formData.get("photo") as File | null

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
    },
  })

  revalidatePath("/")
}

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
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
