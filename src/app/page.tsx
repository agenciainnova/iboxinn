import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTransactions } from "./actions"
import { TransactionForm } from "@/components/TransactionForm"
import { ExportButton } from "@/components/ExportButton"
import { Download, LogOut, ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function Home({ searchParams }: { searchParams: { caja?: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const currentWallet = searchParams.caja === "trabajo" ? "trabajo" : "personal"
  const { transactions, totalIngresos, totalEgresos, total } = await getTransactions(currentWallet)

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 pb-10 sm:max-w-3xl sm:pt-6">
      {/* Wallet Switcher Tabs */}
      <div className="flex bg-slate-200/50 p-1 mx-4 sm:mx-0 mt-4 sm:mt-0 mb-4 rounded-xl">
        <Link 
          href="/?caja=personal" 
          className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${currentWallet === 'personal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Personal
        </Link>
        <Link 
          href="/?caja=trabajo" 
          className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${currentWallet === 'trabajo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Trabajo
        </Link>
      </div>

      <header className="bg-blue-600 text-white p-4 rounded-2xl sm:rounded-3xl shadow-md mb-4 mx-4 sm:mx-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
        <div className="relative z-10 flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold flex items-center">
            <Wallet className="w-5 h-5 mr-2" /> {currentWallet === 'trabajo' ? 'Caja de Trabajo' : 'Mi Caja Personal'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500/50 px-2.5 py-1 rounded-full">{session.user?.name}</span>
            <Link href="/api/auth/signout" className="p-1.5 bg-blue-700/50 hover:bg-blue-800/50 rounded-full transition-colors" title="Cerrar Sesión">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 text-center mb-3">
          <p className="text-blue-100 text-xs font-medium mb-0.5">Balance Total</p>
          <h2 className="text-4xl font-extrabold tracking-tight">
            ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-blue-100 text-[10px] mb-0.5 uppercase tracking-wider font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" /> Ingresos
            </div>
            <p className="text-base font-semibold">${totalIngresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-blue-100 text-[10px] mb-0.5 uppercase tracking-wider font-semibold">
              <TrendingDown className="w-3 h-3 mr-1" /> Egresos
            </div>
            <p className="text-base font-semibold">${totalEgresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <TransactionForm currentWallet={currentWallet} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-base font-bold text-slate-800">Últimos Movimientos</h3>
            <ExportButton currentWallet={currentWallet} />
          </div>

          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-xl border border-slate-100">
                <ReceiptText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">No hay movimientos aún</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className={`p-2.5 rounded-full mr-3 ${tx.type === 'ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {tx.type === "ingreso" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800 leading-tight">{tx.concept}</p>
                      <div className="flex items-center text-[11px] text-slate-500 mt-0.5">
                        {tx.date.toLocaleDateString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {tx.photoUrl && (
                          <a href={tx.photoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline flex items-center">
                            Ver foto
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${tx.type === 'ingreso' ? 'text-emerald-600' : 'text-slate-800'}`}>
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
