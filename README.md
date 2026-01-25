# PixelForge AI

A modern, scalable AI image generation application built with React, TypeScript, and Vite. Generate stunning images using Google's Imagen API with AI-powered prompt generation.

## Features

- 🎨 **AI Image Generation**: Create images using Google Imagen 4.0
- 🎲 **Smart Randomizer**: AI-powered prompt generation with category selection
- 📚 **History Gallery**: Browse, filter, and manage your generated images
- 🎭 **Style Modifiers**: 20+ artistic styles, lighting options, and mood settings
- 📦 **Bulk Operations**: Download or delete multiple images at once
- 💾 **Local Storage**: All data stored locally in your browser (IndexedDB)
- 🎯 **TypeScript**: Full type safety throughout the application
- ⚡ **Performance**: Code splitting, lazy loading, and React optimizations
- 🔔 **Status Notifications**: Real-time status updates during generation and randomization
- 🔄 **API Compatibility**: Automatic API version fallback for optimal compatibility
- 📋 **Copy Prompt**: One-click copy of full prompt with modifiers
- ⌨️ **Keyboard Shortcuts**: Power user shortcuts for faster workflow
- 📊 **Image Details**: View full metadata, regenerate, or export as JSON
- ⏱️ **Generation Time**: Track and display how long each image took to generate
- 🔄 **New from This**: Quickly reuse parameters from any previous image

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **IndexedDB** - Local database
- **Google Gemini API** - Text generation
- **Google Imagen API** - Image generation

## Project Structure

```
pixelforge-ai/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable UI components
│   │   ├── generation/  # Image generation UI
│   │   ├── history/     # History gallery components
│   │   ├── layout/      # Layout components
│   │   └── settings/    # Settings modal
│   ├── constants/       # Configuration constants
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and storage services
│   │   ├── api/         # API clients (Gemini, Imagen)
│   │   ├── storage/      # IndexedDB and localStorage
│   │   └── download/     # File download utilities
│   ├── store/           # Zustand state store
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pixelforge-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, API key can be set in UI):
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

```bash
npm run preview
```

Preview the production build locally.

### Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`.

**Manual Deployment:**
1. Build the app: `npm run build`
2. The `dist/` folder contains the production files
3. Deploy the `dist/` folder contents to your hosting service

**GitHub Pages Setup:**
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically build and deploy on each push to `main`
4. Your app will be available at: `https://[username].github.io/PixelForge-AI/`

## Usage

1. **Set API Key**: On first launch, you'll be prompted to enter your Google Gemini API key. This is stored locally in your browser.

2. **Generate Images**:
   - Enter a prompt or use the randomizer to generate one
   - Select style, ratio, lighting, and mood options
   - Click "Generate" to create your image

3. **Manage History**:
   - View all generated images in the sidebar
   - Filter by style or sort by date
   - Select multiple images for bulk download or deletion
   - Click on an image to reload its settings
   - View details (hover over item and click info icon) to see full metadata
   - See generation time for each image

4. **Download Images**:
   - Single: Click the download button on the preview
   - Bulk: Enable selection mode, select images, then download as ZIP

5. **Keyboard Shortcuts**:
   - `Ctrl/Cmd + R` - Randomize prompt
   - `Ctrl/Cmd + G` - Generate image
   - `Ctrl/Cmd + K` - Focus prompt input
   - `Ctrl/Cmd + /` - Show/hide shortcuts help
   - `Esc` - Close modals
   - `Space` - Quick randomize (when prompt is focused)

6. **Quick Actions**:
   - Copy full prompt with modifiers using the copy button next to the prompt label
   - Reuse parameters from any image using "New from This" button
   - View complete image metadata and export as JSON

## Development

### Code Structure

The application follows a clean architecture pattern:

- **Components**: Presentational and container components separated by feature
- **Hooks**: Custom hooks encapsulate business logic
- **Services**: API calls and storage operations isolated in service layer
- **Store**: Global state managed with Zustand
- **Types**: TypeScript interfaces for type safety

### Key Features

- **Type Safety**: Full TypeScript coverage
- **Performance**: React.memo, lazy loading, code splitting
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: Semantic HTML and ARIA labels
- **Responsive**: Mobile-friendly design
- **Shared State Management**: Global processing status for unified notifications
- **API Resilience**: Automatic version fallback (v1beta → v1) for maximum compatibility

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

### API Keys

API keys are stored in browser localStorage. They are never sent to any server except Google's APIs.

### IndexedDB

The application uses IndexedDB to store image history. The database name is `PixelForgeDB` with version 2.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Recent Updates

### v1.1.0 - Phase 1 Quick Wins

- ✅ **Copy Prompt Button**: Copy full prompt with modifiers to clipboard with toast notification
- ✅ **Keyboard Shortcuts**: Complete keyboard shortcut system (Ctrl/Cmd+R for randomize, Ctrl/Cmd+G for generate, Ctrl/Cmd+K to focus prompt, Ctrl/Cmd+/ for help, Space for quick randomize, Esc to close modals)
- ✅ **Image Details Modal**: View complete metadata, copy individual fields, regenerate with same parameters, or export metadata as JSON
- ✅ **Generation Time Display**: Track and display generation time for each image in history
- ✅ **"New from This" Button**: Quickly reuse all parameters from any previous image
- ✅ **Toast Notification System**: Non-intrusive toast notifications for user feedback

### v1.0.0

- ✅ **Unified Notification System**: Processing status notifications now work for both image generation and randomizer operations
- ✅ **Shared State Management**: Moved processing status to global Zustand store for consistent UI updates
- ✅ **API Version Handling**: Improved API client with automatic fallback between v1beta and v1 API versions
- ✅ **Version Display**: App version now shown in header
- ✅ **Custom Animations**: Smooth slide-in animations for status notifications
- ✅ **Error Suppression**: Reduced console noise by suppressing expected API fallback warnings

## Acknowledgments

- Google Gemini API for text generation
- Google Imagen API for image generation
- Lucide React for icons
- Tailwind CSS for styling
