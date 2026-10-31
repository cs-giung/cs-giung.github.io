import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { EmailContact } from '@/components/contact/email-contact'
import { Mail, User, GraduationCap } from 'lucide-react'
import type { PersonalInfo } from '@/lib/cv-data'

interface ProfileHeaderProps {
  personal: PersonalInfo
}

export function ProfileHeader({ personal }: ProfileHeaderProps) {
  return (
    <Card className="about-profile w-full">
      <CardContent>
        <div className="about-profile-layout flex flex-col md:flex-row gap-6 items-center">
          {/* Profile Image */}
          <div className="about-profile-image flex-shrink-0">
            <Image
              data-slot="avatar"
              src={personal.profile_image}
              alt={personal.name}
              width={256}
              height={256}
              unoptimized
              loading="eager"
              fetchPriority="high"
              className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{personal.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{personal.title}</p>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <EmailContact address={personal.email} className="text-blue-600 hover:underline" />
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
                </a>
                |
                <a
                  href={`https://huggingface.co/${personal.huggingface}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  HuggingFace
                </a>
                |
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
                </a>
                |
                <a
                  href={`https://www.semanticscholar.org/author/${personal.semantic_scholar}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Semantic Scholar
                </a>
                |
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
