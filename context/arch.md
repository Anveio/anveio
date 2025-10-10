# B2B SaaS application (named Anveio) with Convex, Next.js, Clerk, and Stripe

This is a full-stack, serverless web application built on the Vercel stack (Next.js) with a Convex backend. It's designed for rapid development and scalability, leveraging best-in-class managed services for core functionalities like database, authentication, and payments. Anveio is the B2B platform.

## Core Technologies

*   **Frontend:** [Next.js](https://nextjs.org/) (React)
*   **UI Components:** None, just semantic HTML!
*   **Backend:** [Convex](https://www.convex.dev/)

## Getting Started

### Prerequisites

*   Bun
*   Convex account
*   Vercel Account

## Architectural Overview

This application is a modern, full-stack, serverless web application built on the Vercel stack (Next.js) with a Convex backend. It's designed for rapid development and scalability, leveraging best-in-class managed services for core functionalities like database, authentication, and payments. The architecture is well-suited for a B2B platform like Anveio that requires a robust, secure, and scalable foundation.

### Core Technologies & Architectural Decisions

1.  **Frontend: Next.js (React)**
    *   **Framework:** The application uses Next.js, a popular React framework that provides a great developer experience with features like server-side rendering (SSR), static site generation (SSG), and a powerful routing system.
    *   **Language:** The frontend is written in TypeScript, which provides static typing for better code quality and maintainability.
    *   **Styling:** Tailwind CSS is used for styling, which allows for rapid UI development with a utility-first approach.
    *   **Component Library:** [shadcn/ui](https://ui.shadcn.com/) is used for building the user interface. It provides a set of beautifully designed, accessible, and customizable components built on top of Radix UI and Tailwind CSS.
    *   **Component-Based Architecture:** The frontend is built with a component-based architecture, which promotes reusability and maintainability.

2.  **Backend: Convex**
    *   **Serverless Backend:** The application uses Convex as its serverless backend. This means that you don't have to manage servers, and the backend automatically scales with your application's usage.
    *   **Real-time Database:** Convex provides a real-time database, which means that changes to the data are automatically pushed to the client without the need for polling. This is ideal for building collaborative Saaand interactive applications.
    *   **Transactional Guarantees:** Convex provides ACID transactions, which ensures that your data is always consistent.
    *   **Serverless Functions:** You can write serverless functions in TypeScript that run on the Convex backend. These functions can be used to implement your application's business logic.

### Architectural Patterns & Best Practices

*   **Separation of Concerns:** The application follows a clear separation of concerns between the frontend and the backend. The frontend is responsible for the UI and user interaction, while the backend is responsible for the business logic and data storage.
*   **Infrastructure as Code:** The Convex schema and functions are defined in code, which allows you to version control your backend infrastructure and easily reproduce it in different environments.
*   **Idempotency:** E.g. payment fulfillment logic should be idempotent, which means that it can be safely retried without causing duplicate transactions. This is a critical best practice for building reliable payment systems.
*   **Security:** Protect against SQL injection, ensure we don't store plaintext passwords, and so on. Best practices.
