import { ArrowLeft, ArrowRight, Check, ClipboardList, UserRound } from 'lucide-react'
import { useState } from 'react'

const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

function RegistrationForm({ packages, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    fullName: '',
    nik: '',
    gender: '',
    birthPlace: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    packageName: '',
    departureDate: '',
    roomType: '',
    passportNumber: '',
    passportExpiry: '',
    emergencyName: '',
    emergencyPhone: '',
    medicalNotes: '',
  })

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...form,
      id: `UMR-${Date.now()}`,
      status: 'Menunggu',
      registeredAt: today,
      medicalNotes: form.medicalNotes.trim() || 'Tidak ada',
    })
  }

  return (
    <section className="registration-page">
      <button type="button" className="back-link" onClick={onCancel}><ArrowLeft size={16} /> Kembali ke dashboard</button>
      <div className="page-heading form-heading">
        <div>
          <h1>Formulir pendaftaran</h1>
          <p>Isi data jamaah sesuai dokumen identitas dan perjalanan.</p>
        </div>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="section-title">
            <span className="section-icon"><UserRound size={18} /></span>
            <div><h2>Data diri jamaah</h2><p>Pastikan data sesuai dengan identitas resmi.</p></div>
            <span className="required-note"><b>*</b> Wajib diisi</span>
          </div>
          <div className="form-grid">
            <label className="field field-wide">Nama lengkap sesuai KTP <b>*</b>
              <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Contoh: Ahmad Fauzan" autoComplete="name" required />
            </label>
            <label className="field">NIK <b>*</b>
              <input name="nik" value={form.nik} onChange={updateField} placeholder="16 digit nomor induk kependudukan" inputMode="numeric" pattern="[0-9]{16}" maxLength="16" required />
            </label>
            <label className="field">Jenis kelamin <b>*</b>
              <select name="gender" value={form.gender} onChange={updateField} required>
                <option value="">Pilih jenis kelamin</option><option>Laki-laki</option><option>Perempuan</option>
              </select>
            </label>
            <label className="field">Tempat lahir <b>*</b>
              <input name="birthPlace" value={form.birthPlace} onChange={updateField} placeholder="Kota kelahiran" required />
            </label>
            <label className="field">Tanggal lahir <b>*</b>
              <input type="date" name="birthDate" value={form.birthDate} onChange={updateField} required />
            </label>
            <label className="field">Nomor telepon / WhatsApp <b>*</b>
              <input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="08xx xxxx xxxx" autoComplete="tel" required />
            </label>
            <label className="field">Alamat email <b>*</b>
              <input type="email" name="email" value={form.email} onChange={updateField} placeholder="nama@email.com" autoComplete="email" required />
            </label>
            <label className="field field-wide">Alamat lengkap <b>*</b>
              <textarea name="address" value={form.address} onChange={updateField} placeholder="Jalan, nomor rumah, RT/RW, kecamatan, kota, provinsi" rows="3" required />
            </label>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">
            <span className="section-icon"><ClipboardList size={18} /></span>
            <div><h2>Informasi perjalanan</h2><p>Pilih paket dan isi dokumen perjalanan Anda.</p></div>
          </div>
          <div className="form-grid">
            <label className="field">Paket umrah <b>*</b>
              <select name="packageName" value={form.packageName} onChange={updateField} required>
                <option value="">Pilih paket umrah</option>
                {packages.map((item) => <option key={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">Tanggal keberangkatan <b>*</b>
              <input type="date" name="departureDate" min={today} value={form.departureDate} onChange={updateField} required />
            </label>
            <label className="field">Tipe kamar <b>*</b>
              <select name="roomType" value={form.roomType} onChange={updateField} required>
                <option value="">Pilih tipe kamar</option>
                <option>Quad (4 orang)</option><option>Triple (3 orang)</option><option>Double (2 orang)</option>
              </select>
            </label>
            <label className="field">Nomor paspor <b>*</b>
              <input name="passportNumber" value={form.passportNumber} onChange={updateField} placeholder="Contoh: A1234567" required />
            </label>
            <label className="field">Masa berlaku paspor <b>*</b>
              <input type="date" name="passportExpiry" value={form.passportExpiry} onChange={updateField} required />
            </label>
            <div className="field field-wide emergency-fields">
              <span className="field-label">Kontak darurat <b>*</b></span>
              <div className="form-grid nested-grid">
                <label className="field">Nama kontak
                  <input name="emergencyName" value={form.emergencyName} onChange={updateField} placeholder="Nama keluarga / kerabat" required />
                </label>
                <label className="field">Nomor telepon
                  <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={updateField} placeholder="08xx xxxx xxxx" required />
                </label>
              </div>
            </div>
            <label className="field field-wide">Catatan kesehatan <span className="optional-label">Opsional</span>
              <textarea name="medicalNotes" value={form.medicalNotes} onChange={updateField} placeholder="Informasikan alergi, kondisi kesehatan, atau kebutuhan khusus jika ada" rows="3" />
            </label>
          </div>
        </div>
        <div className="form-footer">
          <p><span className="privacy-dot">✓</span> Data Anda dijaga kerahasiaannya dan hanya digunakan untuk keperluan perjalanan.</p>
          <div className="form-actions">
            <button type="button" className="button button-outline" onClick={onCancel}>Batal</button>
            <button type="submit" className="button button-primary">Kirim pendaftaran <ArrowRight size={16} /></button>
          </div>
        </div>
      </form>
      <div className="form-help"><Check size={16} /> Tim HajiKu akan menghubungi Anda setelah data berhasil diverifikasi.</div>
    </section>
  )
}

export default RegistrationForm
