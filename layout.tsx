import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JuegosGratis.site | Juegos gratis online",
  description:
    "Juega videojuegos gratis directamente desde tu navegador en JuegosGratis.site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}