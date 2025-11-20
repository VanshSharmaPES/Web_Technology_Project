import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Instructor {
  name: string;
  avatar: string;
}

export interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: Instructor;
  completion?: number; // Optional
  rating?: number;     // Optional
}

export function CourseCard({
  id,
  title,
  thumbnail,
  tags,
  instructor,
  completion,
  rating,
}: CourseCardProps) {
  
  return (
    <Link href={`/courses/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-video relative bg-muted">
          <Image
            src={thumbnail && thumbnail.startsWith('http') ? thumbnail : `/thumbnails/${thumbnail || 'placeholder.svg'}`}
            alt={title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Only render Progress bar if completion is explicitly provided */}
          {completion !== undefined && completion !== null && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>COMPLETED</span>
                <span>{Math.round(completion)}%</span>
              </div>
              <Progress value={completion} className="h-1" />
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{instructor.name ? instructor.name[0] : 'I'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{instructor.name}</p>
              {rating !== undefined && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}