'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface QRCodeGeneratorProps {
  menuSlug: string;
  restaurantName: string;
  menuName: string;
}

export function QRCodeGenerator({
  menuSlug,
  restaurantName,
  menuName,
}: QRCodeGeneratorProps) {
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${menuSlug}`;

  async function generateQRCode() {
    // Using a QR code API service
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`;
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  async function handleDownloadQR() {
    try {
      const qrUrl = await generateQRCode();
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `${menuSlug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  }

  async function handleDownloadCard() {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${menuSlug}-menu-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download card:', err);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold mb-4">Share Your Menu</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={menuUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code
            </label>
            <div className="bg-white p-4 rounded-lg border border-gray-300 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`}
                alt="Menu QR Code"
                className="w-64 h-64"
              />
            </div>
            <Button
              onClick={handleDownloadQR}
              variant="outline"
              className="mt-3 gap-2 w-full"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </Card>

      
    </div>
  );
}
