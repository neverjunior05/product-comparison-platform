import type { Product, Review } from "../types";
import { px } from "./categories";

/* ------------------------------------------------------------------ */
/*  Mock review helper                                                 */
/* ------------------------------------------------------------------ */
let reviewSeq = 0;
const r = (
  author: string,
  rating: number,
  date: string,
  title: string,
  body: string,
  helpful = 0,
  verified = true,
): Review => ({ id: `rv-${++reviewSeq}`, author, rating, date, title, body, helpful, verified });

/* ------------------------------------------------------------------ */
/*  Image pools (Pexels) — main shot + two lifestyle shots per product */
/* ------------------------------------------------------------------ */
const PHONE = { a: 10883732, b: 6753223, c: 13588948, d: 8148581, e: 30466731, f: 6373126, g: 21424627, h: 12166786 };
const LAPTOP = { a: 12951088, b: 7652541, c: 8534373, d: 8068269, e: 5793939, f: 8961409, g: 8534377, h: 265136 };
const AUDIO = { a: 7772548, b: 33298189, c: 14935011, d: 3394666, e: 27350775, f: 577769, g: 3394656, h: 18254091 };
const CAMERA = { a: 19969463, b: 39442512, c: 22032367, d: 19969436, e: 17345669, f: 16359297, g: 35691842, h: 34047962 };

