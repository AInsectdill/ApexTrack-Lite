import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { generatorAPI, GeneratorData } from '../lib/api'

export default function Generator() {
  const [formData, setFormData] = useState<GeneratorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{
    final_shared_url: string
    smartlink_url_after_first_shortening?: string
  } | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchFormData()
  }, [])

  const fetchFormData = async () => {
    try {
      setIsLoading(true)
      const response = await generatorAPI.getData()
      setFormData(response.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal memuat data formulir')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)
    setError('')
    setSuccess('')
    setResult(null)

    const form = e.currentTarget
    const formDataObj = new FormData(form)

    try {
      const response = await generatorAPI.generateSmartlink(formDataObj)
      setResult(response.data)
      setSuccess('URL berhasil dibuat!')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal membuat URL')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 md:p-10 lg:p-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="card h-96 bg-gray-200"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 md:p-10 lg:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Smartlink Generator</h2>
        
        <div className="card">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-gray-300 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="offer" className="block text-sm font-medium text-gray-700">
                    Offers (Opsional)
                  </label>
                  <select name="offer" className="form-input">
                    <option value="">Pilih Offer</option>
                    {formData?.offers.map((offer) => (
                      <option key={offer.id} value={offer.id}>
                        {offer.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="shared_domain" className="block text-sm font-medium text-gray-700">
                    Domain
                  </label>
                  <select name="shared_domain" required className="form-input">
                    <option value="">Pilih Domain</option>
                    {formData?.domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="redirect_type" className="block text-sm font-medium text-gray-700">
                    Redirect
                  </label>
                  <select name="redirect_type" required className="form-input">
                    <option value="">Pilih Redirect</option>
                    {formData?.redirect_types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Smartlink Type
                  </label>
                  <select name="type" required className="form-input">
                    <option value="">Pilih Type</option>
                    {formData?.types.map((type) => (
                      <option key={type} value={type}>
                        {type === 'render' ? 'Render Halaman' : 'Redirect Langsung'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="generation_mode" className="block text-sm font-medium text-gray-700">
                    Mode
                  </label>
                  <select name="generation_mode" required className="form-input">
                    <option value="">Pilih Mode</option>
                    {formData?.generation_modes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode === 'smartlink_external_self' ? 'Double Shortener' : 'Single Shortener'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Meta Tags (Opsional)</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">
                    Meta Title
                  </label>
                  <input type="text" name="meta_title" className="form-input" />
                </div>
                
                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea name="meta_description" rows={3} className="form-input"></textarea>
                </div>
                
                <div>
                  <label htmlFor="og_image_file" className="block text-sm font-medium text-gray-700">
                    Unggah Gambar OG (Open Graph)
                  </label>
                  <input type="file" name="og_image_file" accept="image/*" className="form-input" />
                </div>
                
                <div>
                  <label htmlFor="favicon_file" className="block text-sm font-medium text-gray-700">
                    Unggah Favicon
                  </label>
                  <input type="file" name="favicon_file" accept=".ico,.png,.jpg,.jpeg,.gif,.svg" className="form-input" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Smartlink'}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hasil</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">URL Final:</p>
                  <a
                    href={result.final_shared_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold break-all hover:underline"
                  >
                    {result.final_shared_url}
                  </a>
                </div>
                
                {result.smartlink_url_after_first_shortening && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">URL Smartlink/Shortlink:</p>
                    <a
                      href={result.smartlink_url_after_first_shortening}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold break-all hover:underline"
                    >
                      {result.smartlink_url_after_first_shortening}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}