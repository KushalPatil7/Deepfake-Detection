import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">About the Project</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            This project is a Deepfake Detection system built using machine learning. It takes an input video and
            detects whether it is manipulated (deepfake) or authentic. The goal is to combat misinformation and raise
            awareness about synthetic media.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Guided by</h3>
            <p className="text-gray-700">Prof. XYZ</p>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-medium mb-2">Team Members</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Kushal Patil</li>
              <li>• Student 2</li>
              <li>• Student 3</li>
              <li>• Student 4</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
