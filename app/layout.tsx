import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Relatórios ENDs | Protótipo',
  description: 'Protótipo de interface para a plataforma de ensaios não destrutivos'
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
