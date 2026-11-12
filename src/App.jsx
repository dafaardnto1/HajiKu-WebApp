import { useMemo, useState } from 'react'
import { initialRegistrations } from './data/initialData.js'
import Navbar from './components/Navbar.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import DetailModal from './components/DetailModal.jsx'
import LoginPage from './components/LoginPage.jsx'
import OwnerManagement from './components/OwnerManagement.jsx'
import { demoOwnerAccount, initialPackages } from './data/ownerData.js'
import './App.css'

function App() {
  const [registrations, setRegistrations] = useState(initialRegistrations)
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [notice, setNotice] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('hajiku-owner-session') === 'active',
  )
  const [packages, setPackages] = useState(initialPackages)
  const [payments, setPayments] = useState(() => Object.fromEntries(
    initialRegistrations.map((registration, index) => {
      const amount = initialPackages.find((item) => item.name === registration.packageName)?.price || 0
      const paid = index === 0 || index === 3 ? amount : index === 1 ? 10000000 : 0
      return [
        registration.id,
        {
          amount,
          paid,
          status: paid === amount ? 'Lunas' : paid ? 'DP dibayar' : 'Belum bayar',
        },
      ]
    }),
  ))
  const [documents, setDocuments] = useState(() => Object.fromEntries(
    initialRegistrations.map((registration) => [
      registration.id,
      'Perlu diperiksa',
    ]),
  ))

  const counts = useMemo(() => ({
    total: registrations.length,
    pending: registrations.filter((item) => item.status === 'Menunggu').length,
  }), [registrations])

  function addRegistration(registration) {
    setRegistrations((current) => [registration, ...current])
    const packagePrice = packages.find((item) => item.name === registration.packageName)?.price || 32500000
    setPayments((current) => ({
      ...current,
      [registration.id]: { amount: packagePrice, paid: 0, status: 'Belum bayar' },
    }))
    setDocuments((current) => ({ ...current, [registration.id]: 'Perlu diperiksa' }))
    setNotice(`Pendaftaran ${registration.fullName} berhasil dikirim.`)
    setActiveView('jamaah')
  }

  function updateStatus(id, status) {
    setRegistrations((current) =>
      current.map((item) => item.id === id ? { ...item, status } : item),
    )
    if (selectedRegistration?.id === id) {
      setSelectedRegistration((current) => ({ ...current, status }))
    }
  }

  function handleLogin(credentials) {
    if (credentials.email !== demoOwnerAccount.email || credentials.password !== demoOwnerAccount.password) {
      setLoginError('Email atau kata sandi tidak sesuai.')
      return
    }

    sessionStorage.setItem('hajiku-owner-session', 'active')
    setLoginError('')
    setIsAuthenticated(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('hajiku-owner-session')
    setIsAuthenticated(false)
    setActiveView('dashboard')
    setSelectedRegistration(null)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} error={loginError} />
  }

  return (
    <div className="app-shell">
      <Navbar
        activeView={activeView}
        onChangeView={(view) => {
          setNotice('')
          setActiveView(view)
        }}
        registrations={registrations}
        pendingCount={counts.pending}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {notice && (
          <div className="success-notice" role="status">
            <span className="notice-check">✓</span>
            <span>{notice}</span>
            <button type="button" aria-label="Tutup notifikasi" onClick={() => setNotice('')}>×</button>
          </div>
        )}
        {activeView === 'dashboard' || activeView === 'jamaah' ? (
          <AdminDashboard
            activeView={activeView}
            registrations={registrations}
            packages={packages}
            totalCount={counts.total}
            pendingCount={counts.pending}
            onUpdateStatus={updateStatus}
            onViewDetails={setSelectedRegistration}
            onAddRegistration={() => setActiveView('registration')}
          />
        ) : activeView === 'registration' ? (
          <RegistrationForm packages={packages} onSubmit={addRegistration} onCancel={() => setActiveView('dashboard')} />
        ) : (
          <OwnerManagement
            section={activeView}
            registrations={registrations}
            packages={packages}
            onAddPackage={(newPackage) => setPackages((current) => [newPackage, ...current])}
            payments={payments}
            onUpdatePayment={(id, status) => setPayments((current) => ({
              ...current,
              [id]: {
                ...current[id],
                status,
                paid: status === 'Lunas' ? current[id].amount : status === 'Belum bayar' ? 0 : Math.min(current[id].amount, Math.max(current[id].paid, 10000000)),
              },
            }))}
            documents={documents}
            onUpdateDocument={(id, status) => setDocuments((current) => ({ ...current, [id]: status }))}
            onViewDetails={setSelectedRegistration}
          />
        )}
      </main>
      {selectedRegistration && (
        <DetailModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  )
}

export default App
