import './globals.css';

export const metadata = {
  title: '발로란트 팀 밸런스 시뮬레이터',
  description: '발로란트 팀 밸런스 시뮬레이터',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
