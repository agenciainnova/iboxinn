import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers, changePassword, createUser } from "../actions"
import Link from "next/link"
import { ArrowLeft, UserPlus, Shield, User, Key, Save } from "lucide-react"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const isAdmin = session.user?.name === "admin"
  const users = isAdmin ? await getUsers() : []

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 pb-10 px-4 sm:max-w-3xl sm:pt-6">
      <div className="flex items-center gap-4 mb-6 pt-4">
        <Link href="/" className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Ajustes y Seguridad</h1>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Cambiar mi contraseña</h2>
          </div>
          
          <form action={changePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Actualizar Contraseña
            </button>
          </form>
        </section>

        {/* Admin Section: Create User */}
        {isAdmin && (
          <>
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Crear Nuevo Usuario</h2>
              </div>
              
              <form action={createUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Ej. cajero1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Contraseña Inicial</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Crear Usuario
                </button>
              </form>
            </section>

            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Usuarios Registrados</h2>
              </div>
              
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white rounded-full text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700">{u.username}</span>
                    </div>
                    {u.username === "admin" && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">SuperAdmin</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
