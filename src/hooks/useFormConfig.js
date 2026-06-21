import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Reusable hook to fetch and subscribe to form_configs by formKey.
 * Used by both public pages and admin panel.
 *
 * @param {string} formKey - 'workshop' | 'industry_visit'
 * @returns {{ config: object|null, loading: boolean, error: string|null, refetch: function }}
 */
export default function useFormConfig(formKey) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('form_configs')
        .select('*')
        .eq('form_key', formKey)
        .single();

      if (fetchError) {
        // If form_configs table doesn't exist yet, gracefully degrade
        if (fetchError.code === 'PGRST116' || fetchError.code === '42P01') {
          setConfig({ form_key: formKey, status: 'open', scheduled_open_at: null, title: null, description: null, schedule_info: null });
        } else {
          setError(fetchError.message);
        }
      } else {
        setConfig(data);
      }
    } catch (err) {
      // Gracefully degrade — default to open
      setConfig({ form_key: formKey, status: 'open', scheduled_open_at: null, title: null, description: null, schedule_info: null });
    } finally {
      setLoading(false);
    }
  }, [formKey]);

  useEffect(() => {
    fetchConfig();

    // Subscribe to Realtime changes on form_configs
    const channel = supabase
      .channel(`form-config-${formKey}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'form_configs',
          filter: `form_key=eq.${formKey}`,
        },
        (payload) => {
          setConfig(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formKey, fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
}
