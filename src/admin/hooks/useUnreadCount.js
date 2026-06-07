import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export function useUnreadCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
      setCount(count || 0)
    }
    fetch()
    const channel = supabase
      .channel('messages-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetch)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return count
}
