'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Confidence = 'high' | 'uncertain' | 'missing';
type Width = 'quarter' | 'half' | 'full';

interface DetailField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'dropdown';
  confidence: Confidence;
  width: Width;
}

interface ItemCellDef {
  id: string;
  column: 'packageId' | 'product' | 'type' | 'qty' | 'units' | 'vendor' | 'producer' | 'room';
  value: string;
  type: 'text' | 'dropdown';
  confidence: Confidence;
}

const DETAILS_FIELDS: DetailField[] = [
  { id: 'vendor', label: 'Vendor', value: 'Mary Jane Farms LLC', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'producer', label: 'Producer', value: 'MJF Cultivation', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'delivered_by', label: 'Delivered by', value: 'A. Reyes', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'license', label: 'Vendor license #', value: 'C11-0001234-LIC', type: 'text', confidence: 'high', width: 'quarter' },

  { id: 'order_title', label: 'Order title', value: '03/26/2026 \u2014 Inbound Transfer', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'delivered_on', label: 'Delivered on', value: '03/26/2026 02:14 PM', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'txn_id', label: 'Transaction ID', value: '1596163', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'room', label: 'Room', value: 'Vault', type: 'dropdown', confidence: 'high', width: 'quarter' },

  { id: 'subroom', label: 'Subroom', value: 'Flower Shelf B', type: 'dropdown', confidence: 'high', width: 'quarter' },
  { id: 'inv_status', label: 'Inventory status', value: 'Ready for Sale', type: 'dropdown', confidence: 'high', width: 'quarter' },
  { id: 'total_credits', label: 'Total credits', value: '$0', type: 'text', confidence: 'high', width: 'quarter' },
  { id: 'shipping', label: 'Shipping charges', value: '$0', type: 'text', confidence: 'high', width: 'quarter' },

  { id: 'notes', label: 'Notes', value: 'Awaiting QC sign-off.', type: 'text', confidence: 'uncertain', width: 'full' },
];

const ITEM_CELLS: ItemCellDef[] = [
  { id: 'item_package', column: 'packageId', value: '1A4060\u20260031847', type: 'text', confidence: 'high' },
  { id: 'item_product', column: 'product', value: 'Sour Diesel \u2014 Hybrid Flower 3.5g', type: 'text', confidence: 'high' },
  { id: 'item_type', column: 'type', value: 'Quantity', type: 'dropdown', confidence: 'high' },
  { id: 'item_qty', column: 'qty', value: '48', type: 'text', confidence: 'high' },
  { id: 'item_units', column: 'units', value: 'ea', type: 'dropdown', confidence: 'high' },
  { id: 'item_vendor', column: 'vendor', value: 'Mary Jane Farms', type: 'text', confidence: 'high' },
  { id: 'item_producer', column: 'producer', value: 'MJF Cultivation', type: 'text', confidence: 'high' },
  { id: 'item_room', column: 'room', value: 'Vault', type: 'dropdown', confidence: 'high' },
];

type AnyField = DetailField | ItemCellDef;
const ALL_FIELDS: AnyField[] = [...DETAILS_FIELDS, ...ITEM_CELLS];
const ITEM_START = DETAILS_FIELDS.length;
const TOTAL = ALL_FIELDS.length;
const UNCERTAIN_COUNT = ALL_FIELDS.filter(f => f.confidence === 'uncertain').length;

const RAIL_ITEMS: { label: string; active?: boolean }[] = [
  { label: 'Inventory', active: true },
  { label: 'Catalog' },
  { label: 'Manifests' },
  { label: 'Purchase orders' },
  { label: 'Orders' },
  { label: 'Audits' },
  { label: 'Journal' },
  { label: 'Vendors' },
  { label: 'Manufacturers' },
  { label: 'Brands' },
  { label: 'Strains' },
];

type FieldState = 'idle' | 'typing' | 'complete';

interface AutofillPhaseProps {
  onComplete: () => void;
}

