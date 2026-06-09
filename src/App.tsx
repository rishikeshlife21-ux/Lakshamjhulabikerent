import React, { useState, useMemo, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Compass, 
  MapPin, 
  Bike, 
  Flame, 
  Calendar, 
  DollarSign, 
  Sliders, 
  Star, 
  Check, 
  ChevronDown, 
  Phone, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Search, 
  Menu, 
  X, 
  Shield, 
  Info, 
  HelpCircle, 
  Car, 
  Waves,
  Tent,
  Award,
  Plus,
  Minus,
  Navigation,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  AlertTriangle,
  ExternalLink,
  Loader2
} from "lucide-react";

// Types
interface Vehicle {
  id: string;
  name: string;
  category: "cruiser" | "adventure" | "scooter";
  image: string;
  basePrice: number; // per day
  cc: string;
  fuelCap: string;
  mileage: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  recommendedFor: string;
}

// Data Sets
const FLEET: Vehicle[] = [
  {
    id: "himalayan",
    name: "Royal Enfield Himalayan",
    category: "adventure",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    basePrice: 1200,
    cc: "411 CC",
    fuelCap: "15 Liters",
    mileage: "32 kmpl",
    features: ["Dual-Channel ABS", "Pannier Metal Mounts", "All-Terrain Suspensions", "USB Nav Charger"],
    rating: 4.9,
    reviewsCount: 142,
    recommendedFor: "Climbing steep waterfall trails and mountain exploration"
  },
  {
    id: "classic-bullet",
    name: "Classic Bullet 350",
    category: "cruiser",
    image: "https://images.unsplash.com/photo-1609170064977-fb2cf931ca87?auto=format&fit=crop&w=800&q=80",
    basePrice: 900,
    cc: "349 CC",
    fuelCap: "13 Liters",
    mileage: "37 kmpl",
    features: ["Pillion Backrest Comfort", "Chromed Retro Styling", "Double Disc Brakes", "Crash guard legs"],
    rating: 4.8,
    reviewsCount: 118,
    recommendedFor: "Majestic cruising along high holy Ganges River lanes"
  },
  {
    id: "activa-6g",
    name: "Honda Activa 6G",
    category: "scooter",
    image: "https://images.unsplash.com/photo-1571127236794-81c0ecfe1ce3?auto=format&fit=crop&w=800&q=80",
    basePrice: 400,
    cc: "110 CC",
    fuelCap: "5.3 Liters",
    mileage: "52 kmpl",
    features: ["100% Automatic Gear", "High Ground Clearance", "Under-seat storage space", "Lightweight frame"],
    rating: 4.7,
    reviewsCount: 204,
    recommendedFor: "Zipping through markets, cafes and Ram Jhula bridges"
  },
  {
    id: "ntorq-125",
    name: "TVS Ntorq 125 CC",
    category: "scooter",
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80",
    basePrice: 500,
    cc: "125 CC",
    fuelCap: "5.8 Liters",
    mileage: "47 kmpl",
    features: ["Bluetooth Digital Dash", "Extra Hill climbing torque", "Aggressive sporty design", "Front Disc Brake"],
    rating: 4.8,
    reviewsCount: 96,
    recommendedFor: "Speedy dual-travel climbs to Neer Waterfalls"
  },
  {
    id: "ktm-adv",
    name: "KTM Adventure 390",
    category: "adventure",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    basePrice: 1500,
    cc: "373 CC",
    fuelCap: "14.5 Liters",
    mileage: "28 kmpl",
    features: ["Multilevel Traction Control", "Quickshifter Standard", "Cornering ABS enabled", "WP Apex Suspension"],
    rating: 4.9,
    reviewsCount: 64,
    recommendedFor: "High power touring, fast tarmac curves and off-road loops"
  }
];

