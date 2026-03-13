'use client';

import { Product } from '@/data/products';
import { EffectTag, parseEffects } from './icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <div
      className="product-modal active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="product-modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <img
          className="modal-product-image"
          src={product.image}
          alt={product.name}
        />
        <div className="modal-product-details">
          <div className="modal-product-brand">{product.brand}</div>
          <div className="modal-product-name">
            {product.name} - {product.strain}
          </div>

          <div className="modal-cannabinoids">
            <div className="modal-cannabinoid">
              <div className="modal-cannabinoid-label">THC</div>
              <div className="modal-cannabinoid-value">{product.thc}</div>
            </div>
            <div className="modal-cannabinoid">
              <div className="modal-cannabinoid-label">CBD</div>
              <div className="modal-cannabinoid-value">{product.cbd}</div>
            </div>
          </div>

          <div className="modal-effects">
            {parseEffects(product.effects).map((effect, i) => (
              <EffectTag key={i} effect={effect} />
            ))}
          </div>

          <div className="modal-description">{product.description}</div>

          <div className="modal-price-info">
            <div className="modal-price-item">
              <div className="modal-price-label">Price After Tax</div>
              <div className="modal-price-value">${product.priceAfterTax.toFixed(2)}</div>
            </div>
            <div className="modal-price-item">
              <div className="modal-price-label">Quantity</div>
              <div className="modal-price-value">{product.quantity}</div>
            </div>
          </div>

          <div className="modal-powered-by">{product.poweredBy}</div>
        </div>
      </div>
    </div>
  );
}
