// ── Service Categories ──
export const serviceCategories = [
  { id: "electrician", label: "Electrician", icon: "Zap", description: "Wiring, repairs, installations, and electrical maintenance" },
  { id: "plumber", label: "Plumber", icon: "Droplets", description: "Pipe repair, installations, leak fixes, and bathroom fittings" },
  { id: "carpenter", label: "Carpenter", icon: "Hammer", description: "Furniture, woodwork, shelving, and custom installations" },
  { id: "painter", label: "Painter", icon: "Paintbrush", description: "Interior/exterior painting, wall treatments, and finishes" },
  { id: "domestic-help", label: "Domestic Help", icon: "Home", description: "Household chores, cooking, laundry, and daily maintenance" },
  { id: "caregiver", label: "Caregiver", icon: "Heart", description: "Elderly care, patient support, and medical assistance" },
  { id: "driver", label: "Driver", icon: "Car", description: "Personal driving, deliveries, and transportation services" },
  { id: "gardener", label: "Gardener", icon: "Leaf", description: "Landscaping, lawn care, pruning, and garden maintenance" },
  { id: "cleaner", label: "Cleaner", icon: "Sparkles", description: "Deep cleaning, regular upkeep, and sanitization services" },
  { id: "technician", label: "Technician", icon: "Wrench", description: "Appliance repair, AC servicing, and general maintenance" },
];

// ── Cooperative Societies ──
export const cooperatives = [
  { id: "lcf-mumbai", name: "Mumbai Labour Cooperative Federation", region: "Mumbai" },
  { id: "lcf-delhi", name: "Delhi Workers Cooperative Society", region: "Delhi" },
  { id: "lcf-bangalore", name: "Bangalore Urban Cooperative Federation", region: "Bangalore" },
  { id: "lcf-pune", name: "Pune Labour Cooperative Society", region: "Pune" },
  { id: "lcf-chennai", name: "Chennai Workers Federation", region: "Chennai" },
  { id: "lcf-hyderabad", name: "Hyderabad Labour Cooperative", region: "Hyderabad" },
];

// ── Worker Types ──
export interface Worker {
  id: string;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  cooperativeId: string;
  location: string;
  startingPrice: number;
  verified: boolean;
  emergencyAvailable: boolean;
  availableDays: string[];
  bio: string;
  certifications: string[];
  avatarInitials: string;
  phone: string;
}

