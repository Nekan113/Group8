const BASE = '/api/subscription';

const subscriptionConfig = {
  subscribe: BASE,
  status: `${BASE}/status`,
  stripeCheckout: `${BASE}/stripe/checkout`,
  stripeWebhook: `${BASE}/stripe/webhook`,
};

export default subscriptionConfig;
