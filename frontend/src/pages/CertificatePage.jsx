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

  async function downloadPng() {
    const dataUrl = await toPng(certificateRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    })

    const link = document.createElement('a')
    link.download = `certificate-${serialNo}.png`
    link.href = dataUrl
    link.click()
  }

  async function downloadPdf() {
    const dataUrl = await toPng(certificateRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    })

    const pdf = new jsPDF('landscape', 'px', [960, 660])
    pdf.addImage(dataUrl, 'PNG', 0, 0, 960, 660)
    pdf.save(`certificate-${serialNo}.pdf`)
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
            <button onClick={downloadPdf} className="btn-primary">
              Download PDF
            </button>
            <button onClick={downloadPng} className="btn-secondary">
              Download PNG
            </button>
            <a
              href={`${API_BASE}/public/certificates/${serialNo}/pdf`}
              className="btn-secondary"
            >
              Backend PDF
            </a>
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