const FAQS = [
  {
    q: "What documents are required to rent a bike/scooter?",
    a: "You need a valid original two-wheeler Driving License (DL) inside India. Foreign nationals require an International Driving Permit (IDP). A photo ID copy (Aadhaar Card, Passport, or Voter Card) is also retained for check-in."
  },
  {
    q: "What is your security deposit and fuel policy?",
    a: "We maintain standard secure check-in verification (original Aadhaar or official ID card submission). You just pay the daily rental price. Bikes are delivered with standard fuel to reach the local petrol station (dry start option)—you return it with the same level or opt for a full tank add-on."
  },
  {
    q: "Are helmets included in the rental cost?",
    a: "Yes! Every single rental ride includes two thoroughly sanitized, comfortable, high-quality helmets for the rider and pillion passenger completely FREE of extra charges."
  },
  {
    q: "Is there support in case of a breakdown in the mountains?",
    a: "Absolutely! We provide 24/7 emergency mechanical support and replacement coverage around Tapovan, Laxman Jhula, Ram Jhula, and up to Neer Waterfall / Shivpuri routes. Your safety is our absolute priority."
  },
  {
    q: "Can I take the rental bike to Kedarnath or Badrinath (Char Dham)?",
    a: "Yes! However, you must inform us at registration so we can issue valid out-state high hill permits, emergency survival spares, and inspect the dual-sport vehicle for extensive high altitude touring. Custom pricing packages apply."
  }
];

