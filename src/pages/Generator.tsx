import React, { useState, useEffect } from 'react';
import { Link2, Upload } from 'lucide-react';
import { apiClient } from '../config/api';

interface GeneratorData {
  offers: Array<{ id: string; name: string }>;
  domains: string[];
  redirect_types: string[];
  types: string[];
  generation_modes: string[];
  shortener_choices: string[];
}

const Generator: React.FC = () => {
  const [formData, setFormData] = useState({
    offer: '',
    shared_domain: '',
    redirect_type: '',
    type: '',
    generation_mode: '',
    shortener_choice: '',
    meta_title: '',
    meta_description: '',
  });
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGeneratorData();
  }, []);

  const fetchGeneratorData = async () => {
    try {
      const data = await apiClient.get('/generator-data');
      setGeneratorData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/generate-smartlink', formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Smartlink Generator</h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offers (Optional)
              </label>
              <select
                name="offer"
                value={formData.offer}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Offer</option>
                {generatorData?.offers?.map(offer => (
                  <option key={offer.id} value={offer.id}>{offer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <select
                name="shared_domain"
                value={formData.shared_domain}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Domain</option>
                {generatorData?.domains?.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect Type
              </label>
              <select
                name="redirect_type"
                value={formData.redirect_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Redirect</option>
                {generatorData?.redirect_types?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Smartlink Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {generatorData?.types?.map(type => (
                  <option key={type} value={type}>
                    {type === 'render' ? 'Render Halaman' : 'Redirect Langsung'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generation Mode
              </label>
              <select
                name="generation_mode"
                value={formData.generation_mode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Mode</option>
                {generatorData?.generation_modes?.map(mode => (
                  <option key={mode} value={mode}>
                    {mode === 'smartlink_external_self' ? 'Double Shortener' : 'Single Shortener'}
                  </option>
                ))}
              </select>
            </div>

            {formData.generation_mode === 'smartlink_external_self' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shortener
                </label>
                <select
                  name="shortener_choice"
                  value={formData.shortener_choice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Shortener</option>
                  {generatorData?.shortener_choices?.map(choice => (
                    <option key={choice} value={choice}>{choice}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Meta Tags Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Tags (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta description"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Link2 className="w-5 h-5" />
            <span>{loading ? 'Generating...' : 'Generate Smartlink'}</span>
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated URLs</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mb-2">Final URL:</p>
                <a
                  href={result.final_shared_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium break-all hover:underline"
                >
                  {result.final_shared_url}
                </a>
              </div>
              {result.smartlink_url_after_first_shortening && (
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Shortened URL:</p>
                  <a
                    href={result.smartlink_url_after_first_shortening}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium break-all hover:underline"
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
  );
};

export default Generator;