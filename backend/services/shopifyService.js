// backend/services/shopifyService.js
const axios = require('axios');
const Product = require('../models/product');
const Brand = require('../models/brand');

const syncProductsFromShopify = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand || !brand.shopify_store_url || !brand.shopify_access_token) {
    throw new Error('Shopify credentials are not configured for this brand.');
  }

  const { shopify_store_url, shopify_access_token } = brand;

  const response = await axios.get(
    `https://${shopify_store_url}/admin/api/2023-10/products.json`,
    {
      headers: { 'X-Shopify-Access-Token': shopify_access_token },
    }
  );

  const shopifyProducts = response.data.products;

  // Logic to sync products:
  // For each product from Shopify, check if it exists in your DB.
  // If it exists, update it. If not, create it.
  // This is a simplified example.
  for (const shopifyProduct of shopifyProducts) {
    await Product.findOneAndUpdate(
      { 'name': shopifyProduct.title, 'brand': brandId },
      {
        description: shopifyProduct.body_html,
        images: shopifyProduct.images.map(img => img.src),
        price: shopifyProduct.variants[0].price,
        // ... map other fields
      },
      { upsert: true, new: true }
    );
  }
  return { synced: shopifyProducts.length };
};

module.exports = { syncProductsFromShopify };