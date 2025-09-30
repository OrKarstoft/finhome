# FinHome

**Home Budget Tool — Built for Real-World Flexibility**

[![Live Demo](https://img.shields.io/badge/demo-finhome.karstoft.pro-blue?logo=next.js)](https://finhome.karstoft.pro)
[![Build & Deploy](https://img.shields.io/badge/build%2Fdeploy-DigitalOcean-blue)](https://digitalocean.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

FinHome is a flexible, privacy-focused tool for home budgeting. Unlike traditional budget apps, FinHome lets you make corrections and adjustments without altering your original budget, so you can see exactly how you’re tracking—whether you’re on track, behind, or ahead.

FinHome runs **100% client-side**:  
Your private financial data never leaves your browser. All data is securely stored in your browser’s local storage. If you want to share your budget, simply generate a Base64 string on the settings page and send it to another device or family member.

- **Live demo:** [finhome.karstoft.pro](https://finhome.karstoft.pro)
- **Self-hosting:** Deploy your own instance with ease (see below).

## Features

- **Correction Mode:** Adjust your budget and instantly see the difference without changing your original plan.
- **Client-Side Privacy:** All data stays with you—no accounts, no cloud sync.
- **Easy Sharing:** Export/import budgets with a shareable Base64 string.
- **Modern UI:** Built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/).
- **Responsive & Accessible:** Works on desktop and mobile.

## Quick Start

### Try Online

Visit [finhome.karstoft.pro](https://finhome.karstoft.pro) for the live version.

### Self-Host

1. **Clone the repository:**
    ```bash
    git clone https://github.com/OrKarstoft/finhome.git
    cd finhome
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run locally:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

4. **Build for production:**
    ```bash
    npm run build
    npm start
    ```

### Deploy

FinHome is production-ready and can be deployed to any platform supporting Node.js/Next.js (e.g., DigitalOcean, Vercel, Netlify).

## Usage

- **Budget Management:**  
  Create your budget, record transactions, and use the corrections feature to track real progress.
- **Sharing:**  
  Go to the settings page, generate a Base64 string, and share with others.

## Security & Privacy

- **No server storage:**  
  All financial data is kept in your browser (local storage).
- **No tracking:**  
  FinHome does not collect analytics or personal info.
- **Open source:**  
  Review the code and host your own instance for full control.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Developed by [OrKarstoft](https://github.com/OrKarstoft)

---

**FinHome is free and open source. If you find it helpful, consider starring the repo!**
