import localFont from "next/font/local";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Load the font
const myFont = localFont({ 
  src: "../../fonts/Danger.ttf", 
  display: "swap" // ensures text is visible while font loads
});

export default function ElectionCard({ title }: { title: string }) {
  return (
    <Card className="my-3 cursor-pointer rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-pink-500/30 transition">
      <CardHeader className={`text-center ${myFont.className}`}>
        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-black drop-shadow-md">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">Vote</span>
        </div>
      </CardContent>
    </Card>
  );
}
