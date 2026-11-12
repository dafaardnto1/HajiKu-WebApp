import {
  ArrowDownToLine, CalendarDays, CheckCircle2, ChevronDown, CircleAlert,
  Clock3, FileText, Plus, Search, Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const sectionContent = {
  packages: {
    eyebrow: 'OPERASIONAL',
    title: 'Paket & keberangkatan',
    description: 'Atur jadwal, kuota, dan harga paket perjalanan.',
  },
  payments: {
    eyebrow: 'KEUANGAN',
    title: 'Pembayaran',
    description: 'Pantau progres pembayaran setiap jamaah.',
  },
  documents: {
    eyebrow: 'ADMINISTRASI',
    title: 'Dokumen jamaah',
    description: 'Tinjau kelengkapan data dokumen perjalanan.',
  },
}

const paymentClass = {
  Lunas: 'payment-paid',
  'DP dibayar': 'payment-partial',
  'Belum bayar': 'payment-unpaid',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))
}

function PageHeading({ section, addingPackage, setAddingPackage, payments }) {
  const content = sectionContent[section]
  return (
    <div className="page-heading management-heading">
      <div>
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>
      {section === 'packages' && (
        <button type="button" className="button button-primary" onClick={() => setAddingPackage((open) => !open)}>
          <Plus size={16} /> {addingPackage ? 'Tutup formulir' : 'Tambah paket'}
        </button>
      )}
      {section === 'payments' && (
        <button type="button" className="button button-outline" onClick={() => {
          const csv = ['Nama jamaah,Paket,Total,Terbayar,Status',
            ...payments.map(({ registration, payment }) => [
              registration.fullName,
              registration.packageName,
              payment.amount,
              payment.paid,
              payment.status,
            ].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')),
          ].join('\r\n')
          const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }))
          const link = document.createElement('a')
          link.href = url
          link.download = 'laporan-pembayaran-hajiku.csv'
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        }}><ArrowDownToLine size={15} /> Export pembayaran</button>
      )}
    </div>
  )
}

