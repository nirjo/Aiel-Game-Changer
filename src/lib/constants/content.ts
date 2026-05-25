import { BookOpen, Megaphone, Presentation, Target, Video, Briefcase, BarChart, PenTool } from 'lucide-react';

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
];

export const DASHBOARD_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Profile', href: '/dashboard/profile', icon: 'User' },
  { name: 'Bank Details', href: '/dashboard/bank-details', icon: 'Landmark' },
  { name: 'Submit Proof', href: '/dashboard/proof-submission', icon: 'FileCheck' },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: 'IndianRupee' },
  { name: 'Support', href: '/dashboard/support', icon: 'LifeBuoy' },
];

export const SERVICES = [
  {
    title: 'Brand Strategy',
    description: 'We build foundational brand architectures that resonate with your target audience and stand the test of time.',
    icon: Target,
  },
  {
    title: 'Social Media Marketing',
    description: 'Engage and grow your community with data-driven social media campaigns across all major platforms.',
    icon: Megaphone,
  },
  {
    title: 'Digital Campaigns',
    description: 'High-conversion digital advertising campaigns tailored for ROI and massive reach.',
    icon: Presentation,
  },
  {
    title: 'Video Production',
    description: 'Cinematic, compelling video content that tells your brand story and captivates viewers.',
    icon: Video,
  },
  {
    title: 'Creative Design',
    description: 'Stunning visual identities, packaging, and marketing collaterals that demand attention.',
    icon: PenTool,
  },
  {
    title: 'Media Planning',
    description: 'Strategic media buying and planning to ensure your message hits the right eyes at the right time.',
    icon: Briefcase,
  },
  {
    title: 'Content Marketing',
    description: 'Valuable, relevant content that drives organic traffic and establishes industry authority.',
    icon: BookOpen,
  },
  {
    title: 'Analytics & Insights',
    description: 'Deep-dive analytics to continuously optimize campaigns and maximize your marketing spend.',
    icon: BarChart,
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: 'Neon Nights Campaign',
    client: 'CyberTech Industries',
    category: 'digital',
    description: 'A futuristic digital campaign that increased user acquisition by 300% in Q3.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Velocity Rebranding',
    client: 'Velocity Sports',
    category: 'branding',
    description: 'Complete brand overhaul including new logo, visual identity, and packaging.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Urban Oasis',
    client: 'EcoLiving',
    category: 'social-media',
    description: 'A viral social media movement promoting sustainable urban living solutions.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'The Apex Commercial',
    client: 'Apex Automotive',
    category: 'video',
    description: 'Award-winning cinematic commercial for their flagship electric vehicle.',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Fresh Harvest Packaging',
    client: 'Nature Farms',
    category: 'packaging',
    description: 'Premium organic packaging design that stood out on retail shelves.',
    image: 'https://images.unsplash.com/photo-1606115915090-be18fea23ce7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Summer Splash',
    client: 'Oasis Beverages',
    category: 'campaign',
    description: 'A nationwide billboard and digital campaign that defined the summer season.',
    image: 'https://images.unsplash.com/photo-1559136555-e4671d2060e6?q=80&w=800&auto=format&fit=crop',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    company: 'TechFlow',
    quote: 'The Game Changer agency completely transformed our brand presence. Their strategic approach doubled our lead generation in just three months.',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    company: 'Elevate Fitness',
    quote: 'Working with them is electric. They don\'t just deliver campaigns; they deliver movements. The creative is always top-tier.',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    company: 'Lumiere Beauty',
    quote: 'Their attention to detail and ability to capture our brand voice was incredible. The ROI on our digital spend has never been higher.',
  },
];
