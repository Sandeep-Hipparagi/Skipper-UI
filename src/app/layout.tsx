import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://skipper-ui.vercel.app"),
  title: "Skipper UI for Free — Interactive Component Registry",
  description: "Explore 106 reconstructed Skipper UI components and an original interactive primitive, built for React and Next.js.",
  authors: [{ name: "Sandeep Hipparagi" }],
  creator: "Sandeep Hipparagi",
  icons: { icon: "/dot-logo.svg", apple: "/dot-logo.svg" },
  openGraph: {
    title: "Skipper UI for Free",
    description: "A portable catalog of interactive React components.",
    images: [{ url: "/dot-logo.svg", alt: "Skipper UI for Free" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('skipper_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
