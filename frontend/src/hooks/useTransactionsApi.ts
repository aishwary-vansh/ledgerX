// src/hooks/useTransactionsApi.ts
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in replacement for the mock TransactionContext when the backend is live.
// Handles loading, error, optimistic mutations, and analytics fetching.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  transactionsApi,
  Transaction,
  TransactionQuery,
  Summary,
  MonthlyEntry,
  CategoryEntry,
  MoMResult,
  CreateTransactionPayload,
  ApiError,
} from '../services/api';

// ── Generic async state helper ──────────────────────────────────────────────
function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fn());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}

// ── Main hook ───────────────────────────────────────────────────────────────
export function useTransactionsApi() {
  // ── Filter / sort state ──────────────────────────────────────────────────
  const [query, setQuery] = useState<TransactionQuery>({
    page: 1, limit: 20, sortBy: 'date', sortDir: 'desc',
  });

  // ── Transactions list ────────────────────────────────────────────────────
  const { data: listResult, loading: listLoading, error: listError, refetch } =
    useAsync(() => transactionsApi.list(query), [JSON.stringify(query)]);

  // ── Analytics (fetched once, refetch after mutations) ────────────────────
  const { data: summary, refetch: refetchSummary } =
    useAsync(() => transactionsApi.summary(), []);

  const { data: monthly, refetch: refetchMonthly } =
    useAsync(() => transactionsApi.monthly(), []);

  const { data: categories, refetch: refetchCategories } =
    useAsync(() => transactionsApi.categories(), []);

  const { data: mom } =
    useAsync(() => transactionsApi.mom(), []);

  // ── Refresh all ──────────────────────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    await Promise.all([refetch(), refetchSummary(), refetchMonthly(), refetchCategories()]);
  }, [refetch, refetchSummary, refetchMonthly, refetchCategories]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const [mutating, setMutating] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);

  const withMutation = async (fn: () => Promise<void>) => {
    setMutating(true);
    setMutateError(null);
    try {
      await fn();
      await refreshAll();
    } catch (e) {
      setMutateError(e instanceof ApiError ? e.message : 'Operation failed');
      throw e;
    } finally {
      setMutating(false);
    }
  };

  const addTransaction = (payload: CreateTransactionPayload) =>
    withMutation(() => transactionsApi.create(payload) as Promise<any>);

  const editTransaction = (id: string, payload: Partial<CreateTransactionPayload>) =>
    withMutation(() => transactionsApi.update(id, payload) as Promise<any>);

  const deleteTransaction = (id: string) =>
    withMutation(() => transactionsApi.remove(id) as Promise<any>);

  // ── Filter helpers ────────────────────────────────────────────────────────
  const setSearch = (search: string) =>
    setQuery((q) => ({ ...q, search, page: 1 }));

  const setFilterType = (type: TransactionQuery['type']) =>
    setQuery((q) => ({ ...q, type, page: 1 }));

  const setFilterCategory = (category: string) =>
    setQuery((q) => ({ ...q, category, page: 1 }));

  const setPage = (page: number) => setQuery((q) => ({ ...q, page }));

  const toggleSort = (sortBy: string) =>
    setQuery((q) => ({
      ...q,
      sortBy,
      sortDir: q.sortBy === sortBy && q.sortDir === 'desc' ? 'asc' : 'desc',
    }));

  const resetFilters = () =>
    setQuery({ page: 1, limit: 20, sortBy: 'date', sortDir: 'desc' });

  return {
    // Data
    transactions: listResult?.data ?? [],
    pagination: listResult?.pagination ?? null,
    summary: summary as Summary | null,
    monthly: (monthly ?? []) as MonthlyEntry[],
    categories: (categories ?? []) as CategoryEntry[],
    mom: mom as MoMResult | null,

    // Loading / error
    loading: listLoading,
    error: listError,
    mutating,
    mutateError,

    // Filter state (for UI binding)
    query,
    setSearch,
    setFilterType,
    setFilterCategory,
    setPage,
    toggleSort,
    resetFilters,

    // Mutations
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshAll,
  };
}
