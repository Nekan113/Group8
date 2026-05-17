import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  fetchProfile, fetchHistory, depositWallet,
  subscribeLocal, createStripeCheckout,
} from './profilePageService';

export function useProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', result: '', gameType: '', sortDir: 'desc' });
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMsg, setDepositMsg] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    const { data, ok } = await fetchProfile();
    if (ok) {
      setProfile(data);
      updateUser(data);
    }
    setProfileLoading(false);
  }, [updateUser]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.result) params.result = filters.result;
    if (filters.gameType) params.gameType = filters.gameType;
    if (filters.sortDir) params.sortDir = filters.sortDir;

    const { data, ok } = await fetchHistory(params);
    if (ok) setHistory(Array.isArray(data) ? data : data.sessions ?? []);
    setHistoryLoading(false);
  }, [filters]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => { if (activeTab === 'history') loadHistory(); }, [activeTab, loadHistory]);

  const handleDeposit = useCallback(async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) { setDepositMsg('Enter a valid amount.'); return; }
    const { data, ok } = await depositWallet(amount);
    if (ok) {
      setDepositMsg(`Deposited $${amount.toFixed(2)} successfully.`);
      setProfile((p) => ({ ...p, walletBalance: data.balance }));
      setDepositAmount('');
    } else {
      setDepositMsg(data?.message || 'Deposit failed.');
    }
  }, [depositAmount]);

  const handleSubscribeLocal = useCallback(async () => {
    const { data, ok } = await subscribeLocal();
    if (ok) {
      setSubscribeMsg('Premium subscription activated!');
      setProfile((p) => ({ ...p, isPremium: true, premiumExpiry: data.expiry }));
      updateUser({ isPremium: true });
    } else {
      setSubscribeMsg(data?.message || 'Subscription failed. Check your wallet balance.');
    }
  }, [updateUser]);

  const handleStripeCheckout = useCallback(async () => {
    const { data, ok } = await createStripeCheckout();
    if (ok && data.url) window.location.href = data.url;
  }, []);

  const onProfileUpdated = useCallback((updated) => {
    setProfile((p) => ({ ...p, ...updated }));
    updateUser(updated);
  }, [updateUser]);

  return {
    profile, profileLoading,
    history, historyLoading,
    filters, setFilters,
    activeTab, setActiveTab,
    depositAmount, setDepositAmount,
    depositMsg, subscribeMsg,
    handleDeposit, handleSubscribeLocal, handleStripeCheckout,
    onProfileUpdated, loadHistory,
  };
}
