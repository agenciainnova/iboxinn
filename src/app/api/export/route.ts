import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import * as xlsx from "xlsx"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const wallet = searchParams.get("wallet") || "personal"

    const dateFilter = start && end ? {
      date: {
        gte: new Date(start),
        lte: new Date(end),
      }
    } : {}

    const transactions = await prisma.transaction.findMany({
      where: { ...dateFilter, wallet },
      orderBy: { date: "asc" },
    })

    const data = transactions.map((t) => ({
      Fecha: t.date.toISOString().split("T")[0],
      Tipo: t.type === "ingreso" ? "Ingreso" : "Egreso",
      Concepto: t.concept,
      Monto: t.amount,
    }))

    const totalIngresos = transactions
      .filter((t) => t.type === "ingreso")
      .reduce((acc, t) => acc + t.amount, 0)
      
    const totalEgresos = transactions
      .filter((t) => t.type === "egreso")
      .reduce((acc, t) => acc + t.amount, 0)

    const balance = totalIngresos - totalEgresos

    // Add empty rows and totals at the end
    data.push({ Fecha: "", Tipo: "", Concepto: "", Monto: null as any })
    data.push({ Fecha: "", Tipo: "", Concepto: "Total Ingresos", Monto: totalIngresos })
    data.push({ Fecha: "", Tipo: "", Concepto: "Total Egresos", Monto: totalEgresos })
    data.push({ Fecha: "", Tipo: "", Concepto: "Balance Total", Monto: balance })

    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, "Caja")

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="caja_${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  } catch (error) {
    return new Response("Error generating excel", { status: 500 })
  }
}
