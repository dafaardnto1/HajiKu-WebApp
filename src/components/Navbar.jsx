import {
  CalendarDays, CreditCard, Download, FileText, LayoutDashboard, LogOut,
  Menu, Users, X,
} from 'lucide-react'
import { useState } from 'react'
import brandLogo from '../assets/brandlogo.png'

const sections = [
  { id: 'dashboard', label: 'Ringkasan', Icon: LayoutDashboard },
  { id: 'jamaah', label: 'Jamaah', Icon: Users },
  { id: 'packages', label: 'Paket', Icon: CalendarDays },
  { id: 'payments', label: 'Pembayaran', Icon: CreditCard },
  { id: 'documents', label: 'Dokumen', Icon: FileText },
]

function Navbar({ activeView, onChangeView, registrations, pendingCount, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function exportCsv() {
    const columns = [
      ['ID Pendaftaran', 'id'],
      ['Nama Lengkap', 'fullName'],
      ['NIK', 'nik'],
      ['Jenis Kelamin', 'gender'],
      ['No. Telepon', 'phone'],
      ['Email', 'email'],
      ['Paket', 'packageName'],
      ['Tanggal Keberangkatan', 'departureDate'],
      ['Status', 'status'],
      ['Tanggal Daftar', 'registeredAt'],
    ]
    const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const csv = [
      columns.map(([label]) => escapeCell(label)).join(','),
      ...registrations.map((registration) =>
        columns.map(([, key]) => escapeCell(registration[key])).join(','),
      ),
    ].join('\r\n')
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const now = new Date()
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    link.download = `data-jamaah-${localDate}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function selectView(view) {
    onChangeView(view)
    setMenuOpen(false)
  }

  return (
    <header className="topbar">
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); selectView('dashboard') }}>
        <img src={brandLogo} alt="HajiKu — Umroh dan Haji Terpercaya" />
      </a>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`topbar-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi pengelolaan">
        {sections.map(({ id, label, Icon }) => (
          <button
            type="button"
            key={id}
            className={`nav-link ${activeView === id || (id === 'jamaah' && activeView === 'registration') ? 'active' : ''}`}
            aria-current={activeView === id ? 'page' : undefined}
            onClick={() => selectView(id)}
          >
            <Icon size={16} />
            {label}
            {id === 'jamaah' && pendingCount > 0 && <span className="nav-count">{pendingCount}</span>}
          </button>
        ))}
      </nav>
      <div className={`topbar-actions ${menuOpen ? 'is-open' : ''}`}>
        <button type="button" className="button button-outline export-button" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
        <div className="profile-chip" aria-label="Administrator">
          <span className="profile-avatar">A</span>
          <span className="profile-text"><strong>Pemilik</strong><small>HajiKu</small></span>
        </div>
        <button type="button" className="logout-button" onClick={onLogout} aria-label="Keluar">
          <LogOut size={16} /><span>Keluar</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
