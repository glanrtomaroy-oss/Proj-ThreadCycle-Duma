# ThreadCycle Duma Setup Guide

## Project Structure

This React application has been refactored with the following improvements:

### ✅ Completed Features

1. **React Router Setup**: All pages use React Router for navigation
2. **Component Architecture**: Header and Footer extracted to `src/components/`
3. **Responsive Design**: Optimized for desktop, tablet, and mobile
4. **Supabase Integration**: Ready for database connectivity
5. **Dependencies Optimization**: Enhanced with react-query, zod, react-hook-form

### 📁 File Structure

```
src/
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── OptimizedLoginPage.jsx (with React Hook Form + Zod)
│   └── ... other pages
├── hooks/
│   ├── useAuth.js
│   ├── useScrapEstimations.js
│   ├── useTutorials.js
│   └── useThriftShops.js
├── utils/
│   └── validation.js
├── contexts/
│   └── QueryProvider.jsx
├── util/
│   └── supabase.js
└── App.jsx (with routing)
```

### 🔌 Supabase Setup Instructions

1. **Create a Supabase project**: Go to [supabase.com](https://supabase.com)

2. **Add environment variables** (create `.env` file):
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **Database Tables** (create in Supabase SQL Editor):
```sql
-- Users/auth handled by Supabase Auth
CREATE TABLE tutorial_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  description TEXT,
  video_url TEXT,
  estimated_time INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE thrift_shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  category TEXT,
  price_range TEXT,
  description TEXT,
  phone TEXT,
  opening_hours JSON,
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scrap_estimations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  fabric_type TEXT NOT NULL,
  original_length DECIMAL(8,2) NOT NULL,
  used_length DECIMAL(8,2) NOT NULL,
  saved_amount DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🎨 Responsive Features

- **Desktop**: Full navigation, large hero sections
- **Tablet**: Adaptive grids and reduced padding
- **Mobile**: Collapsible navigation menu, touch-friendly buttons

### 🚀 Key Optimizations

- **React Query**: Data fetching with caching and optimistic updates
- **Zod Validation**: Schema-based form validation
- **React Hook Form**: Optimized form handling
- **Toast Notifications**: User feedback with react-toastify
- **Framer Motion**: Available for animations (already installed)

### 📱 Mobile-First Responsive Design

All pages are now fully responsive with:
- Touch-friendly navigation
- Optimized font sizes
- Responsive grid layouts
- Mobile menu with hamburger navigation
- Stack layout for smaller screens

### 🔧 Development

```bash
npm install
npm run dev
```

The application is now well-structured for integration with Supabase and ready for production deployment.
