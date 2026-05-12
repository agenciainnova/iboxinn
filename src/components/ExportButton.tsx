"use client"

import { useState } from "react"
import { Download, X } from "lucide-react"

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  // default to first day of current month
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const [startDate, setStartDate] = useState(firstDay.toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0])

  const handleDownload = () => {
    // Append time to ensure the whole end day is included
    const start = new Date(startDate).toISOString()
    const end = new Date(`${endDate}T23:59:59.999Z`).toISOString()
    
    window.location.href = `/api/export?start=${start}&end=${end}`
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center text-sm text-blue-600 font-medium hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
      >
        <Download className="w-4 h-4 mr-1" /> Excel
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-slate-800 mb-4">Exportar a Excel</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center mt-2"
              >
                <Download className="w-4 h-4 mr-2" /> Descargar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
