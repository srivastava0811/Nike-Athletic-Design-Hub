# Nike Athlete Design Hub
> *"Not just made for athletes. Made with them."*

An interactive digital experience conceptualizing Nike's proposed **Athlete Design Hub** — a collaborative platform where athletes directly shape product innovation from friction to footwear. Built for a live demonstration and rapid prototyping hackathon.

---

## ⚡ Core Concept: Listen → Create → Evolve

Nike's design philosophy thrives when athletes are active collaborators rather than passive consumers:
- **LISTEN:** Understand real athlete experiences, pain points, and friction encountered on tracks, courts, and pitches.
- **CREATE:** Transform raw athletic challenges into concrete product innovations across footwear, apparel, and equipment.
- **EVOLVE:** Leverage community validation, support, and discussion to guide future prototype evolution.

---

## 🚀 Key Interactive Features

1. **Athlete Identity & Personalization ("What's Your Game?")**
   - Dynamic sport selector (*Running, Basketball, Football, Training, Other*).
   - Instant visual composition swaps with tailored kickers, stats, and real-world friction starters.
   - Automatically carries selected sport into the Innovation Studio and persists to `localStorage`.

2. **Athlete Innovation Studio**
   - 4-step interactive submission pipeline:
     - **Step 1:** Select category (*Footwear, Apparel, Equipment*) and problem focus (*Comfort, Performance, Durability, Accessibility, Sustainability, Other*).
     - **Step 2:** Articulate personal athletic experience with live validation and character limits.
     - **Step 3:** Propose a tangible innovation and name the concept.
     - **Step 4:** Review and inline-edit before submission.
   - Generates unique ID (`ADH-XXXX`), celebratory status animation, and posts directly to the Community Board.

3. **Community Innovation Board**
   - Filter by sport, product type, and problem category.
   - Sort by *Most Supported* or *Most Recent*.
   - Duplicate-preventing support counter per browser.
   - Detailed slide-over modal dialog with full athletic challenge, proposed fix, and persistent discussion threads.
   - Pre-loaded with clearly labeled fictional demo scenarios.

4. **Design Evolution Journey**
   - Interactive 5-stage product development lifecycle (*Idea Submitted → Community Feedback → Design Exploration → Prototype Concept → Athlete Testing*).
   - Dynamic stage tracer allowing visitors to select any community idea (including their own) to simulate its hypothetical development journey.

5. **Cinematic Brand Marketing**
   - Scroll-driven narrative storytelling (*"They Play. They Push. They Know. So why shouldn't they design?"*).
   - High-contrast sports editorial visual system with Anton & Inter typography.
   - Full reduced-motion and keyboard accessibility compliance.

---

## 🛠️ Tech Stack

- **Framework:** React 18.3 + TypeScript 5.6
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation:** Motion for React (`motion` v11)
- **Icons:** Lucide React
- **Persistence:** Safe browser `localStorage` layer (no backend, database, or external APIs required)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` (or the port specified in terminal) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## ⚠️ Disclaimer
*This project is a conceptual prototype developed for a hackathon. It is not an official Nike product or service, nor is it affiliated with or endorsed by Nike, Inc. All sample ideas and athlete profiles are fictional.*

