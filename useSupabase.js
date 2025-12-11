// src/hooks/useSupabase.js
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function useSupabase(tableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rows
  const fetchAll = async (orderBy = null, ascending = true) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(tableName).select("*");
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Insert a row
  const insert = async (row) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from(tableName).insert([row]);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a row by id
  const update = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a row by id
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAll, insert, update, remove, loading, error };
}