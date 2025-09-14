import localFont from "next/font/local";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Load the custom font
const dangerFont = localFont({
  src: "../../fonts/Danger.ttf",
  display: "swap", // ensures text is visible while font loads
});

interface ElectionCardProps {
  title: string;
  description: string;
  result: Record<string, number>;
  handleVoteClick: (party: { name: string }) => void;
}

export default function ElectionCard({
  title,
  description,
  result,
  handleVoteClick
}: ElectionCardProps) {
  const totalVotes = Object.values(result).reduce((sum, count) => sum + count, 0);
  const getVotePercentage = (count: number) => totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0';

  const candidateColors = [
    "from-purple-500 via-pink-500 to-red-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-green-500 via-emerald-500 to-cyan-500",
    "from-orange-500 via-yellow-500 to-amber-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-teal-500 via-cyan-500 to-blue-500"
  ];

  const glowColors = [
    "hover:shadow-pink-500/50",
    "hover:shadow-cyan-500/50", 
    "hover:shadow-emerald-500/50",
    "hover:shadow-amber-500/50",
    "hover:shadow-purple-500/50",
    "hover:shadow-blue-500/50"
  ];

  return (
    <Card className="my-6 cursor-pointer rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Header Section */}
      <CardHeader className={`text-center relative z-10 pb-2 ${dangerFont.className}`}>
        <CardTitle className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-cyan-200 drop-shadow-2xl tracking-tight leading-tight mb-2">
          {title}
        </CardTitle>
        
        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full opacity-80"></div>
        
        {/* Description */}
        {description && (
          <p className="text-slate-300 text-lg font-medium mt-4 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="relative z-10 px-8 pb-8">
        {/* Total votes display */}
        {totalVotes > 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <span className="text-slate-400 font-medium">Total Votes:</span>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {totalVotes.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.keys(result).map((candidateName, index) => {
            const voteCount = result[candidateName];
            const percentage = getVotePercentage(voteCount);
            const colorIndex = index % candidateColors.length;
            
            return (
              <div
                key={index}
                className={`
                  relative group/candidate cursor-pointer
                  flex flex-col items-center p-6 
                  bg-white/15 rounded-2xl backdrop-blur-md 
                  border border-white/30 shadow-xl
                  ${glowColors[colorIndex]}
                  transition-all duration-500 ease-out
                  transform hover:scale-110 hover:z-20
                  before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-br ${candidateColors[colorIndex]}
                  before:opacity-0 before:transition-opacity before:duration-500
                  hover:before:opacity-10
                `}
                onClick={() => handleVoteClick({ name: candidateName })}
              >
                {/* Candidate Avatar */}
                <div className={`
                  relative w-20 h-20 rounded-full mb-4
                  bg-gradient-to-br ${candidateColors[colorIndex]}
                  shadow-2xl ${glowColors[colorIndex]}
                  flex items-center justify-center
                  transition-all duration-500
                  group-hover/candidate:scale-110
                `}>
                  <span className="text-2xl font-black text-white">
                    {candidateName.split(' ').map(n => n[0]).join('')}
                  </span>
                  
                  {/* Pulse effect on hover */}
                  <div className={`
                    absolute inset-0 rounded-full
                    bg-gradient-to-br ${candidateColors[colorIndex]}
                    animate-ping opacity-0 group-hover/candidate:opacity-20
                    transition-opacity duration-300
                  `}></div>
                </div>

                {/* Candidate Name */}
                <h3 className="text-xl font-bold text-white text-center mb-3 leading-tight">
                  {candidateName}
                </h3>

                {/* Vote Count */}
                <div className="text-center space-y-2">
                  <p className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    {voteCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Votes ({percentage}%)
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${candidateColors[colorIndex]} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Click indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/60 font-medium opacity-0 group-hover/candidate:opacity-100 transition-opacity duration-300">
                  ✨ Click to Vote
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Vote Button */}
        <div className="flex justify-center">
          <div className="relative group/vote cursor-pointer">
            {/* <div className="w-28 h-28 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl hover:shadow-fuchsia-500/50 transition-all duration-500 transform group-hover/vote:scale-110 group-hover/vote:rotate-3">
              <span className="text-white text-xl font-black tracking-wide">
                VOTE
              </span>
            </div> */}
            
            {/* Rotating border animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover/vote:opacity-30 group-hover/vote:animate-spin transition-opacity duration-500 blur-sm"></div>
            
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover/vote:opacity-20 group-hover/vote:animate-ping transition-opacity duration-500"></div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-50"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </CardContent>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Card>
  );
}