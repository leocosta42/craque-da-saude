import './globals.css';
import TopHeader from '../components/Layout/TopHeader';
import BottomNavigation from '../components/Layout/BottomNavigation';
import { ToastProvider } from '../components/Layout/Toast';

export const metadata = {
  title: 'Craque da Saúde ⚽🏆',
  description: 'Seu acompanhamento de saúde campeão!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider>
          <main className="app-container">
            <TopHeader />
            <div className="content-area">
              {children}
            </div>
            <BottomNavigation />
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
