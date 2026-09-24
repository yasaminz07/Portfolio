import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Public sections and the admin panel must use the same source of truth.
// Keep the bundled content visible only when Supabase cannot be reached; an
// empty successful response is respected so deleting every row also works.
export function usePortfolioData(table, fallback) {
  const [rows, setRows] = useState(fallback)

  useEffect(() => {
    let active = true

    const load = async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('sort_order')

      if (active && !error) setRows(data || [])
      if (error) console.error(`Unable to load ${table}:`, error.message)
    }

    load()
    return () => { active = false }
  }, [table])

  return rows
}
