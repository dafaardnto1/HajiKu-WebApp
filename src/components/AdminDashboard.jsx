import {
  CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleAlert, Clock3, Eye, Filter, Plus, Search, Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const statusClass = {
  Menunggu: 'status-pending',
  Terverifikasi: 'status-verified',
  'Perlu revisi': 'status-revision',
}

const statusIcon = {
  Menunggu: Clock3,
  Terverifikasi: CheckCircle2,
  'Perlu revisi': CircleAlert,
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${dateString}T00:00:00`))
}

function formatToday() {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function AdminDashboard({ activeView, registrations, packages, totalCount, pendingCount, onUpdateStatus, onViewDetails, onAddRegistration }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua status')
  const [packageFilter, setPackageFilter] = useState('Semua paket')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const filteredRegistrations = useMemo(() => registrations.filter((registration) => {
    const query = search.trim().toLocaleLowerCase('id-ID')
    const matchesSearch = !query || [
      registration.fullName,
      registration.id,
      registration.phone,
      registration.packageName,
    ].some((value) => value.toLocaleLowerCase('id-ID').includes(query))
    const matchesStatus = statusFilter === 'Semua status' || registration.status === statusFilter
    const matchesPackage = packageFilter === 'Semua paket' || registration.packageName === packageFilter
    return matchesSearch && matchesStatus && matchesPackage
  }), [registrations, search, statusFilter, packageFilter])

  const pageCount = Math.max(1, Math.ceil(filteredRegistrations.length / pageSize))
  const visibleRows = filteredRegistrations.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleFilterChange(setter) {
    return (event) => {
      setter(event.target.value)
      setCurrentPage(1)
    }
  }

  const isJamaahView = activeView === 'jamaah'

  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">{isJamaahView ? 'DATA DAN PENDAFTARAN' : `DASHBOARD · ${formatToday()}`}</span>
          <h1>{isJamaahView ? 'Jamaah' : 'Ringkasan'}</h1>
          <p>{isJamaahView ? 'Kelola data, status, dan detail seluruh jamaah.' : 'Pantau aktivitas pendaftaran dan operasional HajiKu.'}</p>
        </div>
        <button type="button" className="button button-primary" onClick={onAddRegistration}><Plus size={17} /> Tambah jamaah</button>
      </div>

      {!isJamaahView && (
        <>
          <div className="section-heading"><h2>Aktivitas jamaah</h2></div>
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-card-top"><span className="stat-icon"><Users size={18} /></span><span className="stat-label">Total jamaah</span></div>
              <strong className="stat-value">{totalCount}</strong>
            </article>
            <article className="stat-card">
              <div className="stat-card-top"><span className="stat-icon pending-icon"><Clock3 size={18} /></span><span className="stat-label">Menunggu verifikasi</span></div>
              <strong className="stat-value">{pendingCount}</strong>
            </article>
            <article className="stat-card">
              <div className="stat-card-top"><span className="stat-icon verified-icon"><CheckCircle2 size={18} /></span><span className="stat-label">Terverifikasi</span></div>
              <strong className="stat-value">{registrations.filter((item) => item.status === 'Terverifikasi').length}</strong>
            </article>
            <article className="stat-card">
              <div className="stat-card-top"><span className="stat-icon revision-icon"><CircleAlert size={18} /></span><span className="stat-label">Perlu revisi</span></div>
              <strong className="stat-value">{registrations.filter((item) => item.status === 'Perlu revisi').length}</strong>
            </article>
          </div>
        </>
      )}

      <section className="registrations-panel">
        <div className="panel-heading">
          <div><h2>{isJamaahView ? 'Semua jamaah' : 'Pendaftaran terbaru'}</h2><p>{filteredRegistrations.length} jamaah</p></div>
          {(search || statusFilter !== 'Semua status' || packageFilter !== 'Semua paket') && (
            <button type="button" className="text-button" onClick={() => { setSearch(''); setStatusFilter('Semua status'); setPackageFilter('Semua paket'); setCurrentPage(1) }}>Hapus filter</button>
          )}
        </div>
        <div className="table-toolbar">
          <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} placeholder="Cari nama, ID, atau nomor telepon..." /></label>
          <div className="filter-controls">
            <label className="select-filter"><Filter size={15} /><select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} aria-label="Filter status">
              <option>Semua status</option><option>Menunggu</option><option>Terverifikasi</option><option>Perlu revisi</option>
            </select><ChevronDown size={14} /></label>
            <label className="select-filter package-filter"><select value={packageFilter} onChange={handleFilterChange(setPackageFilter)} aria-label="Filter paket">
              <option>Semua paket</option>{packages.map((item) => <option key={item.id}>{item.name}</option>)}
            </select><ChevronDown size={14} /></label>
          </div>
        </div>
        <div className="table-scroll">
          <table className="registrations-table">
            <thead><tr><th>JAMAAH</th><th>PAKET &amp; JADWAL</th><th>TANGGAL DAFTAR</th><th>STATUS</th><th><span className="sr-only">Aksi</span></th></tr></thead>
            <tbody>
              {visibleRows.map((registration, index) => {
                const StatusIcon = statusIcon[registration.status]
                return (
                  <tr key={registration.id}>
                    <td><div className="person-cell"><span className={`person-avatar avatar-${index % 5}`}>{getInitials(registration.fullName)}</span><span><strong>{registration.fullName}</strong><small>{registration.id} <i>·</i> {registration.phone}</small></span></div></td>
                    <td><div className="package-cell"><strong>{registration.packageName}</strong><small><CalendarDays size={13} /> {formatDate(registration.departureDate)}</small></div></td>
                    <td className="registered-date">{formatDate(registration.registeredAt)}</td>
                    <td><label className={`status-pill ${statusClass[registration.status]}`}><StatusIcon size={14} /><select value={registration.status} onChange={(event) => onUpdateStatus(registration.id, event.target.value)} aria-label={`Ubah status ${registration.fullName}`}><option>Menunggu</option><option>Terverifikasi</option><option>Perlu revisi</option></select><ChevronDown size={12} /></label></td>
                    <td><button type="button" className="row-action" aria-label={`Lihat detail ${registration.fullName}`} onClick={() => onViewDetails(registration)}><Eye size={16} /></button></td>
                  </tr>
                )
              })}
              {visibleRows.length === 0 && <tr><td colSpan="5"><div className="empty-state"><Search size={22} /><strong>Jamaah tidak ditemukan</strong><span>Coba ubah kata kunci atau filter pencarian Anda.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Menampilkan <strong>{filteredRegistrations.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRegistrations.length)}</strong> dari <strong>{filteredRegistrations.length}</strong> jamaah</span>
          <div className="pagination">
            <button type="button" aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft size={16} /></button>
            <span>Halaman <strong>{currentPage}</strong> dari <strong>{pageCount}</strong></span>
            <button type="button" aria-label="Halaman selanjutnya" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((page) => page + 1)}><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
      <footer className="dashboard-footer"><span>© {new Date().getFullYear()} HajiKu</span><span>Butuh bantuan? <a href="mailto:bantuan@hajiku.id">Hubungi tim kami</a></span></footer>
    </section>
  )
}

export default AdminDashboard