export const workers: Worker[] = [
  {
    id: "w1",
    name: "Rajesh Kumar Singh",
    category: "electrician",
    skills: ["Wiring", "Inverter Setup", "MCB Replacement", "LED Installation"],
    rating: 4.8,
    reviewCount: 142,
    yearsExperience: 12,
    cooperativeId: "lcf-mumbai",
    location: "Andheri West, Mumbai",
    startingPrice: 350,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Licensed electrician with 12 years of experience in residential and commercial wiring. Specialized in modern smart home installations and energy-efficient lighting solutions. Member of the Mumbai Labour Cooperative Federation since 2015.",
    certifications: ["Licensed Electrician - Govt of Maharashtra", "Smart Home Certified", "First Aid Certified"],
    avatarInitials: "RK", phone: "+919876543001",
  },
  {
    id: "w2",
    name: "Sunita Devi Sharma",
    category: "plumber",
    skills: ["Pipe Fitting", "Leak Repair", "Bathroom Renovation", "Water Tank Cleaning"],
    rating: 4.6,
    reviewCount: 98,
    yearsExperience: 8,
    cooperativeId: "lcf-delhi",
    location: "Lajpat Nagar, Delhi",
    startingPrice: 300,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Experienced plumber specializing in residential plumbing solutions. Known for clean, efficient work and transparent pricing. Active member of the Delhi Workers Cooperative Society.",
    certifications: ["Plumbing Trade Certificate", "IPHC Certified"],
    avatarInitials: "SD", phone: "+919876543002",
  },
  {
    id: "w3",
    name: "Arjun Menon",
    category: "carpenter",
    skills: ["Furniture Making", "Kitchen Cabinets", "Door Installation", "Wooden Flooring"],
    rating: 4.9,
    reviewCount: 76,
    yearsExperience: 15,
    cooperativeId: "lcf-bangalore",
    location: "Koramangala, Bangalore",
    startingPrice: 500,
    verified: true,
    emergencyAvailable: false,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Master carpenter with expertise in traditional and modern woodwork. From custom furniture to complete kitchen renovations, delivering quality craftsmanship backed by cooperative standards.",
    certifications: ["Advanced Carpentry - NCVT", "Furniture Design Diploma"],
    avatarInitials: "AM", phone: "+919876543003",
  },
  {
    id: "w4",
    name: "Priya Nair",
    category: "painter",
    skills: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing"],
    rating: 4.7,
    reviewCount: 113,
    yearsExperience: 10,
    cooperativeId: "lcf-pune",
    location: "Kothrud, Pune",
    startingPrice: 280,
    verified: true,
    emergencyAvailable: false,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Professional painter with a keen eye for detail. Specializes in interior design-oriented painting, texture finishes, and weatherproof coatings. Consistent 5-star ratings for punctuality.",
    certifications: ["Painting & Decoration - ITI", "Asian Paints Certified Applicator"],
    avatarInitials: "PN", phone: "+919876543004",
  },
  {
    id: "w5",
    name: "Meena Kumari",
    category: "domestic-help",
    skills: ["Cooking", "Laundry", "House Cleaning", "Child Care"],
    rating: 4.5,
    reviewCount: 201,
    yearsExperience: 6,
    cooperativeId: "lcf-mumbai",
    location: "Bandra East, Mumbai",
    startingPrice: 250,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Reliable and trustworthy domestic help with experience managing households of all sizes. Trained in hygiene protocols and skilled in multi-cuisine cooking. Cooperative verified with full insurance coverage.",
    certifications: ["Domestic Worker Training - Skill India", "Food Safety Certificate"],
    avatarInitials: "MK", phone: "+919876543005",
  },
  {
    id: "w6",
    name: "Anand Rajan",
    category: "caregiver",
    skills: ["Elderly Care", "Patient Handling", "Physiotherapy Support", "Medication Management"],
    rating: 4.9,
    reviewCount: 67,
    yearsExperience: 9,
    cooperativeId: "lcf-chennai",
    location: "T Nagar, Chennai",
    startingPrice: 600,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    bio: "Compassionate caregiver with formal training in elderly and patient care. Previously worked with Apollo Homecare. Now serving through the cooperative model ensuring fair wages and quality care standards.",
    certifications: ["Certified Nursing Assistant", "Geriatric Care Specialist", "CPR & First Aid"],
    avatarInitials: "AR", phone: "+919876543006",
  },
  {
    id: "w7",
    name: "Vikram Patel",
    category: "driver",
    skills: ["Personal Driving", "Long Distance", "Office Commute", "Airport Transfers"],
    rating: 4.4,
    reviewCount: 189,
    yearsExperience: 11,
    cooperativeId: "lcf-hyderabad",
    location: "Banjara Hills, Hyderabad",
    startingPrice: 200,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Professional driver with clean driving record and extensive knowledge of city routes. Available for daily commute, airport transfers, and outstation trips. Vehicle provided on request.",
    certifications: ["Commercial Driving License", "Defensive Driving Certificate"],
    avatarInitials: "VP", phone: "+919876543007",
  },
  {
    id: "w8",
    name: "Lakshmi Iyer",
    category: "gardener",
    skills: ["Lawn Maintenance", "Landscaping", "Plant Care", "Irrigation Systems"],
    rating: 4.7,
    reviewCount: 54,
    yearsExperience: 7,
    cooperativeId: "lcf-bangalore",
    location: "Indiranagar, Bangalore",
    startingPrice: 350,
    verified: true,
    emergencyAvailable: false,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Passionate about creating and maintaining beautiful green spaces. Expert in tropical plants, vertical gardens, and water-efficient landscaping. Let me transform your garden into a green oasis.",
    certifications: ["Horticulture Diploma - Govt of Karnataka", "Organic Farming Certified"],
    avatarInitials: "LI", phone: "+919876543008",
  },
  {
    id: "w9",
    name: "Mohammed Farhan",
    category: "cleaner",
    skills: ["Deep Cleaning", "Carpet Cleaning", "Post-Construction Cleanup", "Sanitization"],
    rating: 4.6,
    reviewCount: 134,
    yearsExperience: 5,
    cooperativeId: "lcf-mumbai",
    location: "Dadar, Mumbai",
    startingPrice: 400,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    bio: "Professional cleaning service with industrial-grade equipment and eco-friendly products. From regular maintenance to post-renovation deep cleans, ensuring spotless results every time.",
    certifications: ["Professional Cleaning Certification", "HACCP Food Safety", "COVID Safety Protocol"],
    avatarInitials: "MF", phone: "+919876543009",
  },
  {
    id: "w10",
    name: "Deepak Verma",
    category: "technician",
    skills: ["AC Repair", "Washing Machine", "Refrigerator", "Geyser Installation"],
    rating: 4.8,
    reviewCount: 167,
    yearsExperience: 13,
    cooperativeId: "lcf-delhi",
    location: "Dwarka, Delhi",
    startingPrice: 350,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Multi-appliance repair specialist with authorized service experience from leading brands. Expert diagnosis, genuine spare parts, and warranty on all repairs. One call fixes all your appliance issues.",
    certifications: ["Electronics Mechanic - NCVT", "Carrier AC Certified", "LG Authorized Service"],
    avatarInitials: "DV", phone: "+919876543010",
  },
  {
    id: "w11",
    name: "Kavitha Ramanujam",
    category: "domestic-help",
    skills: ["Cooking", "Babysitting", "Elderly Companion", "Errands"],
    rating: 4.3,
    reviewCount: 87,
    yearsExperience: 4,
    cooperativeId: "lcf-chennai",
    location: "Adyar, Chennai",
    startingPrice: 220,
    verified: true,
    emergencyAvailable: false,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    bio: "Warm and dependable domestic helper. Excellent cook specializing in South Indian cuisine. Also available for babysitting and elderly companionship. Cooperative member in good standing.",
    certifications: ["Skill India Certified", "First Aid"],
    avatarInitials: "KR", phone: "+919876543011",
  },
  {
    id: "w12",
    name: "Suresh Babu",
    category: "electrician",
    skills: ["Generator Repair", "Industrial Wiring", "Solar Panel Installation", "CCTV Setup"],
    rating: 4.5,
    reviewCount: 91,
    yearsExperience: 18,
    cooperativeId: "lcf-hyderabad",
    location: "Gachibowli, Hyderabad",
    startingPrice: 500,
    verified: true,
    emergencyAvailable: true,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Veteran electrician with industrial and residential expertise. Specialist in solar installations and smart security systems. 18 years of field experience with zero safety incidents.",
    certifications: ["Wireman Grade I - Govt of Telangana", "Solar Installation Certified", "CCTV Installer"],
    avatarInitials: "SB", phone: "+919876543012",
  },
  {
    id: "w13",
    name: "Neha Gupta",
    category: "cleaner",
    skills: ["Office Cleaning", "Window Cleaning", "Sofa & Upholstery", "Kitchen Deep Clean"],
    rating: 4.8,
    reviewCount: 112,
    yearsExperience: 6,
    cooperativeId: "lcf-pune",
    location: "Viman Nagar, Pune",
    startingPrice: 350,
    verified: true,
    emergencyAvailable: false,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    bio: "Detail-oriented cleaning professional specializing in both residential and commercial spaces. Using eco-friendly products and modern techniques for a healthier, sparkling clean environment.",
    certifications: ["Professional Housekeeping - NSDC", "Green Cleaning Certified"],
    avatarInitials: "NG", phone: "+919876543013",
  },
];

