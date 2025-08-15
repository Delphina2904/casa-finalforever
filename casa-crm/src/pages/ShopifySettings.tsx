import React, { useState } from 'react';
import axios from 'axios';
import { useBrand } from '../contexts/BrandContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopifySettings = () => {
  const { brand, setBrand } = useBrand();
  const [storeUrl, setStoreUrl] = useState(brand?.shopify_store_url || '');
  const [accessToken, setAccessToken] = useState(brand?.shopify_access_token || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!brand) return;
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.put(`http://localhost:5002/api/brands/${brand._id}`, {
        shopify_store_url: storeUrl,
        shopify_access_token: accessToken,
      });
      setBrand(response.data); // Update brand context
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleSync = async () => {
    if (!brand) return;
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5002/api/products/sync-from-shopify', { brandId: brand._id });
      setMessage('Product sync started!');
    } catch (error) {
      setMessage('Failed to start sync.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-slate-400 hover:text-white"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold text-white ml-4">Shopify Integration</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Shopify Store URL</label>
          <input
            type="text"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl"
            placeholder="your-store.myshopify.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Admin API Access Token</label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl"
          />
        </div>
        <button onClick={handleSave} disabled={isLoading} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold">
          {isLoading ? 'Saving...' : 'Save Credentials'}
        </button>
         <button onClick={handleSync} disabled={isLoading || !brand?.shopify_access_token} className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400">
          {isLoading ? 'Syncing...' : 'Sync Products Now'}
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ShopifySettings;