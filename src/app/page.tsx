import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTransactions } from "./actions"
import { TransactionForm } from "@/components/TransactionForm"
import { Download, LogOut, ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { transactions, totalIngresos, totalEgresos, total } = await getTransactions()

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 pb-20 sm:max-w-3xl sm:pt-10">
      <header className="bg-blue-600 text-white p-6 rounded-b-3xl sm:rounded-3xl shadow-md mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
        <div className="relative z-10 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Wallet className="w-6 h-6 mr-2" /> Mi Caja
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-500/50 px-3 py-1 rounded-full">{session.user?.name}</span>
            <Link href="/api/auth/signout" className="p-2 bg-blue-700/50 hover:bg-blue-800/50 rounded-full transition-colors" title="Cerrar Sesión">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 text-center mb-4">
          <p className="text-blue-100 text-sm font-medium mb-1">Balance Total</p>
          <h2 className="text-5xl font-extrabold tracking-tight">
            ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center text-blue-100 text-xs mb-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Ingresos
            </div>
            <p className="text-lg font-semibold">${totalIngresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center text-blue-100 text-xs mb-1">
              <TrendingDown className="w-3 h-3 mr-1" /> Egresos
            </div>
            <p className="text-lg font-semibold">${totalEgresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <TransactionForm />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-slate-800">Últimos Movimientos</h3>
            <a 
              href="/api/export" 
              className="flex items-center text-sm text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <Download className="w-4 h-4 mr-1" /> Excel
            </a>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <ReceiptText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No hay movimientos aún</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${tx.type === 'ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {tx.type === "ingreso" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{tx.concept}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        {tx.date.toLocaleDateString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {tx.photoUrl && (
                          <a href={tx.photoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline flex items-center">
                            Ver foto
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'ingreso' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tx.type === 'ingreso' ? '+' : '-'}${tx.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
