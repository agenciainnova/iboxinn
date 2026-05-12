"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function WalletTabs() {
  const searchParams = useSearchParams()
  const caja = searchParams.get("caja")
  const currentWallet = caja === "trabajo" ? "trabajo" : "personal"

  return (
    <div className="flex bg-slate-200/50 p-1 mx-4 sm:mx-0 mt-4 sm:mt-0 mb-4 rounded-xl">
      <Link 
        href="/?caja=personal" 
        replace
        className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${currentWallet === 'personal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        Personal
      </Link>
      <Link 
        href="/?caja=trabajo" 
        replace
        className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${currentWallet === 'trabajo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        Trabajo
      </Link>
    </div>
  )
}