// ── Reviews ──
export interface Review {
  id: string;
  workerId: string;
  author: string;
  location: string;
  rating: number;
  text: string;
  date: string;
}

export const reviews: Review[] = [
  { id: "r1", workerId: "w1", author: "Amit Joshi", location: "Mumbai", rating: 5, text: "Rajesh did an excellent job rewiring our entire flat. Very professional, arrived on time, and left the workspace clean. Highly recommended through the cooperative.", date: "2025-12-15" },
  { id: "r2", workerId: "w1", author: "Priya Desai", location: "Mumbai", rating: 5, text: "Quick response for our emergency MCB issue. Fair pricing and clearly explained what went wrong. Will book again.", date: "2025-11-28" },
  { id: "r3", workerId: "w2", author: "Rahul Mehta", location: "Delhi", rating: 4, text: "Good work on bathroom pipe repair. Sunita identified the root cause quickly and fixed it permanently. Pricing was transparent.", date: "2026-01-05" },
  { id: "r4", workerId: "w3", author: "Anjali Sharma", location: "Bangalore", rating: 5, text: "Arjun built us a beautiful custom bookshelf. His craftsmanship is outstanding, and he was very patient with our design iterations.", date: "2025-12-20" },
  { id: "r5", workerId: "w4", author: "Sachin Kulkarni", location: "Pune", rating: 5, text: "Priya transformed our living room with a stunning texture finish. Meticulous work and great color consultation. Worth every rupee.", date: "2026-01-12" },
  { id: "r6", workerId: "w5", author: "Divya Kapoor", location: "Mumbai", rating: 4, text: "Meena has been helping with our household for 3 months now. Very reliable, great cook, and wonderful with our kids.", date: "2026-02-01" },
  { id: "r7", workerId: "w6", author: "Lakshmi Narayan", location: "Chennai", rating: 5, text: "Anand took exceptional care of my mother during her recovery. Professional, patient, and genuinely compassionate. The cooperative verification gave us confidence.", date: "2026-01-20" },
  { id: "r8", workerId: "w8", author: "Deepa Iyer", location: "Bangalore", rating: 5, text: "Lakshmi redesigned our terrace garden beautifully. She knows her plants and created a low-maintenance space that looks amazing year-round.", date: "2025-12-10" },
  { id: "r9", workerId: "w10", author: "Manoj Kumar", location: "Delhi", rating: 5, text: "Deepak repaired our 10-year-old refrigerator and it's working like new. Honest pricing, didn't push unnecessary replacements.", date: "2026-02-05" },
  { id: "r10", workerId: "w9", author: "Fatima Sheikh", location: "Mumbai", rating: 4, text: "Mohammed's team did a deep clean of our entire house before Diwali. Excellent results, very thorough with windows and kitchen.", date: "2026-01-28" },
  { id: "r11", workerId: "w12", author: "Venkat Reddy", location: "Hyderabad", rating: 5, text: "Suresh installed our rooftop solar panels efficiently. Great technical knowledge and helped us understand the setup completely.", date: "2026-02-10" },
  { id: "r13", workerId: "w7", author: "Kavita Menon", location: "Hyderabad", rating: 4, text: "Vikram drives very safely and knows all the routes well. Has been our regular office commute driver for 6 months. Very dependable.", date: "2026-01-15" },
];

