import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

import Certificate from '../components/Certificate'
import Navbar from '../components/Navbar'
import { API_BASE, publicApi } from '../utils/api'

export default function CertificatePage() {
  const { serialNo } = useParams()
  const certificateRef = useRef(null)
  const [certificate, setCertificate] = useState(null)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isDownloadingPng, setIsDownloadingPng] = useState(false)

  async function downloadPng() {
    setIsDownloadingPng(true)
    try {
      const dataUrl = await toPng(certificateRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      })

      const link = document.createElement('a')
      link.download = `certificate-${serialNo}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsDownloadingPng(false)
    }
  }

  async function downloadPdf() {
    setIsDownloadingPdf(true)
    try {
      const dataUrl = await toPng(certificateRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      })

      const pdf = new jsPDF('landscape', 'px', [960, 660])
      pdf.addImage(dataUrl, 'PNG', 0, 0, 960, 660)
      pdf.save(`certificate-${serialNo}.pdf`)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  useEffect(() => {
    publicApi
      .certificate(serialNo)
      .then(setCertificate)
      .catch((error) => toast.error(error.message))
  }, [serialNo])

  if (!certificate) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="container-pro py-12 text-slate-300">Loading certificate...</main>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container-pro py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
              Certificate Download
            </p>
            <h1 className="mt-2 font-cinzel text-3xl font-extrabold text-[#fefce8]">
              {certificate.studentName}
            </h1>
            <p className="mt-2 text-sm text-slate-400">Serial No: {certificate.serialNo}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={downloadPdf} 
              disabled={isDownloadingPdf}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              {isDownloadingPdf ? 'Downloading PDF...' : 'Download PDF'}
            </button>
            <button 
              onClick={downloadPng} 
              disabled={isDownloadingPng}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {isDownloadingPng ? 'Downloading Image...' : 'Download Image'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white p-3 shadow-2xl">
          <div ref={certificateRef} style={{ width: 960, height: 660 }}>
            <Certificate data={certificate} />
          </div>
        </div>
      </main>
    </div>
  )
}
