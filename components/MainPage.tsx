'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/WelcomeScreen';
import Navbar from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import ReceiveSection from '@/components/ReceiveSection';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import DutchieFormScreen from '@/components/DutchieFormScreen';
import ProductModal from '@/components/ProductModal';
import SecurityLayer from '@/components/SecurityLayer';
import Watermark from '@/components/Watermark';
import { products } from '@/data/products';

interface Props {
  initialSection: string;
}

export default function MainPage({ initialSection }: Props) {
  const router = useRouter();
  const [productModalIndex, setProductModalIndex] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dutchieFormVisible] = useState(false);

  const showSection = useCallback((sectionName: string) => {
    const path = sectionName === 'home' ? '/' : `/${sectionName}`;
    router.push(path);
  }, [router]);

  const openProductModal = useCallback((index: number) => {
    setProductModalIndex(index);
  }, []);

  const closeProductModal = useCallback(() => {
    setProductModalIndex(null);
  }, []);

  const s = initialSection;

  return (
    <>
      <WelcomeScreen />

      <div className="main-site show" id="mainSite">
        <Navbar onNavigate={showSection} />

        <div className={`page-section${s === 'home' ? ' active' : ''}`} id="homeSection">
          <HomeSection onNavigate={showSection} />
        </div>

        <div className={`page-section${s === 'receive' ? ' active' : ''}`} id="receiveSection">
          <ReceiveSection
            onNavigate={showSection}
            onOpenProductModal={openProductModal}
          />
        </div>

        <DutchieFormScreen isActive={dutchieFormVisible} />

        <ProductModal
          product={productModalIndex !== null ? products[productModalIndex] : null}
          onClose={closeProductModal}
        />

        <div className={`page-section${s === 'pricing' ? ' active' : ''}`} id="pricingSection">
          <PricingSection onNavigate={showSection} />
        </div>

        <div className={`page-section${s === 'contact' ? ' active' : ''}`} id="contactSection">
          <ContactSection />
        </div>
      </div>

      <SecurityLayer />
      <Watermark />
    </>
  );
}