export default function AutofillPhase({ onComplete }: AutofillPhaseProps) {
  const [fieldStates, setFieldStates] = useState<FieldState[]>(() => ALL_FIELDS.map(() => 'idle'));
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => ALL_FIELDS.map(() => ''));
  const [allDone, setAllDone] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const appRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  }, []);

  useEffect(() => {
    cleanup();
    setFieldStates(ALL_FIELDS.map(() => 'idle'));
    setDisplayTexts(ALL_FIELDS.map(() => ''));
    setAllDone(false);

    let delay = 600;
    const CHAR_INTERVAL = 55;
    const FIELD_GAP = 380;

    ALL_FIELDS.forEach((field, idx) => {
      const startDelay = delay;

      if (field.type === 'dropdown' || field.value === '') {
        timersRef.current.push(setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          setDisplayTexts(prev => { const n = [...prev]; n[idx] = field.value; return n; });
          timersRef.current.push(setTimeout(() => {
            setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
          }, 180));
        }, startDelay));
        delay += FIELD_GAP;
      } else {
        const typingDuration = field.value.length * CHAR_INTERVAL;
        timersRef.current.push(setTimeout(() => {
          setFieldStates(prev => { const n = [...prev]; n[idx] = 'typing'; return n; });
          let charIdx = 0;
          const interval = setInterval(() => {
            charIdx++;
            setDisplayTexts(prev => {
              const n = [...prev];
              n[idx] = field.value.slice(0, charIdx);
              return n;
            });
            if (charIdx >= field.value.length) {
              clearInterval(interval);
              timersRef.current.push(setTimeout(() => {
                setFieldStates(prev => { const n = [...prev]; n[idx] = 'complete'; return n; });
              }, 100));
            }
          }, CHAR_INTERVAL);
          intervalsRef.current.push(interval);
        }, startDelay));
        delay += Math.max(typingDuration, FIELD_GAP);
      }
    });

    timersRef.current.push(setTimeout(() => {
      setAllDone(true);
      timersRef.current.push(setTimeout(() => {
        onCompleteRef.current();
      }, 1500));
    }, delay + 400));

    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    const typingIdx = fieldStates.findIndex(s => s === 'typing');
    if (typingIdx < 0 || !appRef.current) return;

    const fieldEl = appRef.current.querySelector(`[data-field-idx="${typingIdx}"]`);
    if (!fieldEl) return;

    const container = appRef.current;
    const fieldRect = fieldEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (fieldRect.bottom > containerRect.bottom - 20) {
      container.scrollTo({
        top: container.scrollTop + (fieldRect.bottom - containerRect.bottom) + 60,
        behavior: 'smooth',
      });
    }
  }, [fieldStates]);

  const renderDetailField = (field: DetailField, idx: number) => {
    const state = fieldStates[idx];
    const text = displayTexts[idx];
    const isTyping = state === 'typing';
    const isDone = state === 'complete';

    const inputClass = [
      'dform-input',
      isTyping ? 'typing' : '',
      isDone ? 'done' : '',
      isDone ? `conf-${field.confidence}` : '',
    ].filter(Boolean).join(' ');

    const widthClass = field.width === 'full' ? ' full' : field.width === 'half' ? ' half' : '';

    return (
      <div
        key={field.id}
        data-field-idx={idx}
        className={`dform-field${widthClass}`}
      >
        <label className="dform-label">
          {field.label}
          {field.type === 'dropdown' && <span className="dform-dropdown-icon">&#9662;</span>}
        </label>
        <div className={inputClass}>
          <span className="dform-value">
            {text}
            {isTyping && <span className="dform-cursor">|</span>}
          </span>
          {isDone && (
            <span className={`dform-badge conf-${field.confidence}`}>
              {field.confidence === 'high' && '\u2713'}
              {field.confidence === 'uncertain' && '?'}
              {field.confidence === 'missing' && '!'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderItemCell = (cell: ItemCellDef, idx: number) => {
    const state = fieldStates[idx];
    const text = displayTexts[idx];
    const isTyping = state === 'typing';
    const isDone = state === 'complete';

    const inputClass = [
      'dform-input',
      isTyping ? 'typing' : '',
      isDone ? 'done' : '',
      isDone ? `conf-${cell.confidence}` : '',
    ].filter(Boolean).join(' ');

    return (
      <div key={cell.id} data-field-idx={idx} className="dlive-items-cell">
        <div className={inputClass}>
          <span className="dform-value">
            {text}
            {isTyping && <span className="dform-cursor">|</span>}
          </span>
        </div>
      </div>
    );
  };

  const filledCountLabel = `${TOTAL} fields filled${UNCERTAIN_COUNT > 0 ? ` \u00b7 ${UNCERTAIN_COUNT} requires manual review` : ''}`;

  return (
    <div className="cinematic-phase cinematic-autofill">
      <div className="demo-container">
        <div className="dlive-window" style={{ marginBottom: 0 }}>
          {/* macOS chrome */}
          <div className="dlive-chrome">
            <div className="dlive-dots">
              <span className="dlive-dot" style={{ background: '#ff5f57' }} />
              <span className="dlive-dot" style={{ background: '#ffbd2e' }} />
              <span className="dlive-dot" style={{ background: '#28ca41' }} />
            </div>
            <div className="dlive-url-bar">
              <span className="dlive-url-lock">&#128274;</span>
              pos.trakie.ai / inventory / receive
            </div>
          </div>

          <div className="dlive-shell">
            {/* Left rail */}
            <aside className="dlive-rail" aria-hidden="true">
              <div className="dlive-rail-section">Products</div>
              {RAIL_ITEMS.map(item => (
                <div
                  key={item.label}
                  className={`dlive-rail-item${item.active ? ' active' : ''}`}
                >
                  {item.label}
                </div>
              ))}
              <div className="dlive-rail-divider" />
              <div className="dlive-rail-footer">
                <div className="dlive-rail-item">Configure</div>
                <div className="dlive-rail-item">Help center</div>
              </div>
            </aside>

            {/* Main content */}
            <div className="dlive-main" ref={appRef}>
              <div className="dlive-page-bar">
                <span className="dlive-back">&lsaquo;</span>
                <span className="dlive-page-title-lg">Receive Inventory</span>
                <div className="dlive-nav-live">
                  <span className="dlive-live-dot" />
                  TRAKIE AI AUTOFILLING
                </div>
              </div>

              {/* Source card (static / prefilled) */}
              <div className="dlive-card dlive-source-card">
                <div className="dlive-source-text">
                  <div className="dlive-source-title">Source</div>
                  <div className="dlive-source-sub">Select the source the inventory will come from.</div>
                </div>
                <div className="dlive-source-selects">
                  <div className="dlive-select">Pending transfer</div>
                  <div className="dlive-select">03/26/2026 &mdash; Inbound Transfer</div>
                </div>
              </div>

              {/* Receiving details card */}
              <div className="dlive-card">
                <div className="dlive-section-row">
                  <div className="dlive-section-heading">Receiving details</div>
                  <div className="dlive-actions">
                    <span className="dlive-action-btn">Actions &#9662;</span>
                    <span className="dlive-action-btn">Save</span>
                    <span className="dlive-action-btn primary">Receive</span>
                  </div>
                </div>
                <div className="dform-grid dform-grid--quarters">
                  {DETAILS_FIELDS.map((f, i) => renderDetailField(f, i))}
                </div>
              </div>

              {/* Items received card */}
              <div className="dlive-card dlive-items-card">
                <div className="dlive-section-row">
                  <div className="dlive-section-heading">
                    Items received
                    <span className="dlive-items-total">&mdash; Total: $576.00</span>
                  </div>
                  <span className="dlive-add-item">Add item</span>
                </div>
                <div className="dlive-items-table">
                  <div className="dlive-items-head">
                    <div>Status</div>
                    <div>Package ID</div>
                    <div>Product</div>
                    <div>Type</div>
                    <div>Quant.</div>
                    <div>Units</div>
                    <div>Vendor</div>
                    <div>Producer</div>
                    <div>Room</div>
                  </div>
                  <div className="dlive-items-row">
                    <div className="dlive-items-cell">
                      <span className="dlive-items-status">&#10003;</span>
                    </div>
                    {ITEM_CELLS.map((c, i) => renderItemCell(c, ITEM_START + i))}
                  </div>
                </div>
              </div>

              <div className="dform-footer">
                <span className="dform-footer-note">
                  {allDone ? filledCountLabel : 'Autofilling fields\u2026'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
