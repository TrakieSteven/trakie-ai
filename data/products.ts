export interface Product {
  category: string;
  brand: string;
  name: string;
  strain: string;
  details: string;
  thc: string;
  cbd: string;
  expDate: string;
  quantity: number;
  unitCost: number;
  priceAfterTax: number;
  image: string;
  description: string;
  effects: string;
  poweredBy: string;
}

export const products: Product[] = [
  {
    category: 'Flower',
    brand: 'Revert',
    name: 'Sunset Sherbert',
    strain: 'Sativa',
    details: '3.5g Flower',
    thc: '22.7%',
    cbd: '0.065%',
    expDate: '12/2025',
    quantity: 250,
    unitCost: 15.00,
    priceAfterTax: 32.70,
    image: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/product-photos/flower8.avif',
    description: 'Premium indoor-grown Sunset Sherbert featuring vibrant purple hues and a sweet, fruity aroma. Known for its uplifting and euphoric effects, perfect for daytime use.',
    effects: '😊 Uplifted • 😄 Euphoric • 🎨 Creative',
    poweredBy: 'Powered by ChatGPT',
  },
  {
    category: 'Vaporizers',
    brand: 'Jaunty',
    name: 'Strawnana',
    strain: 'Hybrid',
    details: '1g AIO Vape',
    thc: '90%',
    cbd: '0.1%',
    expDate: '12/2026',
    quantity: 500,
    unitCost: 30.00,
    priceAfterTax: 65.40,
    image: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/product-photos/vape3.avif',
    description: 'All-in-one vape cartridge with pure cannabis oil. Strawberry banana flavor profile with smooth, potent effects. No additives or cutting agents.',
    effects: '😌 Relaxed • 🌟 Happy • 💭 Focused',
    poweredBy: 'Powered by ChatGPT',
  },
  {
    category: 'Vaporizers',
    brand: 'Jaunty',
    name: 'Durban Poison',
    strain: 'Sativa',
    details: '1g AIO Vape',
    thc: '90%',
    cbd: '0.1%',
    expDate: '12/2025',
    quantity: 250,
    unitCost: 30.00,
    priceAfterTax: 65.40,
    image: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/product-photos/cart2.avif',
    description: 'Classic Durban Poison strain in premium vape form. Energizing sativa with sweet, earthy flavors. Perfect for creative projects and outdoor activities.',
    effects: '⚡ Energized • 🎨 Creative • 🌞 Uplifted',
    poweredBy: 'Powered by ChatGPT',
  },
  {
    category: 'Edibles',
    brand: 'Heavy Hitters',
    name: 'Blackberry Lemon',
    strain: 'Hybrid',
    details: '100mg Live Rosin Gummies',
    thc: '10mg',
    cbd: '0mg',
    expDate: '09/2026',
    quantity: 55,
    unitCost: 13.00,
    priceAfterTax: 27.20,
    image: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/product-photos/edible4.avif',
    description: 'Solventless live rosin gummies with real fruit flavor. 10 pieces per package, each containing 10mg THC. Made with premium cannabis extract and natural ingredients.',
    effects: '😌 Calm • 😊 Happy • 💤 Sleepy',
    poweredBy: 'Powered by ChatGPT',
  },
  {
    category: 'Edibles',
    brand: 'Bricks by Cannabals',
    name: 'Blue Raspberry',
    strain: 'Indica',
    details: 'Fast Acting 100mg Gummies',
    thc: '10mg',
    cbd: '0mg',
    expDate: '05/2026',
    quantity: 32,
    unitCost: 10.00,
    priceAfterTax: 21.60,
    image: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/product-photos/edi9.avif',
    description: 'Fast-acting nano-emulsion gummies for quick onset. Blue raspberry flavor with relaxing indica effects. Effects typically felt within 15-30 minutes.',
    effects: '😌 Relaxed • 💤 Sleepy • 🧘 Calm',
    poweredBy: 'Powered by ChatGPT',
  },
];