export const PRODUCTS: Product[] = [
  /* ================================================================ */
  /*  SMARTPHONES                                                      */
  /* ================================================================ */
  {
    id: "lumen-pro-9",
    categoryId: "smartphones",
    brand: "Lumen",
    name: "Lumen Pro 9",
    tagline: "The flagship that finally nails battery life.",
    description:
      "A titanium-framed flagship with a 6.3-inch 120 Hz display, a 5× periscope telephoto and the most efficient chip Lumen has ever shipped. Two-day battery life is realistic, not marketing.",
    price: 999,
    rating: 4.7,
    reviewCount: 2184,
    badge: "Editor's Choice",
    image: px(PHONE.a),
    gallery: [px(PHONE.a), px(PHONE.g), px(PHONE.h)],
    highlights: ["5× periscope telephoto", "2-day battery life", "Titanium frame", "7 years of updates"],
    specs: {
      releaseYear: 2025, displaySize: 6.3, resolution: "2622 × 1206", refreshRate: 120, brightness: 2000,
      processor: "Lumen L9 Fusion", ram: 12, storage: 256,
      mainCamera: 50, opticalZoom: 5, frontCamera: 12, videoMax: "4K @ 120 fps",
      battery: 4700, wiredCharging: 45, wirelessCharging: true,
      weight: 187, waterResistance: "IP68", fiveG: true, warranty: 2,
    },
    reviews: [
      r("Priya N.", 5, "2025-11-02", "Finally, a flagship that lasts", "I end most days at 45% with heavy camera use. The telephoto is genuinely sharp at 5× and the phone stays cool during video.", 142),
      r("Marcus T.", 4, "2025-10-18", "Great, but charging is slow-ish", "Everything about this phone feels premium. 45 W charging is fine but competitors at this price do 80–100 W.", 67),
      r("Elena R.", 5, "2025-09-30", "Best camera I've owned", "Portrait mode edge detection is uncanny. Low-light shots look like they came from a real camera.", 88),
    ],
  },
  {
    id: "arc-nova-x",
    categoryId: "smartphones",
    brand: "Arc",
    name: "Arc Nova X",
    tagline: "AI-first camera system in a featherweight frame.",
    description:
      "Arc's Nova X pairs the brightest display in its class with on-device AI photo tools that actually feel useful. The 42 MP selfie camera is the best in the business for video calls.",
    price: 849,
    rating: 4.5,
    reviewCount: 1402,
    badge: "New",
    image: px(PHONE.b),
    gallery: [px(PHONE.b), px(PHONE.f), px(PHONE.a)],
    highlights: ["2600-nit display", "42 MP front camera", "On-device AI editing", "7 years of updates"],
    specs: {
      releaseYear: 2025, displaySize: 6.4, resolution: "2780 × 1264", refreshRate: 120, brightness: 2600,
      processor: "Arc Tensor N4", ram: 12, storage: 256,
      mainCamera: 50, opticalZoom: 5, frontCamera: 42, videoMax: "4K @ 60 fps",
      battery: 4800, wiredCharging: 37, wirelessCharging: true,
      weight: 199, waterResistance: "IP68", fiveG: true, warranty: 2,
    },
    reviews: [
      r("Jordan K.", 5, "2025-10-27", "The screen is unreal outdoors", "I shoot a lot in direct sun and I can actually see the viewfinder. The AI eraser removed a tourist in two taps.", 51),
      r("Sam W.", 4, "2025-10-05", "Software is the star", "Camera processing is a touch aggressive on skin tones, but call screening and the summaries are features I now can't live without.", 29),
    ],
  },
  {
    id: "kestrel-edge-5",
    categoryId: "smartphones",
    brand: "Kestrel",
    name: "Kestrel Edge 5",
    tagline: "Flagship speed without the flagship price.",
    description:
      "A 144 Hz display, 16 GB of RAM, a 5,500 mAh battery and 100 W charging for under $700. Kestrel skipped wireless charging and a top-tier IP rating to hit the number — and it shows where it counts.",
    price: 699,
    compareAtPrice: 749,
    rating: 4.4,
    reviewCount: 987,
    badge: "Best Value",
    image: px(PHONE.c),
    gallery: [px(PHONE.c), px(PHONE.h), px(PHONE.b)],
    highlights: ["100 W charging (0–100% in 26 min)", "144 Hz display", "16 GB RAM / 512 GB", "5,500 mAh battery"],
    specs: {
      releaseYear: 2024, displaySize: 6.7, resolution: "2412 × 1080", refreshRate: 144, brightness: 1600,
      processor: "Snapdragon 8s Gen 3", ram: 16, storage: 512,
      mainCamera: 50, opticalZoom: 3, frontCamera: 32, videoMax: "4K @ 60 fps",
      battery: 5500, wiredCharging: 100, wirelessCharging: false,
      weight: 205, waterResistance: "IP65", fiveG: true, warranty: 1,
    },
    reviews: [
      r("Dev P.", 5, "2025-08-14", "Charging speed changes your habits", "I just plug it in while I shower. Done. Gaming performance is also excellent for the money.", 203),
      r("Hannah L.", 4, "2025-07-22", "Great value, average camera", "Daylight shots are fine; night mode lags the big names. For $700, I'm not complaining.", 44),
    ],
  },
  {
    id: "halo-one-lite",
    categoryId: "smartphones",
    brand: "Halo",
    name: "Halo One Lite",
    tagline: "Clean software, big battery, honest price.",
    description:
      "The best-selling phone on SpecSide for a reason: a bloat-free OS, a 5,000 mAh battery and a surprisingly capable 48 MP main camera at a price that doesn't require financing.",
    price: 449,
    rating: 4.2,
    reviewCount: 3310,
    badge: "Best Seller",
    image: px(PHONE.d),
    gallery: [px(PHONE.d), px(PHONE.g), px(PHONE.c)],
    highlights: ["5,000 mAh battery", "Clean, ad-free software", "48 MP main camera", "Headphone jack"],
    specs: {
      releaseYear: 2024, displaySize: 6.5, resolution: "2400 × 1080", refreshRate: 90, brightness: 1200,
      processor: "Halo H2 Core", ram: 8, storage: 128,
      mainCamera: 48, opticalZoom: 1, frontCamera: 16, videoMax: "4K @ 30 fps",
      battery: 5000, wiredCharging: 33, wirelessCharging: false,
      weight: 192, waterResistance: "IP54", fiveG: true, warranty: 2,
    },
    reviews: [
      r("Tom B.", 4, "2025-06-10", "Bought two for my parents", "Easy to set up, battery lasts them three days, and nothing confusing in the UI.", 310),
      r("Aisha M.", 4, "2025-05-28", "Shockingly good for $449", "128 GB fills up fast, but otherwise this does 95% of what my old flagship did.", 97),
      r("Luis G.", 3, "2025-04-02", "Camera struggles at night", "Daytime photos are great. Indoors and at night, there's noticeable noise. Fine for the price.", 23),
    ],
  },
  {
    id: "vantage-ultra-2",
    categoryId: "smartphones",
    brand: "Vantage",
    name: "Vantage Ultra 2",
    tagline: "A 200 MP camera with a stylus in your pocket.",
    description:
      "The maximalist's phone: a 6.9-inch QHD+ display, 200 MP main sensor, built-in stylus and the fastest mobile chip available. Heavy, expensive and hard to fault on specs.",
    price: 1199,
    rating: 4.8,
    reviewCount: 1756,
    image: px(PHONE.e),
    gallery: [px(PHONE.e), px(PHONE.a), px(PHONE.f)],
    highlights: ["200 MP main camera", "Built-in stylus", "6.9\" QHD+ 120 Hz", "8K video"],
    specs: {
      releaseYear: 2025, displaySize: 6.9, resolution: "3120 × 1440", refreshRate: 120, brightness: 2600,
      processor: "Snapdragon 8 Elite", ram: 12, storage: 512,
      mainCamera: 200, opticalZoom: 5, frontCamera: 12, videoMax: "8K @ 30 fps",
      battery: 5000, wiredCharging: 45, wirelessCharging: true,
      weight: 218, waterResistance: "IP68", fiveG: true, warranty: 2,
    },
    reviews: [
      r("Nadia F.", 5, "2025-10-11", "A laptop replacement for me", "Desktop mode on a monitor plus the stylus means I leave the laptop at home most days.", 76),
      r("Chris O.", 5, "2025-09-19", "The zoom is absurd", "30× shots are usable. 100× is a party trick, but 5× and 10× are genuinely great.", 112),
    ],
  },
  {
    id: "orbit-mini",
    categoryId: "smartphones",
    brand: "Orbit",
    name: "Orbit Mini",
    tagline: "The compact flagship for people who hate big phones.",
    description:
      "A 5.9-inch phone that weighs 162 g and still packs a 120 Hz OLED, wireless charging and a proper IP68 rating. Battery life is the trade-off — expect a full day, not two.",
    price: 599,
    rating: 4.3,
    reviewCount: 612,
    image: px(PHONE.f),
    gallery: [px(PHONE.f), px(PHONE.d), px(PHONE.g)],
    highlights: ["162 g — lightest in class", "One-handed friendly", "IP68 + wireless charging", "120 Hz OLED"],
    specs: {
      releaseYear: 2024, displaySize: 5.9, resolution: "2340 × 1080", refreshRate: 120, brightness: 1800,
      processor: "Orbit O3", ram: 8, storage: 256,
      mainCamera: 50, opticalZoom: 2, frontCamera: 12, videoMax: "4K @ 60 fps",
      battery: 4100, wiredCharging: 30, wirelessCharging: true,
      weight: 162, waterResistance: "IP68", fiveG: true, warranty: 2,
    },
    reviews: [
      r("Mei L.", 5, "2025-07-30", "Small phones are back", "Fits in every pocket, reaches every corner of the screen with one thumb. I don't miss the extra half inch.", 58),
      r("Ben S.", 4, "2025-06-15", "Battery is the compromise", "Gets me to bedtime with ~15% left. Everything else is lovely.", 31),
    ],
  },

  /* ================================================================ */
  /*  LAPTOPS                                                          */
  /* ================================================================ */
  {
    id: "arcline-air-14",
    categoryId: "laptops",
    brand: "Arcline",
    name: "Arcline Air 14",
    tagline: "All-day battery in a 1.2 kg chassis.",
    description:
      "Fanless, silent and genuinely all-day. The Air 14 is the laptop to beat for students and anyone who lives in a browser, with a keyboard and trackpad that remain the gold standard.",
    price: 1199,
    rating: 4.7,
    reviewCount: 2044,
    badge: "Editor's Choice",
    image: px(LAPTOP.a),
    gallery: [px(LAPTOP.a), px(LAPTOP.g), px(LAPTOP.h)],
    highlights: ["18-hour battery", "Fanless, silent design", "1.24 kg", "Best-in-class trackpad"],
    specs: {
      releaseYear: 2025, displaySize: 13.6, resolution: "2560 × 1664", panel: "IPS LCD", refreshRate: 60, brightness: 500,
      processor: "Arcline A4 (10-core)", gpu: "Integrated 10-core", ram: 16, storage: 512,
      batteryLife: 18, chargingWatts: 35,
      weight: 1.24, thickness: 11.3, ports: "2× USB-C / TB4, MagCharge, 3.5 mm", webcam: "1080p", os: "ArcOS 15", warranty: 1,
    },
    reviews: [
      r("Olivia C.", 5, "2025-10-20", "Forgot my charger for a week", "Seriously — a week of lectures and note-taking on one charge plus a top-up. Zero fan noise ever.", 189),
      r("Raj K.", 4, "2025-09-12", "Wish it had 120 Hz", "Performance and battery are unmatched, but the 60 Hz screen feels dated next to the OLED competition.", 64),
    ],
  },
  {
    id: "kestrel-pro-16",
    categoryId: "laptops",
    brand: "Kestrel",
    name: "Kestrel Pro 16",
    tagline: "Desktop-class creation, anywhere.",
    description:
      "A 16-inch mini-LED canvas with 1,600 nits of HDR brightness, a 14-core chip and 22 hours of battery. If you render, grade or compile for a living, this is the one.",
    price: 2399,
    rating: 4.8,
    reviewCount: 863,
    image: px(LAPTOP.b),
    gallery: [px(LAPTOP.b), px(LAPTOP.d), px(LAPTOP.c)],
    highlights: ["Mini-LED 120 Hz HDR display", "22-hour battery", "32 GB RAM / 1 TB SSD", "SD card + HDMI 2.1"],
    specs: {
      releaseYear: 2025, displaySize: 16.2, resolution: "3456 × 2234", panel: "Mini-LED", refreshRate: 120, brightness: 1600,
      processor: "Kestrel K4 Pro (14-core)", gpu: "Discrete 20-core", ram: 32, storage: 1024,
      batteryLife: 22, chargingWatts: 140,
      weight: 2.14, thickness: 16.8, ports: "3× TB5, HDMI 2.1, SDXC, 3.5 mm", webcam: "1080p", os: "KestrelOS", warranty: 1,
    },
    reviews: [
      r("Diego M.", 5, "2025-11-01", "Exports 4K faster than my desktop", "The display alone is worth it for color work. Battery life while editing is still 8–9 hours.", 97),
      r("Sophie A.", 5, "2025-10-03", "Heavy, but worth it", "You feel the 2.1 kg in a backpack. You also feel the performance the moment you open a 2 GB project file.", 41),
    ],
  },
  {
    id: "lumen-book-13",
    categoryId: "laptops",
    brand: "Lumen",
    name: "Lumen Book 13",
    tagline: "A premium OLED ultraportable under $900.",
    description:
      "A 2.8K OLED panel, 1.17 kg magnesium chassis and a full port selection at a mid-range price. Battery life is average, but the screen punches far above its class.",
    price: 899,
    compareAtPrice: 999,
    rating: 4.3,
    reviewCount: 1220,
    badge: "Best Value",
    image: px(LAPTOP.c),
    gallery: [px(LAPTOP.c), px(LAPTOP.f), px(LAPTOP.a)],
    highlights: ["2.8K OLED display", "1.17 kg — lightest here", "USB-A + HDMI included", "Fingerprint + IR face unlock"],
    specs: {
      releaseYear: 2024, displaySize: 13.3, resolution: "2880 × 1800", panel: "OLED", refreshRate: 60, brightness: 400,
      processor: "Intel Core Ultra 5 125U", gpu: "Intel Arc (integrated)", ram: 16, storage: 512,
      batteryLife: 12, chargingWatts: 65,
      weight: 1.17, thickness: 14.9, ports: "2× TB4, USB-A, HDMI 2.1, 3.5 mm", webcam: "1080p IR", os: "Windows 11 Home", warranty: 1,
    },
    reviews: [
      r("Grace H.", 4, "2025-08-22", "That screen for $899?", "OLED blacks, great colors, light enough to forget it's in my bag. Fans spin up under load, but it's quiet.", 73),
      r("Ethan V.", 4, "2025-07-09", "Solid all-rounder", "Battery is a real-world 9–10 hours. Keyboard is good, trackpad is fine. Hard to beat at this price.", 28),
    ],
  },
  {
    id: "vantage-creator-15",
    categoryId: "laptops",
    brand: "Vantage",
    name: "Vantage Creator 15",
    tagline: "Color-accurate 4K OLED with RTX graphics for creators.",
    description:
      "Built for 3D, video and photo work: a factory-calibrated 4K OLED, an RTX 4070 and a Core Ultra 9. Battery life is modest — this is a desk-first machine that happens to travel.",
    price: 1799,
    rating: 4.6,
    reviewCount: 541,
    image: px(LAPTOP.d),
    gallery: [px(LAPTOP.d), px(LAPTOP.b), px(LAPTOP.e)],
    highlights: ["4K OLED, 100% DCI-P3", "NVIDIA RTX 4070", "Full-size SD reader", "2-year warranty"],
    specs: {
      releaseYear: 2025, displaySize: 15.6, resolution: "3840 × 2160", panel: "OLED", refreshRate: 120, brightness: 600,
      processor: "Intel Core Ultra 9 185H", gpu: "NVIDIA RTX 4070 8 GB", ram: 32, storage: 1024,
      batteryLife: 9, chargingWatts: 200,
      weight: 1.86, thickness: 17.9, ports: "2× TB4, 2× USB-A, HDMI 2.1, SDXC, 3.5 mm", webcam: "1080p IR", os: "Windows 11 Pro", warranty: 2,
    },
    reviews: [
      r("Kenji S.", 5, "2025-09-25", "Blender renders in half the time", "Compared to my previous integrated-graphics laptop this is a different universe. The screen is reference quality.", 54),
      r("Laura P.", 4, "2025-08-30", "Bring the charger", "Battery is the weak spot; 5–6 hours in Lightroom. Everything else is excellent.", 37),
    ],
  },
  {
    id: "halo-go-14",
    categoryId: "laptops",
    brand: "Halo",
    name: "Halo Go 14",
    tagline: "Everyday essentials, surprisingly good keyboard.",
    description:
      "A no-nonsense 14-inch laptop with 16 GB of RAM and a 512 GB SSD standard — no upsells needed. The display is dim, but the keyboard and build quality embarrass pricier machines.",
    price: 649,
    rating: 4.1,
    reviewCount: 2970,
    badge: "Best Seller",
    image: px(LAPTOP.e),
    gallery: [px(LAPTOP.e), px(LAPTOP.a), px(LAPTOP.g)],
    highlights: ["16 GB RAM standard", "Great keyboard", "Upgradeable SSD", "Under $650"],
    specs: {
      releaseYear: 2024, displaySize: 14, resolution: "1920 × 1200", panel: "IPS LCD", refreshRate: 60, brightness: 300,
      processor: "AMD Ryzen 5 7535U", gpu: "Radeon 660M (integrated)", ram: 16, storage: 512,
      batteryLife: 10, chargingWatts: 65,
      weight: 1.39, thickness: 17.9, ports: "USB-C, 2× USB-A, HDMI 1.4, 3.5 mm", webcam: "1080p", os: "Windows 11 Home", warranty: 1,
    },
    reviews: [
      r("Monica R.", 4, "2025-06-19", "Perfect for school and office", "Does everything I need, battery lasts a workday, and I love the keyboard. Screen could be brighter.", 142),
      r("Victor N.", 4, "2025-05-14", "Great bones", "I swapped in a 2 TB SSD in ten minutes. Build quality is far better than the price suggests.", 61),
    ],
  },
  {
    id: "orbit-flex-14",
    categoryId: "laptops",
    brand: "Orbit",
    name: "Orbit Flex 2-in-1",
    tagline: "Laptop, tablet and sketchbook in one hinge.",
    description:
      "An ARM-powered convertible with a 2.8K OLED touchscreen, 20-hour battery and a bundled pen. Sleeps and wakes instantly like a phone — the first Windows machine that truly feels like one.",
    price: 1099,
    rating: 4.4,
    reviewCount: 734,
    badge: "New",
    image: px(LAPTOP.f),
    gallery: [px(LAPTOP.f), px(LAPTOP.c), px(LAPTOP.h)],
    highlights: ["360° hinge + pen included", "20-hour battery", "2.8K OLED touch", "1 TB SSD"],
    specs: {
      releaseYear: 2025, displaySize: 14, resolution: "2880 × 1800", panel: "OLED touch", refreshRate: 120, brightness: 500,
      processor: "Snapdragon X Elite", gpu: "Adreno (integrated)", ram: 16, storage: 1024,
      batteryLife: 20, chargingWatts: 65,
      weight: 1.31, thickness: 12.9, ports: "2× USB4, USB-A, 3.5 mm", webcam: "1440p IR", os: "Windows 11 Home", warranty: 2,
    },
    reviews: [
      r("Isabel T.", 5, "2025-10-14", "Note-taking machine", "Tent mode plus the pen in lectures, laptop mode for essays. Battery easily covers two days of classes.", 48),
      r("Noah D.", 4, "2025-09-08", "Check your apps first", "Everything I use runs natively now, but one legacy plugin didn't. Hardware is superb.", 22),
    ],
  },

  /* ================================================================ */
  /*  HEADPHONES                                                       */
  /* ================================================================ */
  {
    id: "sonar-q1-anc",
    categoryId: "headphones",
    brand: "Sonar",
    name: "Sonar Q1 ANC",
    tagline: "Industry-leading noise cancelling, 30-hour battery.",
    description:
      "The benchmark for travel headphones: adaptive ANC that erases jet engines, a 30-hour battery, LDAC support and a fold-flat design that disappears in a bag.",
    price: 349,
    rating: 4.7,
    reviewCount: 4120,
    badge: "Best Seller",
    image: px(AUDIO.a),
    gallery: [px(AUDIO.a), px(AUDIO.h), px(AUDIO.c)],
    highlights: ["Class-leading ANC", "30-hour battery", "LDAC hi-res codec", "Folds flat"],
    specs: {
      type: "Over-ear", driverSize: 30, noiseCancelling: true, transparencyMode: true, spatialAudio: true, codecs: "SBC, AAC, LDAC",
      batteryLife: 30, quickCharge: "3 min → 3 hrs", chargingPort: "USB-C",
      bluetooth: 5.3, multipoint: true, wiredOption: true,
      weight: 250, waterResistance: "None", foldable: true, warranty: 1,
    },
    reviews: [
      r("Amara J.", 5, "2025-10-22", "Silence on a 14-hour flight", "The ANC is witchcraft. Comfortable enough that I forgot I was wearing them during a layover.", 265),
      r("Felix W.", 4, "2025-09-11", "Sound is great, app is clunky", "Tuning is warm and detailed. The companion app nags about updates, but the hardware is superb.", 58),
    ],
  },
  {
    id: "lumen-buds-pro",
    categoryId: "headphones",
    brand: "Lumen",
    name: "Lumen Buds Pro",
    tagline: "Tiny buds, big adaptive ANC.",
    description:
      "True-wireless earbuds with adaptive noise cancelling, aptX Adaptive and a case that charges wirelessly. Eight hours per charge, 30 with the case.",
    price: 229,
    rating: 4.5,
    reviewCount: 6340,
    image: px(AUDIO.b),
    gallery: [px(AUDIO.b), px(AUDIO.g), px(AUDIO.d)],
    highlights: ["Adaptive ANC", "8 hrs + 22 hrs in case", "Wireless charging case", "IPX4 sweat resistant"],
    specs: {
      type: "In-ear (true wireless)", driverSize: 11, noiseCancelling: true, transparencyMode: true, spatialAudio: true, codecs: "SBC, AAC, aptX Adaptive",
      batteryLife: 8, quickCharge: "5 min → 1 hr", chargingPort: "USB-C + Qi wireless",
      bluetooth: 5.4, multipoint: true, wiredOption: false,
      weight: 5.4, waterResistance: "IPX4", foldable: false, warranty: 1,
    },
    reviews: [
      r("Zoe B.", 5, "2025-11-05", "Gym to commute to calls", "They stay put on runs, ANC handles the subway and callers say I sound clear. My daily driver.", 134),
      r("Owen R.", 4, "2025-10-01", "Battery is just OK", "8 hours is fine for a workday; heavy ANC use drops it to ~6. Sound and fit are excellent.", 40),
    ],
  },
  {
    id: "kestrel-studio",
    categoryId: "headphones",
    brand: "Kestrel",
    name: "Kestrel Studio",
    tagline: "Reference-grade sound with 60 hours of play.",
    description:
      "Big 40 mm drivers, aptX Lossless and LDAC, and a 60-hour battery that makes charging a monthly chore. The ANC is good rather than great — these are for people who prioritise sound.",
    price: 399,
    rating: 4.8,
    reviewCount: 1210,
    badge: "Editor's Choice",
    image: px(AUDIO.c),
    gallery: [px(AUDIO.c), px(AUDIO.a), px(AUDIO.h)],
    highlights: ["60-hour battery", "aptX Lossless + LDAC", "USB-C lossless audio", "2-year warranty"],
    specs: {
      type: "Over-ear", driverSize: 40, noiseCancelling: true, transparencyMode: true, spatialAudio: false, codecs: "SBC, AAC, aptX Lossless, LDAC",
      batteryLife: 60, quickCharge: "10 min → 5 hrs", chargingPort: "USB-C (audio + charge)",
      bluetooth: 5.3, multipoint: true, wiredOption: true,
      weight: 290, waterResistance: "None", foldable: false, warranty: 2,
    },
    reviews: [
      r("Theo M.", 5, "2025-10-09", "Closest to my desktop setup", "Over USB-C these sound like wired cans. Bass is tight, mids are honest, nothing is hyped.", 91),
      r("Clara E.", 5, "2025-08-27", "Charged them twice in two months", "The battery claim is real. Slightly heavy for long sessions but the clamp is gentle.", 47),
    ],
  },
  {
    id: "halo-lite",
    categoryId: "headphones",
    brand: "Halo",
    name: "Halo Lite",
    tagline: "Comfortable on-ears that last all week.",
    description:
      "No noise cancelling, no app, no fuss — just a comfortable on-ear design, 50 hours of battery and a pleasantly balanced tuning for $129.",
    price: 129,
    rating: 4.0,
    reviewCount: 2205,
    badge: "Best Value",
    image: px(AUDIO.d),
    gallery: [px(AUDIO.d), px(AUDIO.e), px(AUDIO.f)],
    highlights: ["50-hour battery", "Only 210 g", "Multipoint pairing", "Folds for travel"],
    specs: {
      type: "On-ear", driverSize: 40, noiseCancelling: false, transparencyMode: false, spatialAudio: false, codecs: "SBC, AAC",
      batteryLife: 50, quickCharge: "10 min → 3 hrs", chargingPort: "USB-C",
      bluetooth: 5.2, multipoint: true, wiredOption: true,
      weight: 210, waterResistance: "None", foldable: true, warranty: 1,
    },
    reviews: [
      r("Ryan A.", 4, "2025-07-18", "Exactly what I wanted", "Light, long battery, decent sound. No ANC is fine at home. For the price, no regrets.", 120),
      r("Simone K.", 3, "2025-06-02", "On-ear fatigue after 2 hours", "Sound is better than expected, but my ears ache on long sessions. Great for commutes.", 36),
    ],
  },
  {
    id: "orbit-air",
    categoryId: "headphones",
    brand: "Orbit",
    name: "Orbit Air",
    tagline: "Open, airy sound in a 190 g frame.",
    description:
      "The lightest over-ear with ANC we've tested. 42 mm drivers deliver a wide, open soundstage, and 35 hours of battery is plenty. Skips multipoint to keep the price down.",
    price: 179,
    rating: 4.2,
    reviewCount: 1540,
    image: px(AUDIO.e),
    gallery: [px(AUDIO.e), px(AUDIO.f), px(AUDIO.g)],
    highlights: ["Lightest ANC over-ear (190 g)", "42 mm drivers", "35-hour battery", "aptX support"],
    specs: {
      type: "Over-ear", driverSize: 42, noiseCancelling: true, transparencyMode: true, spatialAudio: false, codecs: "SBC, AAC, aptX",
      batteryLife: 35, quickCharge: "10 min → 4 hrs", chargingPort: "USB-C",
      bluetooth: 5.3, multipoint: false, wiredOption: true,
      weight: 190, waterResistance: "None", foldable: true, warranty: 1,
    },
    reviews: [
      r("Harper L.", 4, "2025-09-03", "Forgot I had them on", "Weightless. ANC is modest but the comfort and soundstage are superb for the price.", 66),
      r("Ivan P.", 4, "2025-08-11", "Wish for multipoint", "Switching between laptop and phone is manual. Otherwise, lovely headphones.", 19),
    ],
  },
  {
    id: "vantage-quiet-max",
    categoryId: "headphones",
    brand: "Vantage",
    name: "Vantage Quiet Max",
    tagline: "Luxury materials, immersive spatial audio.",
    description:
      "Aluminium cups, a knitted mesh headband and the best spatial audio implementation on the market. Battery life and weight are the compromises for that premium build.",
    price: 449,
    rating: 4.6,
    reviewCount: 980,
    badge: "New",
    image: px(AUDIO.f),
    gallery: [px(AUDIO.f), px(AUDIO.d), px(AUDIO.a)],
    highlights: ["Aluminium + mesh build", "Head-tracked spatial audio", "Excellent transparency mode", "USB-C lossless"],
    specs: {
      type: "Over-ear", driverSize: 40, noiseCancelling: true, transparencyMode: true, spatialAudio: true, codecs: "SBC, AAC",
      batteryLife: 20, quickCharge: "5 min → 1.5 hrs", chargingPort: "USB-C",
      bluetooth: 5.3, multipoint: true, wiredOption: true,
      weight: 385, waterResistance: "None", foldable: false, warranty: 1,
    },
    reviews: [
      r("Lena V.", 5, "2025-10-30", "Transparency mode is uncanny", "It sounds like not wearing headphones. Spatial audio with movies is the best I've heard.", 83),
      r("Omar H.", 4, "2025-09-21", "Heavy, but gorgeous", "385 g is noticeable after two hours. The materials and sound make up for it — mostly.", 45),
    ],
  },

  /* ================================================================ */
  /*  CAMERAS                                                          */
  /* ================================================================ */
  {
    id: "kestrel-k7",
    categoryId: "cameras",
    brand: "Kestrel",
    name: "Kestrel K7",
    tagline: "Stacked sensor speed for wildlife and sport.",
    description:
      "A 26 MP stacked APS-C sensor shooting 40 fps with no blackout, subject-detection autofocus that tracks birds and race cars, and 6.2K open-gate video. A specialist's camera at a generalist's price.",
    price: 1999,
    rating: 4.8,
    reviewCount: 642,
    badge: "Editor's Choice",
    image: px(CAMERA.a),
    gallery: [px(CAMERA.a), px(CAMERA.g), px(CAMERA.h)],
    highlights: ["40 fps blackout-free burst", "Stacked APS-C sensor", "6.2K open-gate video", "Dual card slots"],
    specs: {
      releaseYear: 2024, sensorType: "APS-C stacked CMOS", megapixels: 26, isoMax: 51200, dynamicRange: 13.5,
      burstSpeed: 40, autofocusPoints: 425, stabilization: true, viewfinder: "OLED EVF, 5.76M dots",
      videoResolution: "6.2K @ 30 fps", videoFps: 120, logProfile: true,
      battery: 580, weight: 660, weatherSealed: true, dualCardSlots: true, warranty: 1,
    },
    reviews: [
      r("Gabriel R.", 5, "2025-10-16", "Bird AF is a cheat code", "It locks onto eyes through branches. 40 fps means I always get the wing position I wanted.", 72),
      r("Yuki T.", 5, "2025-09-04", "Video is a bonus, not an afterthought", "6.2K open gate reframes beautifully for vertical. Rolling shutter is basically gone.", 39),
    ],
  },
  {
    id: "lumen-l5",
    categoryId: "cameras",
    brand: "Lumen",
    name: "Lumen L5",
    tagline: "The hybrid shooter most people should buy.",
    description:
      "33 MP of detail, 759 phase-detect AF points covering the whole frame, 4K 60 video and in-body stabilization in a 493 g body. The sensible choice for weddings, travel and YouTube alike.",
    price: 1299,
    rating: 4.5,
    reviewCount: 1108,
    badge: "Best Seller",
    image: px(CAMERA.b),
    gallery: [px(CAMERA.b), px(CAMERA.f), px(CAMERA.d)],
    highlights: ["33 MP APS-C sensor", "759 AF points", "4K 60 fps 10-bit", "Only 493 g"],
    specs: {
      releaseYear: 2024, sensorType: "APS-C CMOS", megapixels: 33, isoMax: 32000, dynamicRange: 13,
      burstSpeed: 15, autofocusPoints: 759, stabilization: true, viewfinder: "OLED EVF, 2.36M dots",
      videoResolution: "4K @ 60 fps", videoFps: 60, logProfile: true,
      battery: 580, weight: 493, weatherSealed: true, dualCardSlots: false, warranty: 1,
    },
    reviews: [
      r("Ana M.", 5, "2025-08-19", "Shot a wedding on it, no complaints", "Eye AF nailed 95% of frames. Battery lasted the ceremony and reception with one swap.", 88),
      r("Paul D.", 4, "2025-07-25", "Great, wish for two card slots", "For paid work I'd like redundancy. Otherwise a superb all-rounder for the money.", 52),
    ],
  },
  {
    id: "arcline-a1-compact",
    categoryId: "cameras",
    brand: "Arcline",
    name: "Arcline A1 Compact",
    tagline: "Pocketable street camera with film-era dials.",
    description:
      "A 1-inch sensor, a sharp 24–70 mm equivalent lens and physical aperture and shutter dials in a body that fits in a jacket pocket. A joy to shoot, if not a spec-sheet champion.",
    price: 799,
    rating: 4.3,
    reviewCount: 2310,
    image: px(CAMERA.c),
    gallery: [px(CAMERA.c), px(CAMERA.e), px(CAMERA.b)],
    highlights: ["Jacket-pocket size (302 g)", "Physical dials", "Pop-up EVF", "20 fps burst"],
    specs: {
      releaseYear: 2023, sensorType: '1" CMOS', megapixels: 20, isoMax: 12800, dynamicRange: 12,
      burstSpeed: 20, autofocusPoints: 315, stabilization: true, viewfinder: "Pop-up OLED EVF",
      videoResolution: "4K @ 30 fps", videoFps: 30, logProfile: false,
      battery: 260, weight: 302, weatherSealed: false, dualCardSlots: false, warranty: 1,
    },
    reviews: [
      r("Nina S.", 5, "2025-06-28", "The camera I actually carry", "My big mirrorless stays home. This comes everywhere and the dials make shooting fun again.", 157),
      r("Jules F.", 4, "2025-05-16", "Battery is the weak point", "Carry a spare. Image quality for the sensor size is excellent.", 44),
    ],
  },
  {
    id: "vantage-v9",
    categoryId: "cameras",
    brand: "Vantage",
    name: "Vantage V9",
    tagline: "61 MP full-frame resolution for the obsessive.",
    description:
      "A 61 MP full-frame sensor with 15 stops of dynamic range, a 9.44M-dot viewfinder and 8K video. Expensive and deliberate — the landscape and studio photographer's dream.",
    price: 3299,
    rating: 4.9,
    reviewCount: 388,
    image: px(CAMERA.d),
    gallery: [px(CAMERA.d), px(CAMERA.a), px(CAMERA.g)],
    highlights: ["61 MP full-frame", "15 stops dynamic range", "9.44M-dot EVF", "8K video + dual slots"],
    specs: {
      releaseYear: 2025, sensorType: "Full-frame BSI CMOS", megapixels: 61, isoMax: 102400, dynamicRange: 15,
      burstSpeed: 10, autofocusPoints: 693, stabilization: true, viewfinder: "OLED EVF, 9.44M dots",
      videoResolution: "8K @ 24 fps", videoFps: 60, logProfile: true,
      battery: 530, weight: 723, weatherSealed: true, dualCardSlots: true, warranty: 2,
    },
    reviews: [
      r("Mateo G.", 5, "2025-10-28", "Landscapes look like medium format", "Shadow recovery is absurd. I crop 50% and still print large. The EVF is the best I've ever used.", 61),
      r("Freya L.", 5, "2025-09-15", "Worth every penny for studio work", "Tethered shooting is rock solid. 10 fps is enough for my needs; this isn't a sports camera and doesn't pretend to be.", 27),
    ],
  },
  {
    id: "halo-h2-vlog",
    categoryId: "cameras",
    brand: "Halo",
    name: "Halo H2 Vlog",
    tagline: "Flip screen, great mic, zero fuss.",
    description:
      "Designed around talking to the camera: a flip-forward screen, a directional 3-capsule mic, product-showcase autofocus and a log profile for grading. Stills are competent, video is the point.",
    price: 549,
    rating: 4.1,
    reviewCount: 1760,
    badge: "Best Value",
    image: px(CAMERA.e),
    gallery: [px(CAMERA.e), px(CAMERA.c), px(CAMERA.f)],
    highlights: ["Flip-forward screen", "3-capsule directional mic", "Product showcase AF", "Log profile included"],
    specs: {
      releaseYear: 2024, sensorType: '1" CMOS', megapixels: 20, isoMax: 12800, dynamicRange: 11.5,
      burstSpeed: 24, autofocusPoints: 315, stabilization: false, viewfinder: "None (flip LCD)",
      videoResolution: "4K @ 30 fps", videoFps: 30, logProfile: true,
      battery: 260, weight: 294, weatherSealed: false, dualCardSlots: false, warranty: 1,
    },
    reviews: [
      r("Kai B.", 4, "2025-07-12", "Upgraded from my phone — big difference", "Background blur is real, the mic is great outdoors, and the flip screen makes framing easy.", 94),
      r("Rosa C.", 4, "2025-06-06", "No stabilization hurts for walking shots", "Use a gimbal or stand still. For desk videos it's perfect.", 38),
    ],
  },
  {
    id: "orbit-z30",
    categoryId: "cameras",
    brand: "Orbit",
    name: "Orbit Z30",
    tagline: "Entry mirrorless that grows with you.",
    description:
      "A 24 MP APS-C body with a bright EVF, a friendly guided UI and access to a huge lens ecosystem. No stabilization or weather sealing, but a brilliant first serious camera.",
    price: 899,
    rating: 4.4,
    reviewCount: 934,
    badge: "New",
    image: px(CAMERA.f),
    gallery: [px(CAMERA.f), px(CAMERA.b), px(CAMERA.h)],
    highlights: ["24 MP APS-C sensor", "Guided beginner UI", "Huge lens ecosystem", "Lightweight 405 g body"],
    specs: {
      releaseYear: 2025, sensorType: "APS-C CMOS", megapixels: 24, isoMax: 25600, dynamicRange: 12.5,
      burstSpeed: 11, autofocusPoints: 209, stabilization: false, viewfinder: "OLED EVF, 2.36M dots",
      videoResolution: "4K @ 30 fps", videoFps: 30, logProfile: false,
      battery: 400, weight: 405, weatherSealed: false, dualCardSlots: false, warranty: 1,
    },
    reviews: [
      r("Emily W.", 5, "2025-10-02", "My first real camera", "The guided mode taught me aperture and shutter speed in a week. Photos look miles better than my phone.", 110),
      r("Carlos J.", 4, "2025-08-20", "Buy a stabilized lens", "No IBIS means handheld video is shaky with the kit lens. Stills are sharp and colors are lovely.", 33),
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                     */
/* ------------------------------------------------------------------ */
export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const getProduct = (id: string | undefined): Product | undefined => (id ? PRODUCT_MAP[id] : undefined);

export const getProductsByCategory = (categoryId: string): Product[] =>
  PRODUCTS.filter((p) => p.categoryId === categoryId);

/** Simple case-insensitive search across name, brand, tagline and category. */
export function searchProducts(query: string, limit = Infinity): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = PRODUCTS.map((p) => {
    const hay = `${p.brand} ${p.name} ${p.tagline} ${p.categoryId} ${p.highlights.join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (p.name.toLowerCase().includes(t)) score += 3;
      else if (p.brand.toLowerCase().includes(t)) score += 2;
      else if (hay.includes(t)) score += 1;
      else return { p, score: -1 };
    }
    return { p, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);
  return scored.slice(0, limit).map((s) => s.p);
}
