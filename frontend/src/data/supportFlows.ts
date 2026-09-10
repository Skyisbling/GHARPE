// ─── Support Flow Types ──────────────────────────────────────────────────────
export type FlowAction =
  | { type: "navigate"; path: string }
  | { type: "flow"; id: string }
  | { type: "mainMenu" }
  | { type: "back" };

export interface FlowOption {
  label: string;
  action: FlowAction;
}

export interface FlowStep {
  message: string;
  options: FlowOption[];
}

export interface Flow {
  id: string;
  steps: FlowStep[];
}

// ─── Service Categories (matches actual website data) ────────────────────────
export const SERVICE_CATEGORIES = [
  { id: "electrician", label: "⚡ Electrician", slug: "electrician" },
  { id: "plumber", label: "🚰 Plumber", slug: "plumber" },
  { id: "carpenter", label: "🪚 Carpenter", slug: "carpenter" },
  { id: "painter", label: "🎨 Painter", slug: "painter" },
  { id: "cleaner", label: "🧹 Cleaner", slug: "cleaner" },
  { id: "gardener", label: "🌳 Gardener", slug: "gardener" },
  { id: "driver", label: "🚗 Driver", slug: "driver" },
  { id: "technician", label: "🔧 Technician", slug: "technician" },
  { id: "caregiver", label: "👶 Caregiver", slug: "caregiver" },
  { id: "domestic-help", label: "🏠 Domestic Help", slug: "domestic-help" },
];

