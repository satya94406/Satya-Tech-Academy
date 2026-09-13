import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const adRef = useRef(null)
  const adSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID

  useEffect(() => {
    try {
      if (adSlotId && adRef.current && !adRef.current.hasAttribute('data-ad-status')) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense initialization error:', err)
    }
  }, [adSlotId])

  if (!adSlotId) return null

  return (
    <section className="container-pro py-8 flex flex-col items-center justify-center">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-slate-500">
        Advertisement
      </div>
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
