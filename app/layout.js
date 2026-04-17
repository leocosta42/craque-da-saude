import './globals.css';
import TopHeader from '../components/Layout/TopHeader';
import BottomNavigation from '../components/Layout/BottomNavigation';

export const metadata = {
  title: 'Craque da Saúde ⚽🏆',
  description: 'Seu acompanhamento de saúde campeão!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="app-container">
          <TopHeader />
          <div className="content-area">
            {children}
          </div>
          <BottomNavigation />
        </main>
      </body>
    </html>
  );
}
