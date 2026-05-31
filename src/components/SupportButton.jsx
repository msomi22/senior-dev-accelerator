import { useState } from 'react';

import { siteConfig } from '../config/siteConfig.js';
import SupportOptionsModal from './SupportOptionsModal.jsx';

export default function SupportButton({ className = 'support-link' }) {
  const [open, setOpen] = useState(false);

  if (!siteConfig.paypal.enabled) return null;

  const { label, title, tooltip } = siteConfig.support;

  return (
    <>
      <button
        aria-haspopup="dialog"
        className={className}
        onClick={() => setOpen(true)}
        title={tooltip}
        type="button"
      >
        <span className="sr-only">{title}</span>
        {label}
      </button>
      {open ? <SupportOptionsModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