function OwnerManagement({
  section,
  registrations,
  packages,
  onAddPackage,
  payments,
  onUpdatePayment,
  documents,
  onUpdateDocument,
}) {
  const [addingPackage, setAddingPackage] = useState(false)
  const [search, setSearch] = useState('')
  const [packageForm, setPackageForm] = useState({
    name: '',
    duration: '',
    departureDate: '',
    quota: '',
    price: '',
  })

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id-ID')
    return registrations.filter((registration) =>
      !query || [registration.fullName, registration.id, registration.packageName]
        .some((value) => value.toLocaleLowerCase('id-ID').includes(query)),
    )
  }, [registrations, search])

  const paymentRows = registrations.map((registration) => ({
    registration,
    payment: payments[registration.id] || { amount: 0, paid: 0, status: 'Belum bayar' },
  }))
  const paidTotal = paymentRows.reduce((total, { payment }) => total + payment.paid, 0)
  const outstandingTotal = paymentRows.reduce((total, { payment }) => total + payment.amount - payment.paid, 0)
  const completeDocuments = registrations.filter((registration) => documents[registration.id] === 'Lengkap').length

  function updatePackageField(event) {
    const { name, value } = event.target
    setPackageForm((current) => ({ ...current, [name]: value }))
  }

  function submitPackage(event) {
    event.preventDefault()
    onAddPackage({
      ...packageForm,
      id: `PKT-${Date.now()}`,
      quota: Number(packageForm.quota),
      price: Number(packageForm.price),
      status: 'Aktif',
    })
    setPackageForm({ name: '', duration: '', departureDate: '', quota: '', price: '' })
    setAddingPackage(false)
  }

  return (
    <section className="management-page">
      <PageHeading
        section={section}
        addingPackage={addingPackage}
        setAddingPackage={setAddingPackage}
        payments={paymentRows}
      />

      {section === 'packages' && (
        <>
          {addingPackage && (
            <form className="package-form" onSubmit={submitPackage}>
              <h2>Informasi paket baru</h2>
              <div className="package-form-grid">
                <label className="field">Nama paket
                  <input name="name" value={packageForm.name} onChange={updatePackageField} placeholder="Contoh: Umrah Syawal 12 Hari" required />
                </label>
                <label className="field">Durasi
                  <input name="duration" value={packageForm.duration} onChange={updatePackageField} placeholder="12 hari" required />
                </label>
                <label className="field">Tanggal berangkat
                  <input type="date" name="departureDate" value={packageForm.departureDate} onChange={updatePackageField} required />
                </label>
                <label className="field">Kuota jamaah
                  <input type="number" min="1" name="quota" value={packageForm.quota} onChange={updatePackageField} placeholder="40" required />
                </label>
                <label className="field">Harga per jamaah
                  <input type="number" min="1" name="price" value={packageForm.price} onChange={updatePackageField} placeholder="32500000" required />
                </label>
              </div>
              <div className="package-form-actions">
                <button type="button" className="button button-outline" onClick={() => setAddingPackage(false)}>Batal</button>
                <button type="submit" className="button button-primary">Simpan paket</button>
              </div>
            </form>
          )}
          <div className="management-summary">
            <div className="management-summary-card"><span className="summary-icon"><CalendarDays size={17} /></span><span><small>Paket tersedia</small><strong>{packages.length}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon"><Users size={17} /></span><span><small>Total jamaah terdaftar</small><strong>{registrations.length}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon"><Clock3 size={17} /></span><span><small>Jadwal terdekat</small><strong>{formatDate([...packages].sort((a, b) => a.departureDate.localeCompare(b.departureDate))[0]?.departureDate)}</strong></span></div>
          </div>
          <div className="management-panel">
            <div className="management-panel-heading"><h2>Daftar paket</h2><span>{packages.length} paket</span></div>
            <div className="management-table-wrap">
              <table className="management-table">
                <thead><tr><th>NAMA PAKET</th><th>KEBERANGKATAN</th><th>DURASI</th><th>KUOTA</th><th>HARGA / JAMAAH</th><th>STATUS</th></tr></thead>
                <tbody>
                  {packages.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong><small>{item.id}</small></td>
                      <td>{formatDate(item.departureDate)}</td>
                      <td>{item.duration}</td>
                      <td>{item.quota} jamaah</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td><span className="status-pill status-verified">{item.status}</span></td>
                    </tr>
                  ))}
                  {packages.length === 0 && <tr><td colSpan="6"><div className="empty-state"><CalendarDays size={20} /><strong>Belum ada paket</strong><span>Tambahkan paket keberangkatan pertama.</span></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {section === 'payments' && (
        <>
          <div className="management-summary">
            <div className="management-summary-card"><span className="summary-icon summary-paid"><CheckCircle2 size={17} /></span><span><small>Total diterima</small><strong>{formatCurrency(paidTotal)}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon summary-pending"><Clock3 size={17} /></span><span><small>Sisa pembayaran</small><strong>{formatCurrency(outstandingTotal)}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon"><Users size={17} /></span><span><small>Transaksi jamaah</small><strong>{paymentRows.length}</strong></span></div>
          </div>
          <div className="management-panel">
            <div className="management-panel-heading"><div><h2>Rincian pembayaran</h2><p>Perbarui status setelah pembayaran diterima.</p></div></div>
            <div className="management-table-wrap">
              <table className="management-table">
                <thead><tr><th>JAMAAH</th><th>PAKET</th><th>TOTAL</th><th>TERBAYAR</th><th>SISA</th><th>STATUS</th></tr></thead>
                <tbody>
                  {paymentRows.map(({ registration, payment }) => (
                    <tr key={registration.id}>
                      <td><strong>{registration.fullName}</strong><small>{registration.id}</small></td>
                      <td>{registration.packageName}</td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td>{formatCurrency(payment.paid)}</td>
                      <td>{formatCurrency(payment.amount - payment.paid)}</td>
                      <td><label className={`status-pill ${paymentClass[payment.status]}`}><select value={payment.status} onChange={(event) => onUpdatePayment(registration.id, event.target.value)} aria-label={`Status pembayaran ${registration.fullName}`}><option>Belum bayar</option><option>DP dibayar</option><option>Lunas</option></select><ChevronDown size={13} /></label></td>
                    </tr>
                  ))}
                  {paymentRows.length === 0 && <tr><td colSpan="6"><div className="empty-state"><CircleAlert size={20} /><strong>Belum ada transaksi</strong><span>Data pembayaran akan tampil setelah jamaah terdaftar.</span></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {section === 'documents' && (
        <>
          <div className="management-summary">
            <div className="management-summary-card"><span className="summary-icon summary-paid"><CheckCircle2 size={17} /></span><span><small>Data terverifikasi</small><strong>{completeDocuments}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon summary-pending"><FileText size={17} /></span><span><small>Perlu ditinjau</small><strong>{registrations.length - completeDocuments}</strong></span></div>
            <div className="management-summary-card"><span className="summary-icon"><Users size={17} /></span><span><small>Total jamaah</small><strong>{registrations.length}</strong></span></div>
          </div>
          <div className="management-panel">
            <div className="management-panel-heading">
              <div><h2>Pemeriksaan dokumen</h2><p>Tandai setelah data pada dokumen fisik sudah diperiksa.</p></div>
              <label className="search-box management-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari jamaah..." /></label>
            </div>
            <div className="management-table-wrap">
              <table className="management-table">
                <thead><tr><th>JAMAAH</th><th>PAKET</th><th>NIK</th><th>NOMOR PASPOR</th><th>STATUS PEMERIKSAAN</th></tr></thead>
                <tbody>
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td><strong>{registration.fullName}</strong><small>{registration.id}</small></td>
                      <td>{registration.packageName}</td>
                      <td>{registration.nik}</td>
                      <td>{registration.passportNumber || 'Belum diisi'}</td>
                      <td><label className={`status-pill ${documents[registration.id] === 'Lengkap' ? 'status-verified' : documents[registration.id] === 'Kurang' ? 'status-revision' : 'status-pending'}`}><select value={documents[registration.id] || 'Perlu diperiksa'} onChange={(event) => onUpdateDocument(registration.id, event.target.value)} aria-label={`Status dokumen ${registration.fullName}`}><option>Perlu diperiksa</option><option>Lengkap</option><option>Kurang</option></select><ChevronDown size={13} /></label></td>
                    </tr>
                  ))}
                  {filteredRegistrations.length === 0 && <tr><td colSpan="5"><div className="empty-state"><FileText size={20} /><strong>Jamaah tidak ditemukan</strong><span>Coba kata kunci lain.</span></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default OwnerManagement
