"use client"

import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions"
import { useState } from "react"

export function DeleteUserButton({ userId, username }: { userId: string, username: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      setIsDeleting(true)
      try {
        await deleteUser(userId)
      } catch (error) {
        alert("Error al eliminar usuario")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
      title="Eliminar Usuario"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
