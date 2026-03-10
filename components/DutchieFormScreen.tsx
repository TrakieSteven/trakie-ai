'use client';

interface DutchieFormScreenProps {
  isActive: boolean;
}

export default function DutchieFormScreen({ isActive }: DutchieFormScreenProps) {
  return (
    <div className={`dutchie-form-screen${isActive ? ' active' : ''}`} id="dutchieFormScreen">
      <div className="dutchie-container">
        <div className="dutchie-header">
          <div className="dutchie-title">Receive Inventory</div>
          <div className="dutchie-status">Processing</div>
        </div>
        <div className="dutchie-form-fields">
          <div className="dutchie-field">
            <label>Supplier</label>
            <input type="text" defaultValue="Green Harvest Supply Co." readOnly />
          </div>
          <div className="dutchie-field">
            <label>Invoice #</label>
            <input type="text" defaultValue="INV-2024-00847" readOnly />
          </div>
          <div className="dutchie-field">
            <label>Delivery Date</label>
            <input type="text" defaultValue="12/15/2024" readOnly />
          </div>
          <div className="dutchie-field">
            <label>Received By</label>
            <input type="text" defaultValue="Store Manager" readOnly />
          </div>
        </div>
        <div className="dutchie-products-list" id="dutchieProductsList"></div>
      </div>
    </div>
  );
}
