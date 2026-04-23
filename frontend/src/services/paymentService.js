import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const paymentService = {
  depositWallet: (payload) => http.post(API_ROUTES.premium.walletDeposit, payload),
  subscribe: (payload) => http.post(API_ROUTES.premium.subscribe, payload),
};