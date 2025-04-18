import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import UploadSection from "@/components/upload-section"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-5xl">
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Deepfake Detector
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload your video and our advanced AI will analyze it to determine if it's real or a deepfake.
          </p>
        </section>

        <Card className="w-full bg-gray-900 border-gray-800 shadow-lg">
          <CardContent className="p-6">
            <UploadSection />
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why Detect Deepfakes?</h2>
          <p className="text-gray-400 mb-6">
            As AI-generated media becomes more sophisticated, the ability to distinguish between real and fake content
            is increasingly important for maintaining trust in digital media.
          </p>
          <Link href="/about" className="inline-flex">
            <Button variant="outline" className="group">
              Learn more about our project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
