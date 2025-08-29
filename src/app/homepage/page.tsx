// app/hompage/page.tsx
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function Hompage() {
  return (
    <div>
    <div className="relative h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Gradient Border Wrapper */}
      <div className="absolute top-1/4 flex gap-50">
        <div className="rounded-xl bg-gray-900/10 px-12 py-8 text-center">
          <h1 className="text-8xl font-medium bg-gradient-to-r from-purple-500 to-green-700 bg-clip-text text-transparent">
            Code,
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-purple-500 to-green-700 bg-clip-text text-transparent">
            Collaborate
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-purple-500 to-green-700 bg-clip-text text-transparent">
            &
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-purple-500 to-green-700 bg-clip-text text-transparent">
            Deploy...
          </h1>

          
        </div>
        <GlassCodeBlock></GlassCodeBlock>
      </div>
  
      {/* Sparkles Background */}
      <SparklesCore
        background="purple"
        particleSize={0}
        maxSize={2}
        particleDensity={30}
      />
     
    </div>
    <div className="h-[100vh]"></div>
    </div>

    
  );
}



const GlassCodeBlock = () => {
  return (
    <div className="w-[600px] p-6 rounded-2xl bg-white/5  border border-white/30 shadow-lg">
      <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
        <code>
{`// Example JavaScript code
function hello(name) {
  console.log("Hello, " + name + "!");
}

hello("Ankit");`}
        </code>
      </pre>
    </div>
  );
};





