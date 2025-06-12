import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TeamMember {
  name: string
  role: string
  avatar: string
}

const teamMembers: TeamMember[] = [
  { name: "Kushal Patil", role: "Lead Developer", avatar: "KP" },
  { name: "Aditya Bhosale", role: "Data Scientist", avatar: "AB" },
  { name: "Pritam Fulari", role: "Full Stack Developer", avatar: "PF" },
  { name: "Atharva Khairnar", role: "AI Researcher", avatar: "AK" },
]

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-5xl">
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            About the Project
          </h1>

          <Card className="bg-gray-900 border-gray-800 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Deepfake Detector project aims to combat the growing threat of AI-generated fake videos by providing
                an accessible tool for verification. Our mission is to help maintain trust in digital media in an era
                where sophisticated AI can create increasingly convincing fake content.
              </p>
              <p>
                Deepfakes pose significant risks to privacy, security, and information integrity. By developing reliable
                detection methods, we hope to mitigate these risks and empower users to make informed judgments about
                the content they consume.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our deepfake detection system utilizes a combination of advanced technologies:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Convolutional Neural Networks (CNNs):</strong> For analyzing visual patterns and
                  inconsistencies in videos
                </li>
                <li>
                  <strong>Facial Landmark Detection:</strong> To identify subtle abnormalities in facial movements
                </li>
                <li>
                  <strong>Temporal Analysis:</strong> To detect inconsistencies across video frames
                </li>
                <li>
                  <strong>Audio-Visual Synchronization:</strong> To identify mismatches between lip movements and speech
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                  TensorFlow
                </Badge>
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                 Flask
                </Badge>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                  OpenCV
                </Badge>
                <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-700">
                  Next.js
                </Badge>
                {/* <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-700">
                  ONNX Runtime
                </Badge> */}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Guided By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-lg">SC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">Dr. Santosh Chobe</p>
                  <p className="text-gray-400">HOD of Information Technology</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}