// ── Testimonials ──
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: "customer" | "worker";
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Shanti Devi", location: "Delhi", role: "worker", rating: 5, text: "Before joining the cooperative, I was earning irregular wages. Now through GharPe, I get steady bookings, fair pay, and even insurance coverage. This platform has changed my life." },
  { id: "t2", name: "Rajiv Khanna", location: "Mumbai", role: "customer", rating: 5, text: "Unlike random gig apps, every worker here is verified through their cooperative. I trust them in my home. The booking process is smooth and pricing is always upfront." },
  { id: "t3", name: "Anitha Prakash", location: "Bangalore", role: "worker", rating: 4, text: "As a member of the Bangalore Urban Cooperative, I'm proud of the work we do. GharPe gives us dignity and visibility that individual workers rarely get." },
  { id: "t4", name: "Mohsin Ali", location: "Pune", role: "customer", rating: 5, text: "Needed an emergency plumber at 10 PM. Booked through GharPe and the verified worker arrived within 45 minutes. Fair pricing even for emergency service. Excellent platform." },
];

// ── FAQ Data ──
export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  { id: "faq1", category: "Booking", question: "How do I book a service?", answer: "Navigate to the Services page, search or filter by your required service category, select a verified worker, choose your preferred date and time, and confirm the booking. You'll receive a booking confirmation with a unique ID." },
  { id: "faq2", category: "Booking", question: "Can I cancel or reschedule a booking?", answer: "Yes, you can cancel or reschedule up to 4 hours before the scheduled service time without any charge. Cancellations within 4 hours may incur a nominal fee. Rescheduling is always free." },
  { id: "faq3", category: "Booking", question: "What happens if the worker doesn't show up?", answer: "All cooperative workers are accountable to their federation. If a worker fails to show up, we'll immediately assign another verified worker and you'll receive a full refund or credit for the inconvenience." },
  { id: "faq4", category: "Payments", question: "What payment methods are accepted?", answer: "We accept UPI, credit/debit cards, digital wallets, and cash payments. All digital payments are processed securely through our platform." },
  { id: "faq5", category: "Payments", question: "How is pricing determined?", answer: "Pricing is set cooperatively — transparent, fair rates that ensure workers earn a living wage while keeping services affordable. There are no hidden charges. You'll see the estimated cost before confirming your booking." },
  { id: "faq6", category: "Payments", question: "Do workers receive the full payment?", answer: "Workers receive a significantly higher share compared to traditional gig platforms. The cooperative model ensures fair wages with a small platform fee for maintenance and insurance." },
  { id: "faq7", category: "Worker Registration", question: "How do I register as a worker?", answer: "Click 'Register as Worker' on the Register page. You'll need to provide personal details, cooperative affiliation, skill information, and verification documents. Your application goes through a verification process before activation." },
  { id: "faq8", category: "Worker Registration", question: "What verification is required?", answer: "Workers need a valid government ID, cooperative membership proof, and skill-related certifications (where applicable). The cooperative federation also vouches for the worker's character and skill level." },
  { id: "faq9", category: "Worker Registration", question: "Do I need to be part of a cooperative to register?", answer: "Yes, GharPe works exclusively through registered Labour Cooperative Federations and Societies. This ensures accountability, quality, and fair treatment for all workers. If your cooperative isn't yet listed, you can register it through our platform." },
  { id: "faq10", category: "Cooperative Onboarding", question: "How can my cooperative society join GharPe?", answer: "Register your cooperative on the Register page under the 'Cooperative Society' tab. Provide your registration details, regional information, and member count. Our team will verify and onboard your cooperative." },
  { id: "faq11", category: "Safety & Verification", question: "How are workers verified?", answer: "Every worker undergoes multi-level verification: government ID check, cooperative membership validation, skill assessment, background verification through the federation, and insurance enrollment. Only verified workers appear on the platform." },
  { id: "faq12", category: "Safety & Verification", question: "Is there insurance coverage?", answer: "Yes, every registered worker is covered under the cooperative's insurance and welfare scheme. This includes accident insurance, health coverage, and workmen's compensation — at no extra cost to the customer." },
  { id: "faq13", category: "Cancellations & Refunds", question: "What is the refund policy?", answer: "Full refund for cancellations made 4+ hours before service. 75% refund for cancellations within 2-4 hours. No refund for no-shows by the customer, but full refund if the worker fails to arrive." },
  { id: "faq14", category: "Cancellations & Refunds", question: "What if I'm not satisfied with the service?", answer: "Raise a complaint through the Help & Support page. Our cooperative mediation team will review your case, and appropriate resolution including partial/full refund, re-service, or worker reassignment will be provided." },
];
