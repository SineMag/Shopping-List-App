# Shopping List App - Styling Guide

## Overview
This document outlines the comprehensive styling system implemented across all pages of the Shopping List App.

## Color Palette

### Primary Colors
- **Primary Accent**: `#fdd048` (Yellow/Gold) - Buttons, highlights
- **Purple Gradient**: `#667eea` to `#764ba2` - Landing page, navbar
- **Green Accent**: `#7ea974` - Success states, focus states
- **Background**: `#f5b678` (Base), `#f7f7fb` (Secondary)

### Semantic Colors
- **Text**: `#111827` (Primary), `#6b7280` (Muted)
- **Success**: `#10b981` (Green)
- **Error**: `#ef4444` (Red)
- **Warning**: `#ff7a59` (Orange)
- **Borders**: `#e5e7eb` (Light gray)

## Typography

### Font Family
- **Primary**: Arial, Helvetica, sans-serif
- **Weight**: 400 (normal), 600 (semi-bold), 700 (bold), 800 (extra-bold), 900 (black)

### Font Sizes
- **Headings**: 3.5rem (landing), 2rem (section titles), 1.5rem (cards)
- **Body**: 1rem (base), 0.95rem (inputs), 0.9rem (muted)
- **Buttons**: 1rem (primary), 0.9rem (secondary)

## Page-Specific Styling

### 1. Landing Page (`/`)
**Features:**
- Gradient background (purple)
- Animated floating bubbles
- Hero section with 2-column grid
- Glassmorphism effect on cards
- Responsive: Stacks on mobile

**Key Classes:**
- `.landing` - Main container
- `.landingHero` - Hero section
- `.landingTitle` - Main heading with gradient text
- `.ctaPrimary`, `.ctaSecondary` - Call-to-action buttons
- `.featCard` - Feature cards with backdrop blur

### 2. Login Page (`/login`)
**Features:**
- Centered card layout
- Form validation styling
- Error/success message animations
- Back arrow navigation
- Focus states with green accent

**Key Classes:**
- `.loginPage` - Page container
- `.loginCard` - Form card
- `.loginButton` - Submit button
- `.formGroup` - Form field wrapper
- `.error`, `.successMsg` - Feedback messages

### 3. Registration Page (`/register`)
**Features:**
- Two-column layout (form + image)
- Image hides on mobile
- Multi-field form with validation
- Animated success messages
- Consistent with login styling

**Key Classes:**
- `.registerPage` - Page container
- `.registerCard` - Form card
- `.registrationImage` - Side image
- `.registerButton` - Submit button

### 4. Home Page (`/home`)
**Features:**
- Two-column layout (sidebar + content)
- Green frame with white inner card
- Quick action grid
- Icon cards with hover effects
- Personalized welcome message

**Key Classes:**
- `.homeLayout` - Main layout
- `.homeNavBar` - Left sidebar
- `.homeContent` - Main content area
- `.homeGrid` - Action cards grid
- `.homeCard` - Individual action cards
- `.homeCardIcon` - Gradient icons

### 5. Lists Page (`/lists`)
**Features:**
- Three-column grid layout
- Sidebar with categories/lists
- Main content area with items
- Right sidebar with tips
- Search and sort functionality
- Mobile: Collapsible sidebar

**Key Classes:**
- `.listsLayout` - Grid layout
- `.listsSidebar` - Left sidebar
- `.listsContent` - Main content
- `.listsWidgets` - Right sidebar
- `.searchBox` - Search input
- `.listCard` - List card with hover
- `.categoriesManager` - Category management

### 6. Categories Page (`/categories`)
**Features:**
- Centered content layout
- Card-based design
- Inline editing
- Create/update/delete operations
- Hover effects on buttons

**Key Classes:**
- `.categoriesPage` - Page container
- `.card.padded` - Content cards
- `.btn.primary` - Primary action buttons
- `.link` - Text links

### 7. Profile Page (`/profile`)
**Features:**
- Centered card layout
- Avatar upload with preview
- Form fields for user info
- Password change section
- Save button with loading state

**Key Classes:**
- `.profile-container` - Page container
- `.profile-card` - Main card
- `.profile-avatar` - User avatar
- `.upload-label` - Upload button
- `.primaryBtn` - Save button

### 8. Dashboard Page (`/dashboard`)
**Features:**
- Centered layout
- Quick links to main features
- Card-based navigation
- Simple and clean design

**Key Classes:**
- `.dashboardLayout` - Page container
- `.card.padded` - Content card

