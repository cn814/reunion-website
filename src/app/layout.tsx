import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Class of 2006 Reunion",
  description: "Bishop Carroll Class of 2006 Reunion Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
