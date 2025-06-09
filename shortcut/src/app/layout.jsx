export const metadata = {
  title: "Papaya",
  description: "The open-source, local-first personal finance app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
