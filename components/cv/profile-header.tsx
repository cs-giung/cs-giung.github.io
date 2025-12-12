import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Mail, User, GraduationCap } from 'lucide-react'
import { PersonalInfo } from '@/lib/cv-data'

interface ProfileHeaderProps {
  personal: PersonalInfo
}

export function ProfileHeader({ personal }: ProfileHeaderProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40">
              <AvatarImage src={personal.profile_image} alt={personal.name} />
              <AvatarFallback className="text-2xl">
                {personal.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{personal.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{personal.title}</p>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-2 text-sm">

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {personal.location}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {personal.email}
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`https://github.com/${personal.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>|
                <a
                  href={`https://huggingface.co/${personal.huggingface}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  HuggingFace
                </a>|
                <a
                  href={`https://www.linkedin.com/in/${personal.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`https://scholar.google.com/citations?user=${personal.google_scholar}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Scholar
                </a>|
                <a
                  href={`https://www.semanticscholar.org/author/${personal.semantic_scholar}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Semantic Scholar
                </a>|
                <a
                  href={`https://dblp.org/pid/${personal.dblp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  DBLP
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
