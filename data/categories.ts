export interface Category {
  name: string;
  video: string;
  emoji: string;
}

export const categories: Category[] = [
  { name: 'Flower', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/flower.mov', emoji: '🌿' },
  { name: 'Vaporizers', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/vape.mov', emoji: '💨' },
  { name: 'Pre-Rolls', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/preroll.mov', emoji: '🚬' },
  { name: 'Edibles', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/edible.mov', emoji: '🍫' },
  { name: 'Concentrates', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/concentrate.mov', emoji: '💎' },
  { name: 'Beverages', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/bev.mov', emoji: '🥤' },
  { name: 'Tinctures', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/tincture.mov', emoji: '🧴' },
  { name: 'CBD', video: 'https://raw.githubusercontent.com/dmtsteve/trakie-ai/main/balm.mov', emoji: '🟢' },
];
