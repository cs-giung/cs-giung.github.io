# CV Website

> [!NOTE]
> This project is forked from [yuneg11/yuneg11.github.io](https://github.com/yuneg11/yuneg11.github.io) under MIT License.

A modern, responsive CV website built with **Next.js**, **TypeScript**, and **shadcn/ui**. The content is data-driven and uses static site generation for GitHub Pages deployment.

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

### Building for Production

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `out/` directory. The site automatically deploys to GitHub Pages when you push to the main branch. Make sure to:

   1. Enable GitHub Pages in repository settings
   2. Set the source to "GitHub Actions"
   3. The deploy workflow will handle the rest
