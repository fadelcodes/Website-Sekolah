import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export function useAutosave(table, initialData = null) {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Auto-save with debounce
  useEffect(() => {
    if (!hasUnsavedChanges || !data) return

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      try {
        const { error } = await supabase
          .from(table)
          .upsert(data)

        if (error) throw error
        
        toast.success('Data tersimpan otomatis', { duration: 2000 })
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Autosave error:', error)
        toast.error('Gagal menyimpan otomatis')
      } finally {
        setIsSaving(false)
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [data, hasUnsavedChanges, table])

  const updateData = useCallback((newData) => {
    setData(newData)
    setHasUnsavedChanges(true)
  }, [])

  const manualSave = useCallback(async () => {
    if (!data) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from(table)
        .upsert(data)

      if (error) throw error
      
      toast.success('Data berhasil disimpan')
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Manual save error:', error)
      toast.error('Gagal menyimpan data')
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [data, table])

  return {
    data,
    updateData,
    isSaving,
    hasUnsavedChanges,
    manualSave,
  }
}