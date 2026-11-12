import { ArrowLeft, ArrowRight, Check, ClipboardList, FileText, Upload, UserRound, X } from 'lucide-react'
import { useState } from 'react'

const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const maxFileSize = 10 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'jpg', 'jpeg', 'png', 'webp'])

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function RegistrationForm({ packages, onSubmit, onCancel }) {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadError, setUploadError] = useState('')
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

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.currentTarget.files || [])
    event.currentTarget.value = ''

    const acceptedFiles = selectedFiles.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return file.size <= maxFileSize && allowedExtensions.has(extension)
    })

    setUploadedFiles((current) => [
      ...current,
      ...acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      })),
    ])
    setUploadError(acceptedFiles.length === selectedFiles.length
      ? ''
      : 'Gunakan file PDF, JPG, PNG, atau WEBP dengan ukuran maksimal 10 MB per file.')
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...form,
      documents: uploadedFiles,
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

        <div className="form-section">
          <div className="section-title">
            <span className="section-icon"><FileText size={18} /></span>
            <div><h2>Dokumen jamaah</h2><p>Unggah dokumen identitas atau perjalanan yang tersedia.</p></div>
            <span className="optional-label">Opsional</span>
          </div>
          <label className="document-upload-zone">
            <input
              className="document-upload-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleFileChange}
              aria-label="Pilih dokumen jamaah"
            />
            <span className="upload-icon"><Upload size={17} /></span>
            <span className="upload-copy"><strong>Pilih file untuk diunggah</strong><small>PDF, JPG, PNG, atau WEBP · Maks. 10 MB per file</small></span>
          </label>
          {uploadError && <p className="document-upload-error" role="alert">{uploadError}</p>}
          {uploadedFiles.length > 0 && (
            <ul className="registration-file-list">
              {uploadedFiles.map((uploadedFile) => (
                <li key={uploadedFile.id}>
                  <FileText size={16} />
                  <span><strong>{uploadedFile.name}</strong><small>{formatFileSize(uploadedFile.size)}</small></span>
                  <button type="button" aria-label={`Hapus ${uploadedFile.name}`} onClick={() => setUploadedFiles((current) => current.filter((item) => item.id !== uploadedFile.id))}><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
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
