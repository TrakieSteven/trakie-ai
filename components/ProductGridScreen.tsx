'use client';

import { productCatalog } from '@/data/productCatalog';

interface ProductGridScreenProps {
  categoryName: string | null;
  onClose: () => void;
}

export default function ProductGridScreen({ categoryName, onClose }: ProductGridScreenProps) {
  if (!categoryName) return null;

  const productsInCategory = productCatalog[categoryName] || [];

  if (productsInCategory.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        overflowY: 'auto',
        padding: '100px 40px 40px',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          background: 'rgba(201, 169, 97, 0.2)',
          color: '#C9A961',
          border: '1px solid #C9A961',
          borderRadius: '50%',
          fontSize: '32px',
          cursor: 'pointer',
          zIndex: 10001,
        }}
      >
        ×
      </button>

      <h2
        style={{
          fontFamily: "'Bodoni Moda', serif",
          fontSize: '56px',
          color: '#C9A961',
          textAlign: 'center',
          marginBottom: '50px',
        }}
      >
        {categoryName}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {productsInCategory.map((product, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 169, 97, 0.2)',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-10px)';
              (e.currentTarget as HTMLDivElement).style.borderColor = '#C9A961';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201, 169, 97, 0.2)';
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'contain',
                marginBottom: '15px',
              }}
            />
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '16px',
                color: '#C9A961',
                fontWeight: 600,
              }}
            >
              {product.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
