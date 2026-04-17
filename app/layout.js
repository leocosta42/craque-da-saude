import './globals.css';
import TopHeader from '../components/Layout/TopHeader';
import BottomNavigation from '../components/Layout/BottomNavigation';
import { ToastProvider } from '../components/Layout/Toast';

export const metadata = {
  title: 'Craque da Saúde ⚽🏆',
  description: 'Seu acompanhamento de saúde campeão!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Craque da Saúde',
  },
};

export const viewport = {
  themeColor: '#2ecc71',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
