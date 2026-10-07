import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, X } from 'lucide-react';
import QRCode from 'qrcode';

interface RemoteStatusBadgeProps {
  roomCode: string;
  connectedCount: number;
  isConnected: boolean;
  onOpenModal?: () => void;
}

export const RemoteStatusBadge: React.FC<RemoteStatusBadgeProps> = ({
  roomCode,
  connectedCount,
  isConnected,
  onOpenModal,
}) => {
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const controllerUrl = `${window.location.origin}${window.location.pathname}?mode=remote&room=${encodeURIComponent(roomCode)}`;

  useEffect(() => {
    if (!showQr) return;
    QRCode.toDataURL(controllerUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#ffffff', light: '#000000' },
    }).then(setQrDataUrl).catch(() => {});
  }, [showQr, controllerUrl]);

  return (
    <>
      <button
        className={`remote-badge ${connectedCount > 0 ? 'remote-badge--live' : ''}`}
        onClick={() => {
          if (onOpenModal) {
            onOpenModal();
          } else {
            setShowQr(true);
          }
        }}
        title={`Remote presenter — Room ${roomCode}. Click to show pairing QR code.`}
        aria-label={`Remote presenter control. ${connectedCount} device${connectedCount !== 1 ? 's' : ''} connected. Click to show pairing QR code.`}
      >
        {isConnected
          ? <Wifi size={12} />
          : <WifiOff size={12} color="var(--text-quaternary)" />
        }
        {connectedCount > 0 && (
          <span className="remote-badge-phones">
            <Smartphone size={11} />
            {connectedCount}
          </span>
        )}
        <span className="remote-badge-code">{roomCode}</span>
      </button>

      {showQr && (
        <div
          className="remote-qr-overlay"
          onClick={() => setShowQr(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Remote control QR code"
        >
          <div
            className="remote-qr-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="remote-qr-header">
              <span className="remote-qr-title">Remote Presenter Control</span>
              <button
                className="btn-action btn-icon"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
              >
                <X size={14} />
              </button>
            </div>
            <div className="remote-qr-body">
              {qrDataUrl
                ? <img src={qrDataUrl} alt={`QR code for room ${roomCode}`} width={200} height={200} />
                : <div className="remote-qr-loading">Generating…</div>
              }
              <div className="remote-qr-code-display">{roomCode}</div>
              <p className="remote-qr-instructions">
                Scan on your phone or open the URL and enter this room code.
                Both presenters can connect simultaneously.
              </p>
              <div className="remote-qr-url" title={controllerUrl}>
                {controllerUrl}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RemoteStatusBadge;
