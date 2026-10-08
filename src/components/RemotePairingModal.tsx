import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Copy,
  Check,
  X,
  Radio,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { copyText } from '../utils/clipboard';

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];

interface RemotePairingModalProps {
  roomCode: string;
  connectedCount: number;
  isStageOnline: boolean;
  latestSpeakerName: string | null;
  onClose: () => void;
}

export const RemotePairingModal: React.FC<RemotePairingModalProps> = ({
  roomCode,
  connectedCount,
  isStageOnline,
  latestSpeakerName,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Construct absolute URL for the phone to open
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wafpresentation.vercel.app';
  // A phone cannot reach "localhost" on this laptop, so a QR code built from it can never work
  const isLocalOnlyOrigin = typeof window !== 'undefined' && LOCAL_HOSTNAMES.includes(window.location.hostname);
  const remoteUrl = `${origin}/?mode=remote&room=${encodeURIComponent(roomCode)}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(remoteUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#0b0d10'
      },
      errorCorrectionLevel: 'M'
    }).then(url => {
      if (isMounted) setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR code', err);
    });

    return () => {
      isMounted = false;
    };
  }, [remoteUrl]);

  const handleCopyLink = () => {
    soundFX.playClick();
    copyText(remoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label="Speaker Remote Pairing">
      <div className="presenter-dialog prompter-sheet" style={{ maxWidth: 580, maxHeight: '92dvh' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--separator-subtle)', paddingBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(255, 153, 0, 0.12)', border: '1px solid rgba(255, 153, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={22} color="var(--accent)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Dual-Phone Presenter Remote
                </h2>
                <span className="badge badge-accent" style={{ fontSize: 10, padding: '2px 8px' }}>
                  WebRTC Direct
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Control this big screen live from Devarsh & Aman&apos;s smartphones
              </p>
            </div>
          </div>

          <button
            className="btn-action btn-icon"
            onClick={onClose}
            aria-label="Close pairing modal"
            style={{ width: 34, height: 34 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-3) 0' }}>
          {isLocalOnlyOrigin && (
            <div role="alert" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.35)', fontSize: 12, lineHeight: 1.5 }}>
              <strong>Phones cannot open this link.</strong> This page is running on localhost. Start the dev server with <code>npm run dev -- --host</code>, open the Network address it prints, then scan again. Or use the deployed site.
            </div>
          )}

          {!isStageOnline && (
            <div role="status" aria-live="polite" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.3)', fontSize: 12, lineHeight: 1.5 }}>
              <strong>Stage link offline.</strong> Reconnecting to the phone network. Phones cannot control this screen until it reconnects.
            </div>
          )}

          {/* Status banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: connectedCount > 0 ? 'rgba(48, 209, 88, 0.08)' : 'rgba(255, 153, 0, 0.08)',
            border: `1px solid ${connectedCount > 0 ? 'rgba(48, 209, 88, 0.25)' : 'rgba(255, 153, 0, 0.25)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Radio size={16} color={connectedCount > 0 ? 'var(--status-healthy)' : 'var(--accent)'} className={connectedCount > 0 ? '' : 'pulse-element'} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: connectedCount > 0 ? 'var(--status-healthy)' : 'var(--accent)' }}>
                  {connectedCount === 0 ? 'Waiting for Phones to Connect...' : `${connectedCount} Presenter Phone${connectedCount > 1 ? 's' : ''} Active`}
                </span>
                {latestSpeakerName && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    Last active: <strong style={{ color: '#fff' }}>{latestSpeakerName}</strong>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} color="var(--text-tertiary)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {connectedCount} / 2 Connected
              </span>
            </div>
          </div>

          {/* QR Code and Instructions */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* QR Box */}
            <div style={{
              background: '#0b0d10',
              padding: 12,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--separator-strong)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              textAlign: 'center'
            }}>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Pairing QR Code for room ${roomCode}`}
                  style={{ width: 200, height: 200, borderRadius: 'var(--radius-sm)', display: 'block' }}
                />
              ) : (
                <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
                  Generating QR...
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                Scan with Camera app on iPhone / Android
              </div>
            </div>

            {/* Manual PIN Box */}
            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Pairing Session Room Code
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--separator-subtle)',
                  marginTop: 4
                }}>
                  <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                    {roomCode}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                    Auto-Paired
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Direct Mobile Link
                </label>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <input
                    type="text"
                    readOnly
                    value={remoteUrl}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--separator-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  />
                  <button
                    className="btn-action primary"
                    onClick={handleCopyLink}
                    style={{ minHeight: 34, padding: '0 12px', fontSize: 12 }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Presenter Split Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                border: '1px solid var(--separator-subtle)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} color="var(--accent)" />
                  <span>How It Works in Your Hands:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>• <strong>Devarsh Patel</strong> &amp; <strong>Aman Kumar Yadav</strong> both open this link on their phones.</div>
                  <div>• Your phones show the <strong>verbatim teleprompter</strong> and talking points.</div>
                  <div>• Tapping buttons on your phone <strong>automatically scrolls and animates this big screen</strong> in real-time.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Local Remote in New Tab */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--separator-subtle)', paddingTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
              <ShieldCheck size={14} color="var(--status-healthy)" />
              <span>Peer-to-Peer Encrypted · No Server Overhead</span>
            </div>

            <a
              href={remoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action secondary"
              style={{ minHeight: 32, padding: '0 12px', fontSize: 12, textDecoration: 'none' }}
              onClick={() => soundFX.playClick()}
            >
              <ExternalLink size={13} />
              <span>Open Remote in Split Tab (Preview)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemotePairingModal;