### 9. Not Found Page (`/404`)
**Features:**
- Centered error message
- Large 404 heading
- Link back to home
- Minimal design

**Key Classes:**
- `.notFoundPage` - Page container

## Common Components

### Navigation Bar
**Features:**
- Sticky header
- Gradient background
- Responsive navigation links
- Logout button styling

**Key Classes:**
- `.navbar` - Navigation container
- `.brandLogo` - Logo/title
- `.logoutBtn` - Logout button

### Footer
**Features:**
- Centered content
- Copyright and links
- Separator styling

**Key Classes:**
- `.footer` - Footer container
- `.footerLink` - Footer links

### Buttons

#### Primary Button
```css
background: #fdd048
color: #111
border-radius: 12px
box-shadow: 0 6px 16px rgba(0,0,0,0.2)
```
**Hover**: Lift effect + enhanced shadow

#### Secondary Button
```css
background: #f3f4f6
color: #374151
border: 1px solid #e5e7eb
```
**Hover**: Darker background + lift

#### Link Button
```css
background: transparent
color: #2563eb
text-decoration: underline
```

### Form Elements

#### Input Fields
```css
border: 2px solid #e5e7eb
border-radius: 10-12px
padding: 0.7rem 1rem
```
**Focus**: Green border (#7ea974) + box shadow

#### Error State
```css
border-color: #d32f2f
color: #d32f2f
```

#### Success Message
```css
background: #e8f5e9
color: #2e7d32
border: 1px solid #81c784
```
**Animation**: FadeOut class for smooth disappear

### Cards
```css
background: white
border-radius: 14-18px
box-shadow: 0 8px 24px rgba(0,0,0,0.12)
padding: 1rem - 2rem
```
**Hover**: `translateY(-2px)` + enhanced shadow

## Responsive Breakpoints

### Desktop (1200px+)
- Full three-column layout on Lists page
- Large typography
- All features visible

### Laptop (1024px - 1199px)
- Maintained layout structure
- Slightly reduced spacing

### Tablet (768px - 1023px)
- Two-column layouts
- Hidden right sidebar on Lists
- Stacked forms
- Hamburger menu appears

### Mobile (480px - 767px)
- Single column layout
- Collapsible sidebar
- Mobile tabs appear
- Reduced font sizes
- Touch-friendly buttons (min 44px)

### Small Mobile (320px - 479px)
- Further reduced typography
- Increased padding for touch
- Simplified layouts
- Essential features only

## Animations & Transitions

### Hover Effects
- **Buttons**: `transform: translateY(-2px)` + shadow increase
- **Cards**: `transform: translateY(-5px)` + shadow increase
- **Links**: Color change + underline

### Focus States
- Green box-shadow ring: `0 0 0 3px rgba(126, 169, 116, 0.1)`
- Border color change to primary accent

### Loading States
- Fade in/out animations
- Opacity transitions (0.3s ease)

### Page Transitions
- Smooth scrolling
- Element entrance animations

## Best Practices

### Consistency
✅ Use defined color variables
✅ Maintain border-radius consistency (10-18px)
✅ Use standard spacing (0.5rem, 1rem, 1.5rem, 2rem)
✅ Follow hover effect patterns

### Accessibility
✅ Sufficient color contrast (WCAG AA)
✅ Focus indicators on all interactive elements
✅ Touch targets minimum 44px
✅ Keyboard navigation support
✅ ARIA labels where needed

### Performance
✅ CSS transitions instead of JS animations
✅ GPU-accelerated transforms
✅ Minimal repaints/reflows
✅ Optimized selectors

### Mobile-First
✅ Base styles for mobile
✅ Progressive enhancement for larger screens
✅ Touch-friendly interactions
✅ Reduced motion options

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (with webkit prefixes)
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

### Safari Compatibility
Added `-webkit-backdrop-filter` prefix for Safari support on glassmorphism effects.

### IE11
Not supported - uses modern CSS features (Grid, Flexbox, CSS Variables, backdrop-filter).

### Dark Mode
Currently light theme only. Future enhancement opportunity.

## Testing Checklist

- [ ] Test all pages at 320px width
- [ ] Test all pages at 768px width
- [ ] Test all pages at 1200px width
- [ ] Verify hover effects on desktop
- [ ] Verify touch interactions on mobile
- [ ] Test form validation styling
- [ ] Test error/success message animations
- [ ] Verify responsive navigation
- [ ] Test sidebar collapse on mobile
- [ ] Verify color contrast ratios
