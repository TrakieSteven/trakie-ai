'use client';

import Navbar from '@/components/Navbar';
import DemoAutofillSection from '@/components/DemoAutofillSection';
import SecurityLayer from '@/components/SecurityLayer';
import Watermark from '@/components/Watermark';

export default function DemoPage() {
  const handleNavigate = (section: string) => {
    if (section === 'demo') return;
    window.location.href = `/?section=${section}`;
  };

  return (
    <>
      <div className="main-site show">
        <Navbar onNavigate={handleNavigate} />
        <div className="page-section active">
          <DemoAutofillSection />
        </div>
      </div>
      <SecurityLayer />
      <Watermark />
    </>
  );
}
