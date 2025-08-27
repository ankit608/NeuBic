// app/hompage/page.tsx
import { SparklesCore } from "@/components/ui/sparkles";

export default function Hompage() {
  return (
    <div className="relative h-screen w-full bg-gray-900/95 text-white overflow-hidden">
      {/* Gradient Border Wrapper */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 p-[0px] rounded-xl bg-gradient-to-r from-purple-400 to-gray-600">
        <div className="rounded-xl bg-gray-900/90 px-12 py-8 text-center">
          <h1 className="text-8xl font-medium bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent">
            Code,
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent">
            Collaborate
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent">
            &
          </h1>
          <h1 className="text-8xl font-medium bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent">
            Deploy...
          </h1>
        </div>
      </div>

      {/* Sparkles Background */}
      <SparklesCore
        background="purple"
        particleSize={0}
        maxSize={2}
        particleDensity={30}
      />
    </div>
  );
}
