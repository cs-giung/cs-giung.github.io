import Link from "next/link"
import { cn } from "@/lib/utils"

interface LinkableTitleProps {
    title: React.ReactNode
    url?: string
    className?: string
    titleClassName?: string
}

export function LinkableTitle({
    title,
    url,
    className,
    titleClassName
}: LinkableTitleProps) {
    if (!url) {
        return <span className={cn(titleClassName, className)}>{title}</span>
    }

    const isPdf = url.toLowerCase().endsWith('.pdf')
    const isInternal = url.startsWith('/') && !isPdf

    if (isInternal) {
        return (
            <Link
                href={url}
                className={cn("text-blue-600 hover:underline", className, titleClassName)}
            >
                {title}
            </Link>
        )
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("text-blue-600 hover:underline", className, titleClassName)}
        >
            {title}
        </a>
    )
}
