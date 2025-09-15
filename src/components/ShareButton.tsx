import React, { useState } from 'react';
import { Share2, Twitter, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
import { ShareableResult, shareToSocial, nativeShare, canShare } from '../utils/sharing';

interface ShareButtonProps {
  result: ShareableResult;
  className?: string;
}

export function ShareButton({ result, className = '' }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: 'twitter' | 'facebook' | 'whatsapp' | 'copy' | 'native') => {
    try {
      if (platform === 'native' && canShare()) {
        await nativeShare(result);
      } else if (platform === 'copy') {
        await shareToSocial(result, 'copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        await shareToSocial(result, platform);
      }
      setShowMenu(false);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${className}`}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-2">
              {canShare() && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-3" />
                  Share...
                </button>
              )}
              
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                Twitter
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                Facebook
              </button>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-3 text-green-500" />
                WhatsApp
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-3" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}