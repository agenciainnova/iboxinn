import { prisma } from "@/lib/prisma"
import * as xlsx from "xlsx"

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    })

    const data = transactions.map((t) => ({
      Fecha: t.date.toISOString().split("T")[0],
      Tipo: t.type === "ingreso" ? "Ingreso" : "Egreso",
      Concepto: t.concept,
      Monto: t.amount,
    }))

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
