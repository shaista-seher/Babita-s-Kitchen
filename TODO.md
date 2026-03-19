# React Native Mobile App TODO.md

Current Git branch: blackboxai/recent-changes ✅

## Approved Plan Steps

**✅ 0. Plan created & approved by user.**

**✅ Step 1: Create mobile/ directory core files**
- mobile/package.json
- mobile/app.json
- mobile/babel.config.js
- mobile/metro.config.js
- mobile/tsconfig.json

**✅ Step 2: Create basic app structure**
- mobile/index.js
- mobile/App.tsx
- mobile/global.css
- mobile/src/lib/supabaseClient.ts
- mobile/src/types.ts
- mobile/src/context/AuthContext.tsx (placeholder)
- mobile/src/navigation/AppNavigator.tsx (placeholder)
- mobile/src/screens/LoginScreen.tsx (placeholder)

**Next: Step 3 - Install deps and test expo start**
- Run `npm install --legacy-peer-deps` in mobile/
- `npx expo start` 

**Step 4: Complete screens and components**

**Step 2: Port shared logic**
- mobile/src/lib/supabaseClient.ts (RN compatible)
- mobile/src/types.ts (from shared/schema.ts)

**Step 3: Core App structure**
- mobile/src/App.tsx (Navigation + Providers)
- mobile/src/navigation/AppNavigator.tsx

**Step 4: Screens**
- mobile/src/screens/LoginScreen.tsx
- mobile/src/screens/OtpVerifyScreen.tsx
- mobile/src/screens/HomeScreen.tsx
- mobile/src/screens/ProductDetailScreen.tsx
- mobile/src/screens/CartScreen.tsx
- mobile/src/screens/ProfileScreen.tsx

**Step 5: Components & Hooks**
- mobile/src/components/ProductCard.tsx
- mobile/src/hooks/useProducts.ts
- mobile/src/context/AuthContext.tsx
- mobile/src/context/CartContext.tsx

**Step 6: Styling**
- NativeWind setup for Tailwind-like styles
- Custom components (Button, Input)

**Step 7: Test & Deploy**
- npm install (mobile/)
- expo start
- expo publish (OTA)
- EAS Build for stores

**Post-completion:**
- Update root README.md
- Commit/push new branch blackboxai/mobile-app
- Create PR

Next: Step 1 files.

