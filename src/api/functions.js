import { base44 } from './base44Client';


export const createCheckoutSession = base44.functions.createCheckoutSession;

export const getCheckoutSession = base44.functions.getCheckoutSession;

export const stripeWebhook = base44.functions.stripeWebhook;

export const generateLicensePDF = base44.functions.generateLicensePDF;

