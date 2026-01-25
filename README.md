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

4. **Download Images**:
   - Single: Click the download button on the preview
   - Bulk: Enable selection mode, select images, then download as ZIP

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
