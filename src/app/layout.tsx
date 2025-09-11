import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import MuiProviders from "@/providers/muiProvider";
import ReduxProvider from "@/providers/reduxProvider";
import Layout from "@/components/layout/layout";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import IntervalTokenChecker from "@/components/shared/intervalTokenChecker";


const iranSanse = localFont({
  src: [
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Regular.woff2",
      weight: "normal",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Bold.woff2",
      weight: "bold",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Heavy.woff2",
      weight: "1000",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "rasmas",
  description: "فروشگاه rasmas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranSanse.className}`}>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <MuiProviders>
              <ToastContainer />
              <IntervalTokenChecker />
              {children}
            </MuiProviders>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
