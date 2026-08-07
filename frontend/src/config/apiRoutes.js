const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const apiRoutes = {
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    registerRecipient: `${API_BASE}/auth/register/recipient`,
    registerDonor: `${API_BASE}/auth/register/donor`,
  },
  profile: {
    get: `${API_BASE}/profile`,
    update: `${API_BASE}/profile`,
    uploadAvatar: `${API_BASE}/profile/avatar`,
  },
  donor: {
    listings: `${API_BASE}/donor/listings`,
    listing: (id) => `${API_BASE}/donor/listings/${id}`,
    pauseListing: (id) => `${API_BASE}/donor/listings/${id}/pause`,
    resumeListing: (id) => `${API_BASE}/donor/listings/${id}/resume`,
    cancelListing: (id) => `${API_BASE}/donor/listings/${id}/cancel`,
    donations: (id) => `${API_BASE}/donor/listings/${id}/donations`,
    manualDonation: `${API_BASE}/donor/manual-donation`,
    stats: `${API_BASE}/donor/stats`,
  },
  recipient: {
    browse: `${API_BASE}/recipient/listings`,
    reserve: (id) => `${API_BASE}/recipient/listings/${id}/reserve`,
    history: `${API_BASE}/recipient/history`,
    feedback: (id) => `${API_BASE}/recipient/collections/${id}/feedback`,
    preferences: `${API_BASE}/recipient/preferences`,
    premium: `${API_BASE}/recipient/premium`,
    wallet: `${API_BASE}/recipient/wallet`,
  },
  admin: {
    users: `${API_BASE}/admin/users`,
    toggleUser: (id) => `${API_BASE}/admin/users/${id}/toggle`,
    listings: `${API_BASE}/admin/listings`,
    cancelListing: (id) => `${API_BASE}/admin/listings/${id}/cancel`,
  },
  notifications: {
    list: `${API_BASE}/notifications`,
    markRead: (id) => `${API_BASE}/notifications/${id}/read`,
  },
}
