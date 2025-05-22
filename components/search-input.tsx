"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ placeholder = "Buscar...", value, onChange, className = "" }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sincronizar el valor local con el valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Actualizar el valor externo después de un pequeño retraso para evitar demasiadas actualizaciones
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localValue, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="text" placeholder={placeholder} value={localValue} onChange={handleChange} className="pl-9 pr-10" />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-9 w-9"
          onClick={handleClear}
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpiar búsqueda</span>
        </Button>
      )}
    </div>
  )
}