// ─── Main Menu ──────────────────────────────────────────────────────────────
export const MAIN_MENU: FlowOption[] = [
  { label: "🔎 Find a Service", action: { type: "flow", id: "find-service" } },
  { label: "📅 Book a Service", action: { type: "flow", id: "book-service" } },
  { label: "📋 My Bookings", action: { type: "flow", id: "my-bookings" } },
  { label: "👷 Become a Provider", action: { type: "flow", id: "become-provider" } },
  { label: "💰 Pricing & Payments", action: { type: "flow", id: "pricing" } },
  { label: "📍 Location Help", action: { type: "flow", id: "location" } },
  { label: "🔐 Account & Login", action: { type: "flow", id: "account" } },
  { label: "⭐ Reviews & Ratings", action: { type: "flow", id: "reviews" } },
  { label: "🛡️ Safety & Verification", action: { type: "flow", id: "safety" } },
  { label: "❓ FAQs", action: { type: "flow", id: "faq" } },
  { label: "🚨 Report an Issue", action: { type: "flow", id: "report-issue" } },
  { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
];

// ─── Back Button Helper ─────────────────────────────────────────────────────
const BACK: FlowOption = { label: "↩️ Go Back", action: { type: "back" } };
const MAIN_MENU_BTN: FlowOption = { label: "🏠 Main Menu", action: { type: "mainMenu" } };

// ─── All Flows ──────────────────────────────────────────────────────────────
export const SUPPORT_FLOWS: Record<string, Flow> = {
  // ── Find a Service ──
  "find-service": {
    id: "find-service",
    steps: [
      {
        message: "Sure! What type of service are you looking for?",
        options: [
          ...SERVICE_CATEGORIES.map((c) => ({
            label: c.label,
            action: { type: "navigate" as const, path: `/services?category=${c.slug}` },
          })),
          BACK,
        ],
      },
    ],
  },

  // ── Book a Service ──
  "book-service": {
    id: "book-service",
    steps: [
      {
        message:
          "Booking a service is simple:\n\n1️⃣ Choose a service\n2️⃣ Select a verified provider\n3️⃣ Check their profile, rating & availability\n4️⃣ Choose your preferred time\n5️⃣ Confirm your booking\n\nReady to get started?",
        options: [
          { label: "🔎 Find a Service", action: { type: "flow", id: "find-service" } },
          { label: "📋 View My Bookings", action: { type: "flow", id: "my-bookings" } },
          { label: "❓ Booking Help", action: { type: "flow", id: "faq-booking" } },
          BACK,
        ],
      },
    ],
  },

  // ── My Bookings ──
  "my-bookings": {
    id: "my-bookings",
    steps: [
      {
        message: "Here's what you can manage from your bookings:",
        options: [
          { label: "⏰ Schedule Help", action: { type: "flow", id: "reschedule" } },
          { label: "❌ Cancellation Help", action: { type: "flow", id: "cancellation" } },
          { label: "🔄 Rescheduling Help", action: { type: "flow", id: "reschedule" } },
          { label: "💳 Payment Help", action: { type: "flow", id: "pricing" } },
          MAIN_MENU_BTN,
        ],
      },
    ],
  },

  // ── Cancellation ──
  "cancellation": {
    id: "cancellation",
    steps: [
      {
        message:
          "Need to cancel a booking?\n\nOpen your bookings and select the booking you want to manage. If cancellation is available, you'll see the option there.",
        options: [
          { label: "📋 My Bookings", action: { type: "navigate", path: "/help" } },
          { label: "💳 Cancellation & Refund FAQ", action: { type: "flow", id: "faq-payment" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  // ── Rescheduling ──
  "reschedule": {
    id: "reschedule",
    steps: [
      {
        message:
          "Need to change your appointment?\n\nOpen your booking and check whether rescheduling is available for that service.",
        options: [
          { label: "📋 My Bookings", action: { type: "navigate", path: "/help" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  // ── Become a Provider ──
  "become-provider": {
    id: "become-provider",
    steps: [
      {
        message:
          "Want to provide services through GharPe?\n\nYou can register as a service provider and create your professional profile.",
        options: [
          { label: "📝 Register as Worker", action: { type: "navigate", path: "/register?tab=worker" } },
          { label: "📋 Requirements", action: { type: "flow", id: "worker-requirements" } },
          { label: "🛡️ Verification Info", action: { type: "flow", id: "verification" } },
          { label: "💼 How It Works", action: { type: "flow", id: "how-it-works" } },
          BACK,
        ],
      },
    ],
  },

  // ── Worker Requirements ──
  "worker-requirements": {
    id: "worker-requirements",
    steps: [
      {
        message:
          "To register as a service provider, you'll need:\n\n• Full name & phone number\n• Location / service area\n• Profession / service category\n• Years of experience\n• Working availability\n• Profile photo\n• Government ID proof\n\nYour information creates your professional profile on GharPe.",
        options: [
          { label: "📝 Start Registration", action: { type: "navigate", path: "/register?tab=worker" } },
          { label: "🛡️ Verification Help", action: { type: "flow", id: "verification" } },
          BACK,
        ],
      },
    ],
  },

  // ── Verification ──
  "verification": {
    id: "verification",
    steps: [
      {
        message:
          "Verification helps GharPe maintain trustworthy profiles.\n\nYou may be asked to provide:\n\n🪪 Aadhaar Card or other Government ID\n📸 Profile photograph\n📄 Professional certificates (where applicable)\n\nOnly upload documents through the official registration flow.",
        options: [
          { label: "📝 Start Registration", action: { type: "navigate", path: "/register?tab=worker" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  // ── How It Works ──
  "how-it-works": {
    id: "how-it-works",
    steps: [
      {
        message:
          "Here's how GharPe works for service providers:\n\n1️⃣ Register with your details & profession\n2️⃣ Submit verification documents\n3️⃣ Get verified by the cooperative\n4️⃣ Start receiving service requests\n5️⃣ Get paid fairly through the platform\n\nAll workers are covered under cooperative insurance and welfare schemes.",
        options: [
          { label: "📝 Register as Worker", action: { type: "navigate", path: "/register?tab=worker" } },
          { label: "🛡️ Verification Info", action: { type: "flow", id: "verification" } },
          BACK,
        ],
      },
    ],
  },

  // ── Pricing & Payments ──
  "pricing": {
    id: "pricing",
    steps: [
      {
        message: "How can I help with payments?",
        options: [
          { label: "💰 Service Pricing", action: { type: "flow", id: "faq-pricing" } },
          { label: "💳 Payment Methods", action: { type: "flow", id: "payment-methods" } },
          { label: "🧾 Payment Issues", action: { type: "flow", id: "payment-issues" } },
          { label: "💸 Refund Info", action: { type: "flow", id: "faq-payment" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  "payment-methods": {
    id: "payment-methods",
    steps: [
      {
        message:
          "GharPe supports multiple payment methods:\n\n💳 UPI (Google Pay, PhonePe, etc.)\n💳 Debit / Credit Card\n📱 Digital Wallets\n💵 Cash on Service\n\nChoose your preferred method when confirming a booking.",
        options: [
          { label: "💰 Pricing Help", action: { type: "flow", id: "pricing" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  "payment-issues": {
    id: "payment-issues",
    steps: [
      {
        message:
          "If you're facing a payment issue:\n\n1. Check your payment method balance\n2. Verify the transaction in your banking app\n3. Wait a few minutes — some payments take time to process\n4. If the amount was debited but not reflected, contact support",
        options: [
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "🏠 Main Menu", action: { type: "mainMenu" } },
        ],
      },
    ],
  },

  // ── Account & Login ──
  "account": {
    id: "account",
    steps: [
      {
        message: "How can I help with your account?",
        options: [
          { label: "🔑 Login Help", action: { type: "flow", id: "login-help" } },
          { label: "📝 Registration Help", action: { type: "flow", id: "registration-help" } },
          { label: "🔒 Account Access", action: { type: "flow", id: "account-access" } },
          BACK,
        ],
      },
    ],
  },

  "login-help": {
    id: "login-help",
    steps: [
      {
        message:
          "To log in to GharPe:\n\n1. Tap the Login button in the navigation\n2. Enter your email address\n3. Enter your password (min 6 characters)\n4. Tap Sign In\n\nDemo: use any email and a password with 6+ characters.",
        options: [
          { label: "🔐 Login", action: { type: "navigate", path: "/login" } },
          { label: "📝 Register", action: { type: "navigate", path: "/register" } },
          BACK,
        ],
      },
    ],
  },

  "registration-help": {
    id: "registration-help",
    steps: [
      {
        message:
          "You can register as a customer or a service provider.\n\nAlready have an account? Log in instead.",
        options: [
          { label: "📝 Register", action: { type: "navigate", path: "/register" } },
          { label: "🔐 Login", action: { type: "navigate", path: "/login" } },
          BACK,
        ],
      },
    ],
  },

  "account-access": {
    id: "account-access",
    steps: [
      {
        message:
          "Having trouble accessing your account?\n\nTry these steps:\n1. Make sure you're using the correct email\n2. Check your password (min 6 characters)\n3. Clear your browser cache and try again\n\nIf you still can't log in, contact support.",
        options: [
          { label: "🔐 Login", action: { type: "navigate", path: "/login" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  // ── Reviews & Ratings ──
  "reviews": {
    id: "reviews",
    steps: [
      {
        message:
          "Reviews help customers choose reliable service providers.\n\nAfter using a service, you can leave feedback through the available review section on the provider's profile.",
        options: [
          { label: "🔎 Find a Service", action: { type: "flow", id: "find-service" } },
          { label: "❓ Review Help", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  // ── Safety & Verification ──
  "safety": {
    id: "safety",
    steps: [
      {
        message:
          "Your safety matters to GharPe.\n\nBefore booking, review the provider's profile, experience, rating and verification status.",
        options: [
          { label: "👷 Worker Verification", action: { type: "flow", id: "verification" } },
          { label: "⭐ Reviews & Ratings", action: { type: "flow", id: "reviews" } },
          { label: "🚨 Report an Issue", action: { type: "flow", id: "report-issue" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  // ── Location Help ──
  "location": {
    id: "location",
    steps: [
      {
        message:
          "GharPe uses your location to show services available around you.\n\nYou can set your location during registration or use the \"Use my current location\" feature.",
        options: [
          { label: "📍 Use My Location", action: { type: "navigate", path: "/register" } },
          { label: "📝 Update Location", action: { type: "navigate", path: "/register" } },
          { label: "❓ Location FAQ", action: { type: "flow", id: "faq-location" } },
          BACK,
        ],
      },
    ],
  },

  // ── FAQ System ──
  "faq": {
    id: "faq",
    steps: [
      {
        message: "Choose a topic to find answers:",
        options: [
          { label: "👤 Account", action: { type: "flow", id: "faq-account" } },
          { label: "📅 Bookings", action: { type: "flow", id: "faq-booking" } },
          { label: "💳 Payments", action: { type: "flow", id: "faq-payment" } },
          { label: "👷 Service Providers", action: { type: "flow", id: "faq-providers" } },
          { label: "📍 Location", action: { type: "flow", id: "faq-location" } },
          { label: "⭐ Reviews", action: { type: "flow", id: "faq-reviews" } },
          { label: "🛡️ Verification", action: { type: "flow", id: "faq-verification" } },
          { label: "🔒 Privacy & Safety", action: { type: "flow", id: "faq-safety" } },
          BACK,
        ],
      },
    ],
  },

  "faq-account": {
    id: "faq-account",
    steps: [
      {
        message:
          "👤 Account FAQs:\n\nQ: How do I create an account?\nA: Tap Register, choose Customer or Worker, fill in your details and submit.\n\nQ: How do I log in?\nA: Tap Login, enter your email and password.\n\nQ: I forgot my password.\nA: Currently, please contact support to reset your password.",
        options: [
          { label: "📝 Register", action: { type: "navigate", path: "/register" } },
          { label: "🔐 Login", action: { type: "navigate", path: "/login" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-booking": {
    id: "faq-booking",
    steps: [
      {
        message:
          "📅 Booking FAQs:\n\nQ: How do I book a service?\nA: Browse services, select a provider, check their profile & availability, then confirm.\n\nQ: Can I cancel a booking?\nA: Cancellation options depend on the service. Check your booking details.\n\nQ: How do I reschedule?\nA: Open your booking and check if rescheduling is available.",
        options: [
          { label: "📅 Book a Service", action: { type: "flow", id: "book-service" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-payment": {
    id: "faq-payment",
    steps: [
      {
        message:
          "💳 Payment FAQs:\n\nQ: What payment methods are accepted?\nA: UPI, Credit/Debit Card, Digital Wallets, and Cash.\n\nQ: How do refunds work?\nA: Refund policies depend on the service and cancellation timing. Contact support for specific cases.\n\nQ: Was I charged twice?\nA: Contact support with your booking details and we'll investigate.",
        options: [
          { label: "💰 Pricing Help", action: { type: "flow", id: "pricing" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-pricing": {
    id: "faq-pricing",
    steps: [
      {
        message:
          "💰 Service Pricing:\n\nService rates are set by the cooperative and vary by:\n• Service type\n• Provider experience\n• Location\n• Time of day\n\nYou'll see the estimated price before confirming any booking. There are no hidden charges.",
        options: [
          { label: "🔎 Find a Service", action: { type: "flow", id: "find-service" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-providers": {
    id: "faq-providers",
    steps: [
      {
        message:
            "👷 Provider FAQs:\n\nQ: How are providers verified?\nA: Through cooperative federation — ID check, skill assessment, and background verification.\n\nQ: Are providers insured?\nA: Yes, all registered workers are covered under cooperative insurance.\n\nQ: How do I become a provider?\nA: Register through the Worker registration flow.",
          options: [
            { label: "📝 Register as Worker", action: { type: "navigate", path: "/register?tab=worker" } },
            { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
            BACK,
          ],
        },
    ],
  },

  "faq-location": {
    id: "faq-location",
    steps: [
      {
        message:
          "📍 Location FAQs:\n\nQ: How do I set my location?\nA: Use \"Use my current location\" during registration or enter your address manually.\n\nQ: Why can't I find services nearby?\nA: Try expanding your search area or check if services are available in your pincode.",
        options: [
          { label: "📍 Location Help", action: { type: "flow", id: "location" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-reviews": {
    id: "faq-reviews",
    steps: [
      {
        message:
          "⭐ Review FAQs:\n\nQ: How do I leave a review?\nA: After a service is completed, you can rate and review the provider from the booking details.\n\nQ: Can I edit my review?\nA: Please contact support if you need to update your review.",
        options: [
          { label: "⭐ Reviews & Ratings", action: { type: "flow", id: "reviews" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-verification": {
    id: "faq-verification",
    steps: [
      {
        message:
          "🛡️ Verification FAQs:\n\nQ: What documents are needed?\nA: Government ID (Aadhaar, PAN, Voter ID, etc.) and profile photograph.\n\nQ: How long does verification take?\nA: Verification is processed through your cooperative federation. Timing varies.\n\nQ: Is my data safe?\nA: Documents are used only for verification and handled per cooperative privacy policies.",
        options: [
          { label: "🛡️ Verification Info", action: { type: "flow", id: "verification" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  "faq-safety": {
    id: "faq-safety",
    steps: [
      {
        message:
          "🔒 Privacy & Safety FAQs:\n\nQ: Is GharPe safe?\nA: All providers are verified through cooperative federations with multi-level checks.\n\nQ: Is my personal data secure?\nA: GharPe follows cooperative data governance policies. Your data is not shared with third parties.\n\nQ: How do I report a safety concern?\nA: Use the Report an Issue flow or contact support directly.",
        options: [
          { label: "🚨 Report an Issue", action: { type: "flow", id: "report-issue" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "❓ More FAQs", action: { type: "flow", id: "faq" } },
          BACK,
        ],
      },
    ],
  },

  // ── Report an Issue ──
  "report-issue": {
    id: "report-issue",
    steps: [
      {
        message: "What type of issue are you experiencing?",
        options: [
          { label: "❌ Booking Problem", action: { type: "flow", id: "issue-booking" } },
          { label: "💳 Payment Problem", action: { type: "flow", id: "issue-payment" } },
          { label: "👷 Provider Problem", action: { type: "flow", id: "issue-provider" } },
          { label: "🔐 Account Problem", action: { type: "flow", id: "issue-account" } },
          { label: "📱 Website Problem", action: { type: "flow", id: "issue-website" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  "issue-booking": {
    id: "issue-booking",
    steps: [
      {
        message:
          "For booking problems:\n\n1. Check your booking status in your account\n2. Verify the provider's availability\n3. If the provider hasn't arrived, try contacting them\n4. If unresolved, report to support",
        options: [
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "🏠 Main Menu", action: { type: "mainMenu" } },
        ],
      },
    ],
  },

  "issue-payment": {
    id: "issue-payment",
    steps: [
      {
        message:
          "For payment problems:\n\n1. Check your payment method balance\n2. Verify the transaction in your banking app\n3. Wait a few minutes for processing\n4. If debited but not reflected, contact support with transaction details",
        options: [
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "🏠 Main Menu", action: { type: "mainMenu" } },
        ],
      },
    ],
  },

  "issue-provider": {
    id: "issue-provider",
    steps: [
      {
        message:
          "For provider-related issues:\n\n1. Check the provider's profile and reviews\n2. If the service was unsatisfactory, leave a review\n3. For serious concerns, report to support immediately",
        options: [
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "🏠 Main Menu", action: { type: "mainMenu" } },
        ],
      },
    ],
  },

  "issue-account": {
    id: "issue-account",
    steps: [
      {
        message:
          "For account problems:\n\n1. Try logging out and logging back in\n2. Clear your browser cache\n3. Make sure you're using the correct email\n4. If locked out, contact support",
        options: [
          { label: "🔐 Login", action: { type: "navigate", path: "/login" } },
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          BACK,
        ],
      },
    ],
  },

  "issue-website": {
    id: "issue-website",
    steps: [
      {
        message:
          "For website issues:\n\n1. Try refreshing the page\n2. Clear your browser cache\n3. Try a different browser\n4. Check your internet connection\n\nIf the issue persists, report it to support.",
        options: [
          { label: "📞 Contact Support", action: { type: "flow", id: "contact" } },
          { label: "🏠 Main Menu", action: { type: "mainMenu" } },
        ],
      },
    ],
  },

  // ── Contact Support ──
  // ── Contact Support ──
  "contact": {
    id: "contact",
    steps: [
      {
        message: "How can we help you?",
        options: [
          { label: "🚨 Immediate Help", action: { type: "flow", id: "immediate-help" } },
          { label: "📧 Email Support", action: { type: "navigate", path: "mailto:gharpe.help@gmail.com" } },
          BACK,
        ],
      },
    ],
  },

  // ── Immediate Help ──
  "immediate-help": {
    id: "immediate-help",
    steps: [
      {
        message:
        "\u{1F6A8} Need immediate assistance?\n\nYou can contact GharPe Support directly.\n\n\u{1F4DE} 8017273136\n\nOur support team can assist you with your issue.",
        options: [
          { label: "\u{1F4DE} Call 8017273136", action: { type: "navigate", path: "tel:8017273136" } },
          BACK,
        ],
      },
    ],
  },
};
