export const siteConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Senior Dev Accelerator',
  tagline: import.meta.env.VITE_APP_TAGLINE || 'DSA + System Design mastery for junior and mid-level developers',
  storageKey: import.meta.env.VITE_STORAGE_KEY || 'senior-dev-accelerator:v2',
  paypal: {
    enabled: import.meta.env.VITE_PAYPAL_ENABLED !== 'false',
    label: import.meta.env.VITE_PAYPAL_LABEL || '☕ Buy me a coffee',
    hostedButtonId: import.meta.env.VITE_PAYPAL_HOSTED_BUTTON_ID || 'REPLACE_WITH_YOUR_PAYPAL_HOSTED_BUTTON_ID',
    currencyCode: import.meta.env.VITE_PAYPAL_CURRENCY || 'USD'
  }
};
