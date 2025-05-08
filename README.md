# Aura

Aura is a unique social media platform where users can share and engage with real-world incidents while building their reputation through an innovative aura points system. The platform encourages meaningful interactions and community engagement through a sophisticated voting mechanism that directly impacts users' aura scores.

## 🌟 About Aura

Aura transforms how we share and respond to everyday incidents by creating a community-driven platform where:

- Users can post about incidents they've witnessed or experienced
- Community members can upvote or downvote posts based on their relevance and impact
- Each user's actions contribute to their "aura points" - a reputation system that reflects their contribution to the community
- The platform promotes transparency and accountability through its voting system
- Users can build their reputation by sharing meaningful content and engaging thoughtfully with others

## 🎯 Key Features

- **Incident Sharing**: Share your experiences and observations with the community
- **Aura Points System**: Build your reputation through meaningful interactions
- **Voting Mechanism**: Upvote or downvote posts to influence users' aura scores
- **Real-time Updates**: See your aura points change as the community engages with your content
- **Community Engagement**: Connect with others who share similar experiences
- **Reputation Building**: Establish your credibility through consistent, quality contributions

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.1
- **Language:** TypeScript
- **UI Components:**
  - Radix UI
  - Tailwind CSS
  - Lucide React Icons
- **State Management:** React Hooks
- **Styling:** Tailwind CSS with PostCSS
- **Animation:** Motion and tw-animate-css

## 📁 Project Structure

```
improved-aura/
├── src/
│   ├── app/           # Next.js app directory (pages and layouts)
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   ├── types/        # TypeScript type definitions
│   └── middleware.ts # Next.js middleware for authentication
├── public/           # Static assets
└── ...config files
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd improved-aura
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add:

   ```
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🔧 Configuration

The project uses several configuration files:

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - Component configuration

## 📝 Features in Detail

### Post Management

- View posts with pagination
- Upvote/downvote functionality
- Optimistic updates for better UX
- Local storage caching for improved performance

### Authentication

- Protected routes using Next.js middleware
- Token-based authentication
- Secure API calls with authorization headers

### UI/UX

- Responsive design for all screen sizes
- Dark/Light theme support
- Smooth animations and transitions
- Accessible components using Radix UI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
