import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skipper UI Component Registry",
  description: "Reconstructed Skipper UI components registry created by Sandeep",
  authors: [{ name: "Sandeep" }],
  creator: "Sandeep",
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
