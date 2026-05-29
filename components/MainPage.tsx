'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HomeSection from '@/components/HomeSection';
import CinematicDemo from '@/components/CinematicDemo';
import ContactSection from '@/components/ContactSection';
import ProductModal from '@/components/ProductModal';
import SecurityLayer from '@/components/SecurityLayer';

import { products } from '@/data/products';

interface Props {
  initialSection: string;
}

export default function MainPage({ initialSection }: Props) {
  const router = useRouter();
  const [productModalIndex, setProductModalIndex] = useState<number | null>(null);

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

  void openProductModal;

  const s = initialSection;

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      <div className="main-site show" id="mainSite">
        <header>
          <Navbar onNavigate={showSection} />
        </header>

        <main id="main">
          <div className={`page-section${s === 'home' ? ' active' : ''}`} id="homeSection">
            <HomeSection onNavigate={showSection} />
          </div>

          <div className={`page-section${s === 'demo' ? ' active' : ''}`}>
            <CinematicDemo />
          </div>

          <ProductModal
            product={productModalIndex !== null ? products[productModalIndex] : null}
            onClose={closeProductModal}
          />

          <div className={`page-section${s === 'contact' ? ' active' : ''}`} id="contactSection">
            <ContactSection />
          </div>
        </main>

        <footer className="site-footer" aria-label="Site footer">
          <span>&copy; {new Date().getFullYear()} Trakie.ai</span>
        </footer>
      </div>

      <SecurityLayer />
    </>
  );
}
