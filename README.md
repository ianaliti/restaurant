# Resto Digital

Resto Digital it's a simple site for ordering dishes. Customers can select restaurants from the list and then order them. The site support 3 different roles: admin who can manage restaurateurs, restaurateur who can manage his restaurant and plats, and customer who can browse restaurants, add plats to cart and make orders. 

The site use Next.js 16 with App Router for server-side rendering and better SEO. We use Zustand for state management with 6 stores to manage authentication, cart, orders, restaurants, plats and users. For styling we use Tailwind CSS. The site is also a Progressive Web App which means it can be installed on devices and work offline. We also add accessibility features like skip links, ARIA attributes and semantic HTML for better user experience. 

## Project Structure

All pages are placed under `[lang]` folder for internationalization. We separate the routes by role: customer routes in `(customer)` folder, admin routes in `admin` folder, and restaurateur routes in `restaurateur` folder. All stores are in `app/store` folder and components are organized by functionality in `components` folder. We also have API routes for restaurants and plats, but for now they just return mock data.

```
resto-digital/
├── public/              # Static files (Service Worker, offline page)
├── src/
│   ├── __tests__/       # Unit tests
│   ├── app/
│   │   ├── [lang]/      # All routes with language
│   │   │   ├── (customer)/    # Customer pages
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── restaurateur/  # Restaurateur pages
│   │   │   └── login/         # Login and register
│   │   ├── api/         # API routes
│   │   ├── dictionaries/      # Translation files (en.json, fr.json)
│   │   └── store/       # Zustand stores (6 stores)
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities and data functions
│   ├── types/           # TypeScript types
│   └── mock-data/       # Mock data
└── tests/               # E2E tests
```

## Roles

### Admin
Admin can add the restaurateur

### Restaurateur
Restaurateur can access to his account by using email and password which indicate admin, restaurateur can update the essential restaurante info and add the plats. Also he can see the commandes which was made by customers from his restaurant.

### Customer
Customer can chose the plat, add in the cart and after make an order. The command will be save in commandes history page.

If admin or restaurateur redirect to page with plat, whey can add the plat in the cart but only customer can create the order, so user will see the warning message to ask login as customer to procced

User can create a compte and change the name and email in profile. He also can choose the meal from restaurants page. The site also provide a search input.

## Test Accounts

Both: admin and restaurateurs be added for the first connection, please log in using this: 

**Admin:** 
- Email: admin@restodigital.com 
- Password: admin123

**Restaurateur:** 
- Email: restaurateur@restodigital.com
- Password: resto123

## Security

For safety we add Protected Route to not allowed every user get access to admin and restaurateur page.

## International

For dynamic translation user can click at the button to switch between English and French. For this we use Internationalization from Next.js. for this we places all the links folder under [lang] folder to add the sub-path and to dynamically handle different locales in the route. We also create a proxy for redirecting the user based on the locale. We also provide 2 dictionary: English and French.

## Stores

We create a 6 stores by using Zustand. For now we don't have a data base and use the local storage and mock data for a testing purpose. For further updating we also add a API folders with GET functions, now they just return the mock data but after we can actually use it with database.

## TypeScript

For type safety we add the types inside our project, for example for a Dish:

```typescript
export interface Plat {
  id: number;
  name: string;
  price: number;
  image: string;
}
```

To always receive all the necassery information, also we provide others interfaces, generics and utilities types.

## Accessibility

For accessibility we add SkipLink component which allow user to skip to main content using keyboard navigation. We also add ARIA attributes like aria-label, aria-live, role attributes for screen readers. We use semantic HTML elements like nav, main, section for better structure. All interactive elements have focus states for keyboard navigation. We also add proper labels for form inputs and buttons so screen readers can understand the purpose of each element.

## PWA

For Progressive Web App we add manifest.ts file which define the app name, description and display mode. We also create a Service Worker for basic offline functionality. When user is offline, the service worker will show offline page.

## Tests

For testing we create unit tests using Vitest for our stores. We test authStore and cartStore to make sure registration, login, logout and cart operations work correctly. We also create E2E tests using Playwright for the 3 principal user journeys: customer journey for browsing and ordering, admin journey for managing restaurateurs, and restaurateur journey for managing plats and viewing orders.
