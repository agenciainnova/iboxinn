"use client"

import { Trash2 } from "lucide-react"
import { deleteTransaction } from "@/app/actions"
import { useState } from "react"

export function DeleteTransactionButton({ id, concept }: { id: string, concept: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`¿Eliminar la transacción "${concept}"?`)) {
      setIsDeleting(true)
      try {
        await deleteTransaction(id)
      } catch (error) {
        alert("Error al eliminar la transacción")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50 ml-2"
      title="Eliminar Movimiento"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
