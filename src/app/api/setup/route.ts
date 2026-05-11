import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username: "admin" }
    })

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" })
    }

    const password = await bcrypt.hash("admin123", 10)
    
    await prisma.user.create({
      data: {
        username: "admin",
        password,
      }
    })

    return NextResponse.json({ message: "Admin user created successfully!" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