export default function App() {
  // Navigation & Menu Status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll helper function for reliable navigation (especially within browser iframe sandboxes / mobile wrappers)
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  
  // Filtering fleet state
  const [selectedCategory, setSelectedCategory] = useState<"all" | "cruiser" | "adventure" | "scooter">("all");

  // Price Estimator Widget states
  const [estVehicleId, setEstVehicleId] = useState<string>("himalayan");
  const [estDays, setEstDays] = useState<number>(3);
  const [estQuantity, setEstQuantity] = useState<number>(1);
  const [includeFullTank, setIncludeFullTank] = useState<boolean>(false);
  
  // Booking inquiry modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryBikeId, setInquiryBikeId] = useState("himalayan");
  const [inquiryDays, setInquiryDays] = useState(3);
  const [inquiryQty, setInquiryQty] = useState(1);
  const [inquiryDate, setInquiryDate] = useState("");
  
  // Set default inquiry date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setInquiryDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // FAQs active state tracker (-1 is none)
  const [activeFaq, setActiveFaq] = useState<number>(0);

  // Filtered vehicle fleet list
  const filteredFleet = useMemo(() => {
    if (selectedCategory === "all") return FLEET;
    return FLEET.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  // Selected vehicle details for Estimator calculations
  const estVehicle = useMemo(() => {
    return FLEET.find(v => v.id === estVehicleId) || FLEET[0];
  }, [estVehicleId]);

  // Estimator Calculations Engine
  const calculatorResults = useMemo(() => {
    const rawTotal = estVehicle.basePrice * estDays * estQuantity;
    
    // Multi-day bulk discount calculation
    // 3 to 6 days = 10% discount
    // 7+ days = 20% discount
    let discountPercent = 0;
    if (estDays >= 7) {
      discountPercent = 20;
    } else if (estDays >= 3) {
      discountPercent = 10;
    }
    
    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const fuelCostExtra = includeFullTank ? (estVehicle.category === "scooter" ? 450 : 1000) * estQuantity : 0;
    const finalTotal = rawTotal - discountAmount + fuelCostExtra;

    return {
      rawTotal,
      discountPercent,
      discountAmount,
      fuelCostExtra,
      finalTotal
    };
  }, [estVehicle, estDays, estQuantity, includeFullTank]);

  // Trigger WhatsApp logic for Quick Estimate Action
  const handleEstimateWhatsApp = () => {
    const textMessage = `Hi Lakshmanjhula Bike Rental! 🛵💨
I used your live web pricing calculator. I'd like to book this package:
- 🏍️ Vehicle: ${estVehicle.name} (${estVehicle.cc})
- 👥 Quantity: ${estQuantity} unit(s)
- 📅 Duration: ${estDays} days
- ⛽ Full Tank Option: ${includeFullTank ? "Yes, please pre-fill" : "No, self fuel"}
- 🏷️ Discount Applied: ${calculatorResults.discountPercent}% off (Saved ₹${calculatorResults.discountAmount})
- 💰 Estimated Total: ₹${calculatorResults.finalTotal.toLocaleString()} INR

Are these slots available for rental at your Laxman Jhula office (opposite Taxi Stand, Hotel Tourist Home)? Thanks!`;
    
    const encoded = encodeURIComponent(textMessage);
    window.open(`https://wa.me/917500130809?text=${encoded}`, "_blank");
  };

  // Trigger WhatsApp logic for Modal Inquiry Form Submission
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenBike = FLEET.find(v => v.id === inquiryBikeId)?.name || inquiryBikeId;
    
    const textMessage = `Hi Lakshmanjhula Bike Rental! 🏔️
I want to enquire about a custom ride rental booking:
- 👤 Name: ${inquiryName || "Guest Rider"}
- 🏍️ Vehicle Choice: ${chosenBike}
- 👥 Quantity: ${inquiryQty} unit(s)
- 📅 Period: ${inquiryDays} Days
- 🚀 Pick-Up Target Date: ${inquiryDate}

Please confirm availability and booking formalities over chat. Jai Gange! 🙏`;
    
    const encoded = encodeURIComponent(textMessage);
    setIsModalOpen(false);
    window.open(`https://wa.me/917500130809?text=${encoded}`, "_blank");
  };

  // Direct Booking Handler from Fleet Card
  const handleDirectBook = (bikeName: string) => {
    const defaultText = `Hi Lakshmanjhula Bike Rental! 🛵
I'd like to book a rental slot for the "${bikeName}" at your Laxman Jhula store (Hotel Tourist Home, opposite Taxi Stand). Can you share the quickest procedure for reserving this ride? Thank you!`;
    const encoded = encodeURIComponent(defaultText);
    window.open(`https://wa.me/917500130809?text=${encoded}`, "_blank");
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-brand-orange selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 shadow-xl" id="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-brand-orange/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5.5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                <path d="M12 17V7l7 5-7 5z"/>
              </svg>
            </div>
            <div>
              <div className="font-heading font-black text-lg tracking-wider text-white uppercase leading-none">
                LAKSHMANJHULA
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-brand-orange mt-0.5">
                BIKES & RENTALS
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#bento-dashboard" onClick={(e) => handleScrollTo(e, "bento-dashboard")} className="hover:text-brand-orange transition-colors">Explorer</a>
            <a href="#fleet" onClick={(e) => handleScrollTo(e, "fleet")} className="hover:text-brand-orange transition-colors">Bikes Fleet</a>
            <a href="#services" onClick={(e) => handleScrollTo(e, "services")} className="hover:text-brand-orange transition-colors">Adventures</a>
            <a href="#calculator" onClick={(e) => handleScrollTo(e, "calculator")} className="hover:text-brand-orange transition-colors">Estimator</a>
            <a href="#why-choose" onClick={(e) => handleScrollTo(e, "why-choose")} className="hover:text-brand-orange transition-colors">Perks</a>
            <a href="#faqs" onClick={(e) => handleScrollTo(e, "faqs")} className="hover:text-brand-orange transition-colors">FAQs</a>
          </nav>

          {/* Live Contact Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="https://maps.app.goo.gl/Ue7im4KD2oweJMCq9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition duration-200 inline-flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>Locate Shop</span>
            </a>
            <a 
              href="https://wa.me/917500130809?text=Hi%20there%2C%20I'd%20like%20to%20enquire%20about%20bike%20rentals%20in%20Rishikesh." 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition duration-200 inline-flex items-center gap-2 shadow-lg shadow-brand-orange/15"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Quick Booking</span>
            </a>
          </div>

          {/* Mobile Menu Trigger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-100 hover:text-brand-orange p-1 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-slate-950 border-t border-slate-900 overflow-hidden"
            >
              <nav className="flex flex-col p-6 gap-4 text-sm font-semibold uppercase tracking-wider">
                <a href="#bento-dashboard" onClick={(e) => handleScrollTo(e, "bento-dashboard")} className="py-2 border-b border-slate-900 text-slate-300 hover:text-brand-orange">Explorer</a>
                <a href="#fleet" onClick={(e) => handleScrollTo(e, "fleet")} className="py-2 border-b border-slate-900 text-slate-300 hover:text-brand-orange">Bikes Fleet</a>
                <a href="#services" onClick={(e) => handleScrollTo(e, "services")} className="py-2 border-b border-slate-900 text-slate-300 hover:text-brand-orange">Adventures</a>
                <a href="#calculator" onClick={(e) => handleScrollTo(e, "calculator")} className="py-2 border-b border-slate-900 text-slate-300 hover:text-brand-orange">Estimator</a>
                <a href="#why-choose" onClick={(e) => handleScrollTo(e, "why-choose")} className="py-2 border-b border-slate-900 text-slate-300 hover:text-brand-orange">Perks</a>
                <a href="#faqs" onClick={(e) => handleScrollTo(e, "faqs")} className="py-2 text-slate-300 hover:text-brand-orange">FAQs</a>
                
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-900">
                  <a 
                    href="https://wa.me/917500130809?text=Hi%20there%2C%20I'd%20like%20to%20enquire%20about%20bike%20rentals%20in%20Rishikesh." 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="bg-brand-orange text-center text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs"
                  >
                    Send WhatsApp Message
                  </a>
                  <a 
                    href="https://maps.app.goo.gl/Ue7im4KD2oweJMCq9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border border-slate-800 bg-slate-900 text-center text-slate-300 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    <span>View Map Location</span>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Decorative background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[50rem] h-[50rem] bg-violet-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Body Grid Area starting with Bento Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        
        {/* 2. Bento Grid Section */}
        <section className="mb-20 scroll-mt-24" id="bento-dashboard">
          
          <div className="text-center md:text-left mb-8 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Rishikesh's #1 Premium Operator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
              Experience <span className="text-brand-orange">Rishikesh.</span> Explore Freedom.
            </h1>
            <p className="text-sm text-slate-400 mt-2 font-light">
              We offer low transparent rates, dual helmets, easy secure verification, and premium maintained scooters for your sacred Himalayan wanderlust.
            </p>
          </div>

          {/* Master Bento grid arrangement (12 Cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-[minmax(180px,_auto)]">
            
            {/* Box A: Main Hero Promo (Large banner grid item - Spans 8 cols on desktop, Spans 2 rows) */}
            <div className="lg:col-span-8 lg:row-span-2 relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-9 flex flex-col justify-between group shadow-xl">
              {/* Cover background visual image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80" 
                  alt="Holy Ganges mountains in Rishikesh" 
                  className="w-full h-full object-cover opacity-20 object-center group-hover:scale-105 transition-transform duration-[6000ms] pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
              </div>

              {/* Top Row content */}
              <div className="relative z-10 self-start">
                <div className="text-brand-orange text-[10px] uppercase font-bold tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 inline-block mb-3">
                  Mountain Wanderer Package
                </div>
                <h3 className="text-2xl sm:text-4.5xl font-heading font-extrabold text-white leading-tight max-w-lg">
                  Explore scenic mountains, cozy cafes, and the mystic Ganga trail on premium rides.
                </h3>
              </div>

              {/* Bottom Row content */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-8 sm:mt-12 pt-6 border-t border-slate-800/60">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-slate-400 tracking-widest">Local Rates Start At</p>
                  <p className="text-2.5xl font-mono font-black text-brand-orange leading-none">
                    ₹400 <span className="text-xs text-slate-400 font-sans tracking-normal uppercase">/ Day</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="#fleet" 
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all inline-flex items-center gap-2"
                  >
                    <span>View Available Fleet</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="border border-slate-700 bg-slate-900/80 hover:bg-slate-900/100 hover:border-slate-600 text-xs text-white font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all"
                  >
                    Inquire Availability
                  </button>
                </div>
              </div>
            </div>

            {/* Box B: Fleet Quick Categories (cols 4, rows 1) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Select Category</h4>
                  <p className="text-lg font-heading font-black text-white mt-1">Rent by Riding Vibe</p>
                </div>
                <Bike className="w-5 h-5 text-brand-orange" />
              </div>

              {/* Mini quick-links category filters */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button 
                  onClick={() => {
                    setSelectedCategory("cruiser");
                    const element = document.getElementById("fleet");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-brand-orange p-2.5 rounded-xl text-center transition-colors group/btn"
                >
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 group-hover:text-brand-orange leading-none mb-1.5">Retro</span>
                  <span className="text-xs font-bold text-slate-100">Bullet</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory("adventure");
                    const element = document.getElementById("fleet");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-brand-orange p-2.5 rounded-xl text-center transition-colors"
                >
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 leading-none mb-1.5">Dual-Sport</span>
                  <span className="text-xs font-bold text-slate-100">Trek</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedCategory("scooter");
                    const element = document.getElementById("fleet");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-slate-950 border border-slate-800 hover:border-brand-orange p-2.5 rounded-xl text-center transition-colors"
                >
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 leading-none mb-1.5">Gearless</span>
                  <span className="text-xs font-bold text-slate-100">Scooty</span>
                </button>
              </div>
            </div>

            {/* Box C: Live Local Guides Attractions Route Guide Map (cols 4, rows 1) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-brand-orange/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Rider Route Guide</h4>
                  <p className="text-lg font-heading font-black text-white mt-1">Scenic Attractions</p>
                </div>
                <Navigation className="w-5 h-5 text-brand-orange animate-pulse" />
              </div>

              {/* Destinations List with Direct Map Redirection */}
              <div className="space-y-2 mt-4">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Beatles+Ashram+Rishikesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-slate-950/70 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-all duration-200 group/item"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange group-hover/item:scale-110 transition-transform" />
                    <span className="text-slate-200 font-sans text-xs font-semibold">Beatles Ashram</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400 text-[10px]">~4 KM</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/item:text-brand-orange transition-colors" />
                  </div>
                </a>

                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Neer+Garh+Waterfall+Rishikesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-slate-950/70 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-all duration-200 group/item"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange group-hover/item:scale-110 transition-transform" />
                    <span className="text-slate-200 font-sans text-xs font-semibold">Neer Waterfall</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400 text-[10px]">~6 KM</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/item:text-brand-orange transition-colors" />
                  </div>
                </a>

                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Shivpuri+Rishikesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-slate-950/70 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-all duration-200 group/item"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange group-hover/item:scale-110 transition-transform" />
                    <span className="text-slate-200 font-sans text-xs font-semibold">Shivpuri Valley</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400 text-[10px]">~15 KM</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover/item:text-brand-orange transition-colors" />
                  </div>
                </a>
              </div>

              <div className="mt-3 text-[10px] text-slate-500 font-sans leading-tight">
                * Select any destination to view active street routes and direct GPS coordinate navigation on your device offline.
              </div>
            </div>

            {/* Box D: River Rafting Booking Promo (cols 4, rows 1) */}
            <div id="services" className="lg:col-span-4 lg:row-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group scroll-mt-24">
              <div className="absolute inset-0 z-0 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=400&q=80" 
                  alt="Ganga White River Rafting" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-emerald-400 tracking-widest flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    <span>Adventure Thrills</span>
                  </h4>
                  <p className="text-lg font-heading font-black text-white mt-1">River Rafting</p>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-1 rounded font-bold">₹800/person</span>
              </div>
              <p className="relative z-10 text-[11px] text-slate-400 leading-normal mb-3 font-light">Grade III+ whitewaters. Slots include certified life jackets, rafts and store shuttle.</p>
              <a 
                href="https://wa.me/917500130809?text=Hi!%20I%20want%20to%20enquire%20and%20book%20the%20Ganga%20White%20Water%20River%20Rafting%20with%20experienced%20local%20guides." 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="relative z-10 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center py-2.5 rounded-xl text-xs transition shadow-md"
              >
                Inquire Rafting Slot
              </a>
            </div>

            {/* Box E: Taxi Outstation service (cols 4, rows 1) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Ac Cab Service</h4>
                  <p className="text-lg font-heading font-black text-white mt-1">Taxi & Drops</p>
                </div>
                <Car className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-light">Hassle-free AC taxi drops to Jolly Grant Airport (Dehradun), Haridwar Station, and Nilkanth Temple.</p>
              <a 
                href="https://wa.me/917500130809?text=Hi!%20I%20want%20to%20know%20the%20rates%20or%20book%20a%20local/outstation%20AC%20pick-up%20or%20airport%20drop." 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-full border border-slate-800 bg-slate-950/80 hover:bg-slate-950 text-slate-300 font-bold text-center py-2.5 rounded-xl text-xs transition"
              >
                Get Taxi Quotes
              </a>
            </div>

            {/* Box F: Exteme Bungee & Camping combos (cols 4, rows 1) */}
            <div className="lg:col-span-4 lg:row-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Luxury Outings</h4>
                  <p className="text-lg font-heading font-black text-white mt-1">Camping & Bungee</p>
                </div>
                <Tent className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-light">Mohan Chatti's highest 83-meter platform bungee jumps, riverside camps, and zipline bookings.</p>
              <a 
                href="https://wa.me/917500130809?text=Hi!%20I'd%20like%20to%20inquire%20about%20your%20Bungee%20Jumping%20slots%20and%20Riverside%20luxury%20camping%20packages%20in%20Rishikesh." 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-full border border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900 hover:from-slate-950 hover:to-slate-950 text-slate-300 font-bold text-center py-2.5 rounded-xl text-xs transition"
              >
                Inquire Camp Packages
              </a>
            </div>

          </div>
        </section>

        {/* 3. Interactive Pricing Estimator & Discount Engine Card */}
        <section className="mb-20 scroll-mt-24" id="calculator">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/[0.03] rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Calculator Form Controls */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-3 py-1 rounded-full">
                    Zero Surprise Pricing
                  </span>
                  <h2 className="text-2.5xl sm:text-3.5xl font-heading font-black text-white mt-3">
                    Estimate Your Rental Package Cost
                  </h2>
                  <p className="text-xs text-slate-450 mt-1 font-light">
                    Adjust vehicle choices and rental days to unlock instant sliding discounts! We never include hidden taxes.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Select Vehicle */}
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      Select Riding Machine
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FLEET.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          onClick={() => setEstVehicleId(vehicle.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            estVehicleId === vehicle.id 
                              ? "bg-slate-950 border-brand-orange/80 shadow-lg shadow-brand-orange/5 text-white" 
                              : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                          }`}
                        >
                          <span className="block text-xs font-bold leading-none">{vehicle.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">₹{vehicle.basePrice}/day</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Days Slider */}
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Rental Duration</span>
                        <span className="text-sm font-mono font-black text-brand-orange">{estDays} {estDays === 1 ? "Day" : "Days"}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="14" 
                        value={estDays}
                        onChange={(e) => setEstDays(parseInt(e.target.value))}
                        className="w-full accent-brand-orange h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                        <span>1 Day</span>
                        <span>7 Days (20% Off)</span>
                        <span>14 Days</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Quantity (Bikes)</span>
                        <span className="text-sm font-mono font-black text-white">{estQuantity} Unit(s)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <button 
                          onClick={() => setEstQuantity(Math.max(1, estQuantity - 1))}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 py-1.5 rounded-lg flex justify-center items-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setEstQuantity(Math.min(10, estQuantity + 1))}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 py-1.5 rounded-lg flex justify-center items-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Addons option Checkbox */}
                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="fuelCheck"
                        checked={includeFullTank}
                        onChange={(e) => setIncludeFullTank(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-brand-orange focus:ring-brand-orange accent-brand-orange mt-0.5"
                      />
                      <label htmlFor="fuelCheck" className="cursor-pointer">
                        <span className="block text-xs font-bold text-white">Full Fuel Tank Option</span>
                        <span className="block text-[10px] text-slate-450 leading-relaxed font-light">Deliver ride with full tank of petrol — skip first petrol pump queues entirely.</span>
                      </label>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 ml-4">
                      +{includeFullTank ? `₹${(estVehicle.category === "scooter" ? 450 : 1000) * estQuantity}` : "₹0"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Calculated Outputs Breakdown Block */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
                
                {calculatorResults.discountPercent > 0 && (
                  <div className="absolute -top-3 -right-3 bg-emerald-600 outline outline-4 outline-slate-950 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg shadow-md animate-bounce">
                    SAVED {calculatorResults.discountPercent}%
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest border-b border-slate-900 pb-3">Bill Estimator Estimate</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Base Rental ({estQuantity}x Ride x {estDays} d)</span>
                      <span className="font-mono text-slate-100">₹{calculatorResults.rawTotal.toLocaleString()}</span>
                    </div>

                    {calculatorResults.discountPercent > 0 && (
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Multi-Day Discount ({calculatorResults.discountPercent}%)</span>
                        <span className="font-mono">-₹{calculatorResults.discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {includeFullTank && (
                      <div className="flex justify-between items-center text-slate-350">
                        <span>Add-on (Full tank of fuel)</span>
                        <span className="font-mono text-slate-100">+₹{calculatorResults.fuelCostExtra}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-400 pt-1.5">
                      <span>Hygienic Sanitized Helmets</span>
                      <span className="text-emerald-500 font-bold uppercase">2 FREE</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Breakdown Support Guarantee</span>
                      <span className="text-emerald-500 font-bold uppercase">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-4 flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-450 tracking-wider">Final Payable Price</span>
                      <span className="text-3xl font-mono font-black text-brand-orange mt-1 block">₹{calculatorResults.finalTotal.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-light max-w-[140px] text-right font-sans">Easy check-in policy. Pay on pick-up.</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleEstimateWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Reserve Package on WhatsApp</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 4. Complete Detailed Interactive Fleet Showcase Grid */}
        <section id="fleet" className="py-20 scroll-mt-24 border-t border-slate-900">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-white text-xs uppercase font-extrabold tracking-widest bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full inline-block">
              Pristinely Maintained Fleet
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
              Choose Your Sacred Mountain Machine
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Filter by vehicle layout class. Standard 100% mechanical inspections before every rider checkout.
            </p>

            {/* Sub Filter Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              {[
                { label: "All Fleet", value: "all" },
                { label: "Bullets & Cruisers", value: "cruiser" },
                { label: "Mountain Trekkers", value: "adventure" },
                { label: "Sleek Scooters", value: "scooter" }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value as any)}
                  className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition ${
                    selectedCategory === tab.value 
                      ? "bg-brand-orange text-white" 
                      : "bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-355"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Gallery Grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map(vehicle => (
              <div 
                key={vehicle.id} 
                className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl hover:border-brand-orange/30 transition duration-300 flex flex-col justify-between group"
              >
                
                <div>
                  {/* Photo relative wrapper */}
                  <div className="relative h-52 bg-slate-950 overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest text-brand-orange">
                      {vehicle.cc} ENGINES
                    </div>
                    {vehicle.rating >= 4.9 && (
                      <span className="absolute top-3 right-3 bg-rose-600 text-white font-mono text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                        TOP RATED
                      </span>
                    )}
                  </div>

                  {/* Body information content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-heading font-black text-white group-hover:text-brand-orange transition-colors">
                          {vehicle.name}
                        </h3>
                        <p className="text-[10px] font-light text-slate-500 mt-1 uppercase tracking-wider">
                          Best for: {vehicle.recommendedFor}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-slate-950/60 px-2 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{vehicle.rating}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-850 pt-4">
                      <p className="text-xs text-slate-400 font-semibold mb-2">Technical Specifications:</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-450">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-650" />
                          <span>Cap: {vehicle.fuelCap}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-650" />
                          <span>Mil: {vehicle.mileage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features block */}
                    <div className="space-y-1.5 pt-1">
                      {vehicle.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-350">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA bottoms layout */}
                <div className="p-6 bg-slate-950 border-t border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Rent Cost</span>
                    <span className="text-1.5xl font-mono font-black text-white">
                      ₹{vehicle.basePrice} <span className="text-xs text-slate-500">/ day</span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEstVehicleId(vehicle.id);
                        const element = document.getElementById("calculator");
                        if (element) element.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs uppercase"
                    >
                      Estimate
                    </button>
                    <button
                      onClick={() => handleDirectBook(vehicle.name)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-xl text-xs flex items-center gap-1 shadow-md"
                      title="Direct Book on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Book Ride</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* 5. Why Choose Us Premium Perks section */}
        <section id="why-choose" className="py-20 scroll-mt-24 border-t border-slate-900 relative">
          <div className="absolute left-0 bottom-0 w-72 h-72 bg-brand-orange/[0.02] rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual showcase card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-orange rounded-3xl blur-2xl opacity-10" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-2xl w-fit">
                  <Award className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-heading font-black text-white">Prudent Local Safety Verification</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                    Unlike heavy aggregators, we are family-held local boutique operators. We supervise each safety check ourselves right at our shop in Laxman Jhula, Rishikesh.
                  </p>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-6">
                  {[
                    "Standard secure document validation for all fleets",
                    "Dual thoroughly sanitized sanitized Helmets completely free",
                    "Real local tips, route guides, and secret café shortcuts",
                    "Guaranteed roadside companion for Himalayan roads"
                  ].map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-xs text-slate-300 font-light">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right details content columns */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-brand-orange">
                  Premium Quality Standards
                </span>
                <h2 className="text-3xl sm:text-4.5xl font-heading font-black text-white mt-2 leading-tight">
                  Seamless Riding Built Purely for Travelers
                </h2>
                <p className="text-sm text-slate-400 font-light">
                  No hidden margins. No sudden price hiking on tourist weekends. Explore the sacred temples, cascading mountain waters, and holy ghats in peace.
                </p>
              </div>

              {/* Grid 2x2 of details items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                
                <div className="space-y-2">
                  <div className="text-brand-orange font-bold text-lg font-heading">
                    01. Quick Check-In
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Get ready to ride in minutes! No redundant paperwork or loops. Simply hand over standard valid driving documents on arrival.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-brand-orange font-bold text-lg font-heading">
                    02. Sanitized Dual Safety
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Both rider and pillion passenger receive fresh, clean, high-performance helmets strictly prepared after chemical cleaning.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-brand-orange font-bold text-lg font-heading">
                    03. 24/7 Support Net
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Stuck near Nilkanth climbs or remote waterfall tracks? Our trained mechanic team rushes with replacement units instantly.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-brand-orange font-bold text-lg font-heading">
                    04. Clean In-Site Location
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Our shop is situated at Hotel Tourist Home, directly opposite the Taxi Stand, Laxman Jhula, making bike pick-ups incredibly simple.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 6. Accordion Frequently Asked Questions (FAQ) Section */}
        <section id="faqs" className="py-20 scroll-mt-24 border-t border-slate-900">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-white text-xs uppercase font-extrabold tracking-widest bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full inline-block">
              Faq Guide
            </span>
            <h2 className="text-3xl font-heading font-black text-white">
              Rider Queries & Answers
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Here is exactly what you need to know before checking out your mountain motorcycle.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i} 
                  className="bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : i)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-brand-orange shrink-0 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-6 pt-0 border-t border-slate-900/40 text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer Area with store coordinates */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-semibold mb-4">
            <a href="#bento-dashboard" className="hover:text-brand-orange">Explorer Home</a>
            <a href="#fleet" className="hover:text-brand-orange">Vehicle Fleet</a>
            <a href="#services" className="hover:text-brand-orange">Adventures</a>
            <a href="#calculator" className="hover:text-brand-orange">Price Estimator</a>
            <a href="#why-choose" className="hover:text-brand-orange">Perks</a>
            <a href="#faqs" className="hover:text-brand-orange">FAQs</a>
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed font-light">
            © 2026 Laxman Jhula Bike Rental Store • Hotel Tourist Home, Opposite Taxi Stand, Laxman Jhula, Rishikesh, Uttarakhand - 249302.
            All motor vehicles serviced directly under authorized engineer parameters. WhatsApp Reservations active 24/7.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-[10px] text-slate-600 font-mono">
            <span>📞 Call Inquiries: +91 75001 30809</span>
            <span>|</span>
            <a 
              href="https://maps.app.goo.gl/Ue7im4KD2oweJMCq9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-orange hover:underline flex items-center gap-1"
            >
              <span>📍 Hotel Tourist Home, Laxman Jhula (Open Map)</span>
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
          </div>
        </div>
      </footer>

      {/* 7. Interactive Instant Availability Action Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop layout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Content Dialog box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl z-10"
            >
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white pointer bg-slate-950 p-1.5 rounded-lg border border-slate-800"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-heading font-black text-white mb-2">Check Ride Availability</h3>
              <p className="text-xs text-slate-400 mb-6 font-light">
                Submit your target travel timestamps to launch a customized verification request with our store coordinator over WhatsApp.
              </p>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                
                {/* Rider Name */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:border-brand-orange focus:outline-none transition"
                  />
                </div>

                {/* Bike Choice */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1.5 font-sans">Choose Vehicle Class</label>
                  <select 
                    value={inquiryBikeId}
                    onChange={(e) => setInquiryBikeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:border-brand-orange focus:outline-none transition appearance-none"
                  >
                    {FLEET.map(v => (
                      <option key={v.id} value={v.id}>{v.name} (Base - ₹{v.basePrice}/day)</option>
                    ))}
                  </select>
                </div>

                {/* Date & Duration Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Start Date</label>
                    <input 
                      type="date" 
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:border-brand-orange focus:outline-none transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold mb-1.5">Duration (Days)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30"
                      value={inquiryDays}
                      onChange={(e) => setInquiryDays(parseInt(e.target.value))}
                      required
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:border-brand-orange focus:shadow focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* Unit Quantity */}
                <div>
                  <label className="block text-slate-400 text-[11px] font-semibold mb-1.5">Quantity (Bikes Count)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={inquiryQty}
                    onChange={(e) => setInquiryQty(parseInt(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:border-brand-orange focus:outline-none transition font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 mt-6"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Verify Availability on WhatsApp</span>
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
