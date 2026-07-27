# Yost — Local YouTube Posts Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Puppeteer-404E49?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License" />
</p>

No videos. No algorithm. Just posts. Yost pulls community posts from your favorite YouTube channels into one clean, unified feed — so you never miss what your favorite creators are saying.

## Features

- Scrape YouTube community posts from multiple channels
- Clean, unified feed of all posts
- No video content — posts only
- Local-first design, runs on your machine
- Search and filter posts

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Scraping | Puppeteer with Stealth plugin |

## Getting Started

### Prerequisites

- Node.js v18+
- Chromium or Google Chrome

### Installation

```bash
git clone https://github.com/nagdista-dev/yost.git
cd yost
npm run install:all
```

### Run

```bash
npm run dev
```

This starts both the frontend (port 5173) and backend concurrently.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
