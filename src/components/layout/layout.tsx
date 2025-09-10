import { Box } from "@mui/material";
import Header from "./header";
import Main from "./main";
import Footer from "./footer";
import { ToastContainer } from "react-toastify";
import IntervalTokenChecker from "../shared/intervalTokenChecker";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      <IntervalTokenChecker />
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        minHeight={"100vh"}
      >
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Box>
    </>
  );
}
