
import Script from "next/script";
import "./globals.css";
export const metadata = {
  title: "MITS PRINT ",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-fit min-h-screen">
         <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      {children}
      </body>
    </html>
  );
}
