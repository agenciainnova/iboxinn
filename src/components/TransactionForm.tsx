"use client"

import { useState } from "react"
import { addTransaction } from "@/app/actions"
import { PlusCircle, MinusCircle, Image as ImageIcon } from "lucide-react"

export function TransactionForm() {
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoPreview(URL.createObjectURL(file))
    } else {
      setPhotoPreview(null)
    }
  }

  const action = async (formData: FormData) => {
    setLoading(true)
    try {
      await addTransaction(formData)
      const form = document.getElementById("tx-form") as HTMLFormElement
      form.reset()
      setPhotoPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="tx-form" action={action} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-base font-semibold text-slate-800 mb-3">Nueva Transacción</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <label className="cursor-pointer group">
          <input type="radio" name="type" value="ingreso" className="peer sr-only" defaultChecked />
          <div className="flex items-center justify-center p-2 rounded-xl border-2 border-slate-100 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-slate-50 transition-colors">
            <PlusCircle className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="font-medium text-sm text-emerald-700">Ingreso</span>
          </div>
        </label>
        
        <label className="cursor-pointer group">
          <input type="radio" name="type" value="egreso" className="peer sr-only" />
          <div className="flex items-center justify-center p-2 rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 hover:bg-slate-50 transition-colors">
            <MinusCircle className="w-4 h-4 text-rose-500 mr-2" />
            <span className="font-medium text-sm text-rose-700">Egreso</span>
          </div>
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-0.5">Monto ($)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-base"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-0.5">Concepto</label>
          <input
            type="text"
            name="concept"
            required
            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-sm"
            placeholder="Ej. Venta de producto, Pago de luz..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-0.5">Fecha</label>
          <input
            type="datetime-local"
            name="date"
            defaultValue={new Date().toISOString().slice(0, 16)}
            required
            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-0.5">Comprobante (Foto)</label>
          <div className="mt-1 flex justify-center px-4 pt-3 pb-4 border-2 border-slate-200 border-dashed rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-slate-50 relative overflow-hidden">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : null}
            <div className="space-y-1 text-center relative z-10">
              <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
              <div className="flex text-[11px] text-slate-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Subir una foto</span>
                  <input id="file-upload" name="photo" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhotoChange} />
                </label>
              </div>
              <p className="text-[10px] text-slate-500">PNG, JPG, GIF hasta 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-sm"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Guardar Transacción"
        )}
      </button>
    </form>
  )
}
