import { Inter, Share } from "next/font/google";
import { Lusitana } from "next/font/google";
import { Poppins } from "next/font/google";
// import { Auromiya } from 'next/font/local'

const lusitana = Lusitana({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

const shareTech = Share({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
  style: "normal",
  fallback: ["sans-serif"],
});

//font poppins
const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

// const auromiya = Auromiya({
//   weight: '400',
//   subsets: ['latin'],
// })

export { inter, lusitana, poppins };
