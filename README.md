# Gussr - City Guessing Game

Gussr is an interactive web game where players guess cities based on various clues, images, and fun facts. Built with Next.js, TypeScript, and PostgreSQL, it offers an engaging experience with features like score tracking, social sharing, and city exploration.

## Features

- 🎮 Interactive city guessing gameplay
- 🌍 Rich city information including images, fun facts, and external links
- 📊 Score tracking and high score system
- 🎯 Challenge friends with score targets
- 🎫 Voucher reward system
- 🖼️ Draggable image gallery
- 🔗 Integration with Wikipedia, Airbnb, and activity links

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Docker
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gussr
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

4. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/gussr_db
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing.

## Game Rules

1. You'll be presented with multiple clues about a city
2. Choose from the available options to guess the correct city
3. Earn points for correct guesses
4. Unlock voucher segments by achieving high scores
5. Challenge friends by sharing your score

## Database Configuration

The project uses PostgreSQL with the following default configuration (see compose.yml):
- Port: 5434
- Username: postgres
- Password: postgres
- Database: gussr_db

## Deployment

The project is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

For other platforms, ensure you have:
- Node.js runtime environment
- PostgreSQL database
- Environment variables properly configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- All contributors and users of the game
