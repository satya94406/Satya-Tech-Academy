import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const adRef = useRef(null)

  useEffect(() => {
    try {
      // Prevent duplicate initialization on re-renders
      if (adRef.current && !adRef.current.hasAttribute('data-ad-status')) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense initialization error:', err)
    }
  }, [])

  // Paste your actual Ad Slot ID in your .env file as VITE_ADSENSE_SLOT_ID
  const adSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID || 'ACTUAL_AD_SLOT_ID_HERE'

  return (
    <section className="container-pro py-8 flex flex-col items-center justify-center">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-slate-500">
        Advertisement
      </div>
      
      {/* 
        The wrapper ensures the ad doesn't cause horizontal scrolling on mobile, 
        and constraints it nicely within the desktop container 
      */}
      <div className="w-full max-w-full overflow-hidden flex justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-4315118246094685"
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </section>
  )
}
