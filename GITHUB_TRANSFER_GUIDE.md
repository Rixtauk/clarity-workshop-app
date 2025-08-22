# GitHub Transfer Guide

## Project: The Clarity Workshop Landing Page

This guide will help you transfer this project to GitHub and set up automatic deployments.

## Project Structure

```
├── public/
│   ├── _redirects              # Netlify redirects configuration
│   └── favicon.svg             # Custom favicon
├── src/
│   ├── components/             # React components
│   │   ├── AnimatedStat.tsx    # Animated statistics component
│   │   ├── CheckoutForm.tsx    # Payment form component
│   │   ├── Coach.tsx           # Coach introduction section
│   │   ├── ExitPopup.tsx       # Exit intent popup
│   │   ├── FAQ.tsx             # Frequently asked questions
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Hero.tsx            # Hero section with video
│   │   ├── ImageSlider.tsx     # Interactive image slider
│   │   ├── IntroducingWorkshop.tsx # Workshop introduction
│   │   ├── LogoBanner.tsx      # Scrolling logo banner
│   │   ├── PressFeatures.tsx   # Media coverage section
│   │   ├── Purchase.tsx        # Purchase section
│   │   ├── Reviews.tsx         # Customer reviews
│   │   ├── ScrollingCTA.tsx    # Call-to-action component
│   │   ├── StorySelling.tsx    # Story-driven sales section
│   │   ├── Testimonials.tsx    # Customer testimonials
│   │   ├── UserMenu.tsx        # User account menu
│   │   ├── Workshop.tsx        # Workshop details section
│   │   ├── WorkshopCTA.tsx     # Workshop call-to-action
│   │   ├── WorkshopIntro.tsx   # Workshop introduction section
│   │   └── WorkshopOutcomes.tsx # Workshop benefits section
│   ├── lib/                    # Utility libraries
│   │   ├── stripe.ts           # Stripe integration functions
│   │   ├── supabase.ts         # Supabase client configuration
│   │   └── webhook.ts          # Webhook utilities
│   ├── pages/                  # Page components
│   │   ├── Account.tsx         # User account page
│   │   ├── Checkout.tsx        # Checkout page
│   │   ├── CheckoutSuccess.tsx # Success page (legacy)
│   │   ├── DirectWebhook.tsx   # Webhook testing tool
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Signup page
│   │   ├── Success.tsx         # Purchase success page
│   │   └── WebhookTest.tsx     # Webhook testing page
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind
│   ├── main.tsx                # Application entry point
│   ├── stripe-config.ts        # Stripe product configuration
│   └── vite-env.d.ts          # Vite type definitions
├── supabase/
│   └── functions/              # Supabase Edge Functions
│       ├── direct-webhook/
│       │   └── index.ts        # Direct webhook handler
│       ├── kajabi-webhook/
│       │   └── index.ts        # Kajabi webhook integration
│       ├── stripe-checkout/
│       │   └── index.ts        # Stripe checkout session creation
│       ├── stripe-to-kajabi/
│       │   └── index.ts        # Stripe to Kajabi integration
│       ├── stripe-webhook/
│       │   └── index.ts        # Stripe webhook handler
│       ├── webhook-proxy/
│       │   └── index.ts        # Webhook proxy service
│       └── webhook-test/
│           └── index.ts        # Webhook testing utility
├── .env                        # Environment variables (Supabase)
├── README.md                   # Project documentation
├── eslint.config.js            # ESLint configuration
├── index.html                  # Main HTML file
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # TypeScript app configuration
├── tsconfig.node.json          # TypeScript Node configuration
└── vite.config.ts              # Vite configuration
```

## Technologies Used

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Serverless Functions**: Supabase Edge Functions
- **Deployment**: Netlify
- **Icons**: Lucide React

## Transfer Steps

### 1. Download Project Files

From this WebContainer environment, you'll need to download all the files. The project structure above shows what needs to be transferred.

### 2. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it something like `clarity-workshop-landing`
4. Make it public or private as preferred
5. Don't initialize with README (you already have one)

### 3. Upload Files to GitHub

You can either:
- **Option A**: Use GitHub's web interface to drag and drop files
- **Option B**: Use Git commands locally (if you have Git installed):

```bash
git init
git add .
git commit -m "Initial commit: The Clarity Workshop landing page"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 4. Environment Variables Setup

**CRITICAL**: Your `.env` file contains sensitive information. Do NOT commit it to GitHub.

Instead:
1. Create a `.env.example` file with placeholder values
2. Add `.env` to your `.gitignore` file
3. Set up environment variables in your deployment environment

### 5. Connect GitHub to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub as your Git provider
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add your environment variables in Netlify's dashboard

### 6. Supabase Functions

The Supabase Edge Functions in the `supabase/functions/` directory will need to be deployed separately to your Supabase project. These handle payment processing and webhook integrations.

## Important Notes

- **Environment Variables**: Make sure to set up all environment variables in both GitHub (if using GitHub Actions) and Netlify
- **Supabase Connection**: The project is already connected to Supabase with the credentials in `.env`
- **Stripe Configuration**: Update the price IDs in `src/stripe-config.ts` with your actual Stripe product IDs
- **Security**: Never commit API keys or sensitive data to GitHub

## Files That Should NOT Be Committed

Add these to your `.gitignore`:
```
.env
.env.local
.env.production
node_modules/
dist/
.DS_Store
*.log
```

## Post-Transfer Checklist

- [ ] Repository created and files uploaded
- [ ] Environment variables configured in Netlify
- [ ] Supabase Edge Functions deployed
- [ ] Stripe webhooks configured to point to your Supabase functions
- [ ] Test the entire purchase flow
- [ ] Verify analytics and tracking are working

## Support

If you encounter any issues during the transfer, the key integration points are:
1. Supabase database and authentication
2. Stripe payment processing
3. Webhook integrations for course delivery
4. Netlify deployment configuration

Would you like me to help with any specific part of this process?