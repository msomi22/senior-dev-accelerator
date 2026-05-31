import { useState } from 'react';
import { createPortal } from 'react-dom';

import { siteConfig } from '../config/siteConfig.js';
import { getEnabledSupportMethods } from '../services/supportPaymentService.js';
import SupportOptionsModal from './SupportOptionsModal.jsx';

export default function SupportButton({ className = 'support-link' }) {
  const [open, setOpen] = useState(false);
  const methods = getEnabledSupportMethods();

  if (methods.length === 0) return null;

  const { label, title, tooltip } = siteConfig.support;
  const shouldRenderModal = open && typeof document !== 'undefined';

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
      {shouldRenderModal
        ? createPortal(<SupportOptionsModal onClose={() => setOpen(false)} />, document.body)
        : null}
    </>
  );
}
