import { CalendarDays, X } from 'lucide-react'

const statusClass = {
  Menunggu: 'status-pending',
  Terverifikasi: 'status-verified',
  'Perlu revisi': 'status-revision',
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${dateString}T00:00:00`))
}

function DetailModal({ registration, onClose, onUpdateStatus }) {
  const details = [
    ['NIK', registration.nik],
    ['Jenis kelamin', registration.gender],
    ['Tempat, tanggal lahir', `${registration.birthPlace}, ${formatDate(registration.birthDate)}`],
    ['Nomor telepon', registration.phone],
    ['Email', registration.email],
    ['Alamat', registration.address],
    ['Nomor paspor', registration.passportNumber],
    ['Masa berlaku paspor', formatDate(registration.passportExpiry)],
    ['Tipe kamar', registration.roomType],
    ['Kontak darurat', `${registration.emergencyName} · ${registration.emergencyPhone}`],
    ['Catatan kesehatan', registration.medicalNotes || 'Tidak ada'],
  ]

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div><span className="eyebrow">DETAIL PENDAFTARAN · {registration.id}</span><h2 id="modal-title">Informasi jamaah</h2></div>
          <button type="button" className="modal-close" aria-label="Tutup detail" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-person">
          <span className="person-avatar avatar-0">{registration.fullName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
          <div><h3>{registration.fullName}</h3><span>{registration.packageName}</span></div>
          <label className={`status-pill ${statusClass[registration.status]}`}><select value={registration.status} onChange={(event) => onUpdateStatus(registration.id, event.target.value)} aria-label="Ubah status pendaftaran"><option>Menunggu</option><option>Terverifikasi</option><option>Perlu revisi</option></select></label>
        </div>
        <div className="modal-trip"><CalendarDays size={16} /><span>Keberangkatan <strong>{formatDate(registration.departureDate)}</strong></span><i>·</i><span>Terdaftar <strong>{formatDate(registration.registeredAt)}</strong></span></div>
        <div className="detail-grid">{details.map(([label, value]) => <div className="detail-item" key={label}><span>{label}</span><strong>{value || '—'}</strong></div>)}</div>
        <div className="modal-footer"><span>Data pendaftaran tersimpan di sistem.</span><button type="button" className="button button-primary" onClick={onClose}>Selesai</button></div>
      </section>
    </div>
  )
}

export default DetailModal
