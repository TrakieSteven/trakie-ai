'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { products } from '@/data/products';
import { CheckCircleIcon, ScanIcon, PackageIcon, ProductPlaceholder } from '../icons';

interface ResultsScreenProps {
  elapsedTime: number;
  onOpenProductModal: (index: number) => void;
  onRestart: () => void;
  onNavigate: (section: string) => void;
}

export default function ResultsScreen({
  elapsedTime,
  onOpenProductModal,
  onRestart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigate,
}: ResultsScreenProps) {
  const [timerDisplay, setTimerDisplay] = useState('00:00');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectedAmounts, setSelectedAmounts] = useState<Record<number, number>>({});
  const [showComplete, setShowComplete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable random SKU/batch IDs
  const productCodes = useMemo(() => {
    return products.map(() => ({
      sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      batchId: `LOT-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
    }));
  }, []);

  useEffect(() => {
    let currentTime = 0;
    timerRef.current = setInterval(() => {
      if (currentTime >= elapsedTime) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerDisplay(`00:${elapsedTime.toString().padStart(2, '0')}`);
      } else {
        currentTime++;
        setTimerDisplay(`00:${currentTime.toString().padStart(2, '0')}`);
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [elapsedTime]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const toggleProductSelection = (productIndex: number, amount: number) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productIndex)) {
        next.delete(productIndex);
        setSelectedAmounts((a) => {
          const na = { ...a };
          delete na[productIndex];
          return na;
        });
      } else {
        next.add(productIndex);
        setSelectedAmounts((a) => ({ ...a, [productIndex]: amount }));
      }
      return next;
    });
  };

  const moveAllSelected = () => {
    if (selectedProducts.size === 0) return;
    showToast(
      `Moved ${selectedProducts.size} product${selectedProducts.size > 1 ? 's' : ''} to sales floor`
    );
    setSelectedProducts(new Set());
    setSelectedAmounts({});
    setShowComplete(true);
  };

  return (
    <div className="results-screen active">
      {/* Toast notification */}
      <div className={`toast-notification${toast ? ' show' : ''}`}>
        <CheckCircleIcon size={20} color="#7fb800" />
        <span>{toast}</span>
      </div>

      <div className="step-indicator" style={{ top: '100px' }}>
        <div className="step-number step-complete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="step-arrow">→</span>
        <span>RECEIVING COMPLETE</span>
      </div>
      <div className="results-left">
        <div className="results-header">
          <h2 className="results-title">Receiving Complete!</h2>
          <div className="completion-badge">5 PRODUCTS PROCESSED</div>

          <div className="time-comparison">
            <div className="time-row">
              <span className="time-label">Manual Time:</span>
              <span className="time-value">15-25 minutes</span>
            </div>
            <div className="time-row trakie">
              <span className="time-label">Trakie Time:</span>
              <span className="time-value">2 min 15 sec</span>
            </div>
            <div className="time-row savings">
              <span className="time-label">Time Saved:</span>
              <span className="time-value">~21 minutes (7x faster)</span>
            </div>
          </div>

          <div className="timer-display">{timerDisplay}</div>
          <div className="timer-label">SECONDS</div>
        </div>

        {/* Compliance Data Section */}
        <div className="compliance-data-section">
          <h3 className="compliance-section-title">
            <CheckCircleIcon size={22} color="#C9A961" /> METRC &amp; COMPLIANCE DATA CAPTURED
          </h3>

          <div className="compliance-grid">
            <div className="compliance-field">
              <div className="compliance-label">
                Product ID / Barcode <span className="required">*</span>
              </div>
              <div className="compliance-value">
                <span className="scan-icon"><ScanIcon size={16} color="#C9A961" /></span>
                <span>1A4060300002199000012345</span>
              </div>
            </div>

            <div className="compliance-field">
              <div className="compliance-label">
                Batch / Lot ID # <span className="required">*</span>
              </div>
              <div className="compliance-value">BT-2024-1547-A</div>
            </div>

            <div className="compliance-field full-width">
              <div className="compliance-label">
                METRC Package UID <span className="required">*</span>
              </div>
              <div className="compliance-value monospace">
                1A406030000219900001234500000000000000000001
              </div>
            </div>

            <div className="compliance-field">
              <div className="compliance-label">Category</div>
              <div className="compliance-value">Flower - Indoor Premium</div>
            </div>

            <div className="compliance-field">
              <div className="compliance-label">Online Menu Name</div>
              <div className="compliance-value">Sunset Sherbert - Premium Indoor 3.5g</div>
            </div>

            <div className="compliance-field full-width">
              <div className="compliance-label">Ingredients</div>
              <div className="compliance-value">Cannabis Flower, Natural Terpenes</div>
            </div>

            <div className="compliance-field">
              <div className="compliance-label">Allergens</div>
              <div className="compliance-value">None</div>
            </div>

            <div className="compliance-field">
              <div className="compliance-label">Product Photo</div>
              <div className="compliance-value">
                <CheckCircleIcon size={14} color="#7fb800" /> Captured &amp; Uploaded
              </div>
            </div>

            <div className="compliance-field full-width">
              <div className="compliance-label">Description</div>
              <div className="compliance-value description">
                Premium indoor-grown Sunset Sherbert featuring vibrant purple hues and sweet, fruity
                aroma. Known for uplifting and euphoric effects with balanced indica-leaning profile.
              </div>
            </div>
          </div>

          <div className="compliance-footer">
            <span className="required">*</span> Required for state compliance reporting
          </div>
        </div>

        {/* Product Cards */}
        <div className="product-cards">
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card"
              onClick={() => onOpenProductModal(index)}
            >
              <div className="product-card-new">
                <div className="product-name-large">{product.brand}</div>
                <div className="product-meta-line">
                  {product.name} | {product.strain} | {product.details}
                </div>

                <div className="product-image-section">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-main-image"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.product-placeholder-icon')) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'product-placeholder-icon';
                        parent.appendChild(wrapper);
                      }
                    }}
                  />
                </div>

                <div className="product-codes">
                  <div className="code-item">SKU: {productCodes[index].sku}</div>
                  <div className="code-item">BATCH: {productCodes[index].batchId}</div>
                </div>

                <div className="product-price-qty-section">
                  <div className="price-large">
                    <div className="price-label-small">PRICE (AFTER TAX)</div>
                    <div className="price-value">${product.priceAfterTax.toFixed(2)}</div>
                  </div>
                  <div className="quantity-large">
                    <div className="qty-label-small">QUANTITY</div>
                    <div className="qty-value">{product.quantity}</div>
                  </div>
                </div>

                <div className="product-cannabinoids">
                  <div className="cannabinoid-item">
                    <span className="cannabinoid-label">THC</span>
                    <span className="cannabinoid-value">{product.thc}</span>
                  </div>
                  <div className="cannabinoid-item">
                    <span className="cannabinoid-label">CBD</span>
                    <span className="cannabinoid-value">{product.cbd}</span>
                  </div>
                </div>

                <div className="product-exp">
                  <span className="exp-label">EXP DATE:</span>
                  <span className="exp-value">{product.expDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-right">
        <h3 className="controls-title">Smart Move to Sales</h3>
        <div>
          {products.map((product, index) => (
            <div
              key={index}
              className={`move-button-group${selectedProducts.has(index) ? ' selected' : ''}`}
            >
              <div className="move-product-name">{product.name}</div>
              <div className="move-buttons">
                <button
                  className={`move-btn${selectedAmounts[index] === 5 ? ' selected' : ''}`}
                  onClick={() => toggleProductSelection(index, 5)}
                >
                  Select 5
                </button>
                <button
                  className={`move-btn${selectedAmounts[index] === 10 ? ' selected' : ''}`}
                  onClick={() => toggleProductSelection(index, 10)}
                >
                  Select 10
                </button>
              </div>
            </div>
          ))}

          {selectedProducts.size > 0 && (
            <button className="move-all-btn" onClick={moveAllSelected}>
              Move {selectedProducts.size} Product{selectedProducts.size > 1 ? 's' : ''} to Sales
              Floor
            </button>
          )}
        </div>
        <div className="completion-actions">
          <button
            className={`complete-btn${showComplete ? ' show' : ''}`}
            onClick={onRestart}
          >
            ← Start New Delivery
          </button>
        </div>
        <button className="restart-demo-btn" onClick={onRestart}>
          <PackageIcon size={18} color="#C9A961" /> Receive Another Delivery
        </button>
      </div>
    </div>
  );
}
