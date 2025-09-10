"use client";
import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { appRoutes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function NavLink() {
  const matches = useMediaQuery("(min-width:900px)");

  return matches ? <Desktop /> : <Mobile />;
}

function Desktop() {
  const pathName = usePathname();
  const theme = useTheme();
  return (
    <Box display={"flex"} gap={3} px={1}>
      {appRoutes.map((item, index) => {
        return (
          <Box
            key={index}
            sx={{
              color:
                pathName === item.path ? `${theme.palette.primary.main}` : "",
            }}
          >
            <Link href={item.path}>{item.title}</Link>
          </Box>
        );
      })}
    </Box>
  );
}

function Mobile() {
  const [open, setOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          //   color: "secondary.main",
          "&:hover": {
            color: "primary.main",
          },
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Menu cursor={"pointer"} />
      </Box>
      <Drawer
        anchor={"left"}
        open={open}
        onClose={(e) => {
          setOpen(false);
        }}
      >
        <Box width={"300px"} display={"flex"} flexDirection={"column"}>
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            py={1}
            px={2}
          >
            <Box>
              <Image
                src={"/images/logo2.png"}
                alt="logo"
                width={50}
                height={50}
                className="rounded-[100%] bg-white"
              />
            </Box>
            <Box
            color={"error.main"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              <X />
            </Box>
          </Box>
          <Box
            width={"100%"}
            sx={(theme) => ({
              borderBottom: `2px solid ${theme.palette.divider}`,
            })}
            mb={3}
          />
          <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            px={2}
          >
            {appRoutes.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    color:
                      pathName === item.path
                        ? `${theme.palette.primary.main}`
                        : "",
                  }}
                >
                  <Link
                    href={item.path}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {item.title}
                  </Link>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
