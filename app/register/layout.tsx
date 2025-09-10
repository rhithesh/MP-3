import localFont from "next/font/local";
const HFonto = localFont({
    src: "../../fonts/CryptonInk.ttf",
    variable: "--font-crypto",
    display: "swap",
  });



export default function Layout({children}){

    return (
        <>
        <div className={`${HFonto.className}`}>
                    {children}


        </div>

        
        </>
    )
}