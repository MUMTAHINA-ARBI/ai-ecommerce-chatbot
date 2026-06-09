# 🛍️ E-Commerce AI Chatbot Application

Welcome to our AI-powered e-commerce store! This application features an advanced personal shopper chatbot built directly into a Next.js framework, linked natively to a live MongoDB Atlas database.

---

## 📖 How to Use the AI Personal Shopper Chatbot

Our assistant uses an advanced language model directly integrated with our product inventory to help you find items, manage your cart, and complete your purchase entirely through natural conversation.

### 🚀 1. Log In First
Before launching the chatbot, make sure you log in via the **Login Page**. 
* The chatbot relies on your authenticated session context to securely save, view, and modify your personalized shopping cart array inside the database.

### 💬 2. Open the Chat Interface
1. Navigate to the homepage or dashboard.
2. Click the blue **💬 Launch AI Chatbot** button.
3. The interactive panel will slide open, and the assistant will greet you.

### 🛠️ 3. Example Phrases & Commands You Can Try

You don't need to use strict code keywords—just speak to the assistant like a real store employee!

#### 🔍 A. Browsing the Catalog (`browse_products`)
The AI can instantly scan and filter store items by category, keywords, or price limitations.
* *“Show me what running products you have available.”*
* *“Do you have any premium Drop Shoulder T-Shirts?”*
* *“Show me items that cost less than $40.”*

#### 🛒 B. Managing Your Cart (`modify_cart`)
You can add or remove items by specifying the exact product name and your desired size (**S, M, L, XL, XXL**).
* **Add Items:** *“Add the Premium Drop Shoulder Running T-Shirt in size XL to my cart.”*
* **Remove Items:** *“Remove the running t-shirt in size M from my cart.”*
* **Clear Cart:** *“Empty my entire shopping cart.”*

#### 📦 C. Out-of-Stock Handling (Backorders)
If you request a size that is currently missing from our stock catalog matrix, the AI is programmed to recognize it and automatically log an explicit stock request on your behalf instead of crashing!
* *User:* *“Add the Running T-Shirt in size XXL.”*
* *Response:* *“The size XXL is currently out of stock, but I have automatically submitted a backorder stock request on your behalf!”*

#### 📋 D. Reviewing Your Items (`view_cart`)
At any point, you can ask the assistant to read back what you have saved. It will render a live, structural receipt block right inside the chat bubble.
* *“What is currently inside my cart?”*
* *“Show my cart balance.”*

#### 💳 E. Simulating Checkout (`checkout_cart`)
When you are ready to place your order, you can initiate our safe, simulated checkout sequence.
* *“I am ready to buy these items.”*
* *“Proceed to checkout.”*
* *Alternative:* Simply click the green **💳 Complete Checkout** button displayed inside your interactive cart receipt bubble!

---

### 🔄 Dynamic State Synchronization
Keep an eye on the floating shopping cart icon badge (**🛒**) at the bottom right of the input widget:
* As items are successfully committed to your database collection, the green numerical index increments automatically.
* Once your simulated checkout order is completed, the badge counter will **instantly drop back to 0**, indicating that your order has been securely processed and your basket has been cleared!













This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
