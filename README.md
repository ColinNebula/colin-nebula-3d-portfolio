# Colin Nebula 3D Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2.0-purple.svg)](https://getbootstrap.com/)

> A modern, interactive 3D portfolio showcasing digital art, animations, and creative projects built with React.js

## 🎨 Live Demo

**[View Portfolio →](https://colinnebula.github.io/colin-nebula-3d-portfolio/)**

## 📖 Description

Welcome to my 3D portfolio - a dynamic showcase of my continued evolution as a digital artist and 3D creator. This interactive website features my latest works in 3D modeling, animation, and digital art, demonstrating proficiency across multiple creative disciplines.

### 🛠️ Creative Tools & Software
- **3D Modeling**: Blender, ZBrush
- **Digital Art**: Photoshop, After Effects
- **Animation**: Blender Animation Suite
- **Texturing**: Substance Painter, Photoshop

## ✨ Features

- 🎯 **Interactive Portfolio Gallery** - Browse featured projects with smooth animations
- 🌓 **Dark/Light Theme Toggle** - Customizable viewing experience
- 📱 **Responsive Design** - Optimized for all devices and screen sizes
- 🎬 **Video Integration** - Embedded animations and project demos
- 📧 **Contact System** - EmailJS integration for direct communication
- 🔍 **Project Filtering** - Search and filter projects by category
- 🎨 **3D Model Showcases** - Interactive displays of 3D artwork
- 🚀 **Smooth Animations** - CSS3 and React transitions throughout

## 🏗️ Technical Stack

### Frontend
- **React.js** (18.2.0) - Component-based UI framework
- **React Router** - Client-side routing and navigation
- **React Bootstrap** (5.2.0) - Responsive UI components
- **CSS3** - Custom animations and glassmorphism effects

### Backend Services
- **EmailJS** (4.4.1) - Contact form email handling
- **Environment Variables** - Secure credential management

### Build & Deployment
- **Create React App** - Development and build tooling
- **GitHub Pages** - Static site hosting
- **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites
- Node.js (14.0.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ColinNebula/colin-nebula-3d-portfolio.git
   cd colin-nebula-3d-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local with your credentials
   # Add your EmailJS configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000/colin-nebula-3d-portfolio
   ```

## 📁 Project Structure

```
colin-nebula-3d-portfolio/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── About/         # About section
│   │   ├── Animation/     # Animation showcase
│   │   ├── Contact/       # Contact form
│   │   ├── Footer/        # Site footer
│   │   ├── Home/          # Landing page
│   │   ├── Nav/           # Navigation bar
│   │   ├── Portfolio/     # Project gallery
│   │   └── VideoEditing/  # Video portfolio
│   ├── assets/            # Images, videos, documents
│   │   ├── images/        # Portfolio images
│   │   ├── videos/        # Demo videos
│   │   └── documents/     # Downloadable files
│   ├── utils/             # Utility functions
│   └── App.js             # Main application
├── docs/                  # Documentation
└── build/                 # Production build
```

## 🎯 Available Scripts

- **`npm start`** - Start development server
- **`npm run build`** - Create production build
- **`npm test`** - Run test suite
- **`npm run eject`** - Eject from Create React App

## 🌟 Portfolio Highlights

### 🎨 3D Modeling & Animation
- Character design and rigging
- Environmental assets and landscapes
- Product visualization and rendering
- Animation sequences and motion graphics

### 🎬 Video Production
- Motion graphics and visual effects
- Video editing and post-production
- 3D animation integration
- Creative storytelling

### 💻 Web Development
- Interactive React applications
- Responsive design implementation
- Modern CSS techniques
- Performance optimization

## 📧 Contact & Collaboration

I'm always interested in discussing new projects, creative collaborations, or opportunities in 3D art and digital media.

- **Portfolio**: [colinnebula.github.io/colin-nebula-3d-portfolio](https://colinnebula.github.io/colin-nebula-3d-portfolio/)
- **GitHub**: [@ColinNebula](https://github.com/ColinNebula)
- **Contact Form**: Available on the portfolio website

## 🔧 Environment Setup

### Required Environment Variables
```env
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_USER_ID=your_user_id

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CONTACT_FORM=true

# Theme Configuration
REACT_APP_DEFAULT_THEME=dark
REACT_APP_ENABLE_THEME_TOGGLE=true
```

See `.env.local.example` for a complete configuration template.

## 🚀 Deployment

### GitHub Pages Deployment
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Manual Deployment
1. Run `npm run build`
2. Upload the `build/` folder contents to your hosting provider
3. Configure your server to serve `index.html` for all routes

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ColinNebula/colin-nebula-3d-portfolio/issues).

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js community for excellent documentation and tools
- Bootstrap team for responsive design components
- EmailJS for seamless email integration
- GitHub Pages for reliable hosting

---

**Built with ❤️ by Colin Nebula**

*Showcasing the intersection of technology and creativity through 3D art and interactive design.*
