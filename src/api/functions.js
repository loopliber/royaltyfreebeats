import { base44 } from './base44Client';

// Temporary mock functions for testing during migration
export const createCheckoutSession = (data) => {
  console.log('Mock createCheckoutSession called with:', data);
  return Promise.resolve({
    sessionId: 'mock_session_id',
    url: 'https://checkout.stripe.com/mock'
  });
};

export const getCheckoutSession = (sessionId) => {
  console.log('Mock getCheckoutSession called with:', sessionId);
  return Promise.resolve({
    success: true,
    purchases: []
  });
};

export const stripeWebhook = (data) => {
  console.log('Mock stripeWebhook called with:', data);
  return Promise.resolve({ received: true });
};

export const generateLicensePDF = (purchaseId) => {
  console.log('Mock generateLicensePDF called with:', purchaseId);
  return Promise.resolve({
    success: true,
    licenseUrl: 'https://example.com/mock-license.pdf'
  });
};

