'use client';

import React, { useEffect, useState } from 'react';

interface Heading {
    level: number;
    title: string;
    slug: string;
}

interface TableOfContentsProps {
    headings: Heading[];
    postTitle: string;
}

export function TableOfContents({ headings, postTitle }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            // 1. Check if we are at the very bottom of the page
            // We use a 50px buffer to account for different browser behaviors
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

            if (isAtBottom && headings.length > 0) {
                setActiveId(headings[headings.length - 1].slug);
                return;
            }

            // 2. Reset highlight when at the very top of the page
            if (window.scrollY < 120) {
                setActiveId('');
                return;
            }

            // 3. Normal scroll-spy logic
            const scrollPosition = window.scrollY + 120;
            
            let currentActiveId = '';
            for (const heading of headings) {
                const element = document.getElementById(heading.slug);
                if (element && element.offsetTop <= scrollPosition) {
                    currentActiveId = heading.slug;
                } else {
                    // Since headings are in order, we can stop once we find one below the threshold
                    break;
                }
            }
            
            if (currentActiveId !== activeId) {
                setActiveId(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Run once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings, activeId]);

    if (headings.length === 0) return null;

    return (
        <nav className="space-y-4 text-sm text-right">
            <div className="mb-6">
                <a 
                    href="#" 
                    className={`block pr-4 border-r-2 transition-all duration-300 hover:text-blue-600 ${
                        activeId === '' 
                            ? "border-blue-600 text-foreground font-bold" 
                            : "border-transparent text-muted-foreground/30"
                    }`}
                >
                    <span className="text-xs uppercase tracking-widest block mb-1 opacity-50 font-normal">Post</span>
                    <span className="leading-tight block">{postTitle}</span>
                </a>
            </div>
            
            <ul className="space-y-1">
                {headings.map((heading) => {
                    const isActive = activeId === heading.slug;
                    return (
                        <li 
                            key={heading.slug} 
                            className={`transition-colors duration-200 ${
                                isActive 
                                    ? "text-blue-600" 
                                    : "text-muted-foreground/70 hover:text-blue-600"
                            }`}
                        >
                            <a 
                                href={`#${heading.slug}`} 
                                className={`block py-1 pr-4 border-r-2 transition-all duration-200 ${
                                    isActive 
                                        ? "border-blue-600 font-bold scale-105 origin-right" 
                                        : "border-transparent hover:border-blue-400"
                                } ${
                                    heading.level === 3 ? "text-xs pr-6" : "font-medium"
                                }`}
                            >
                                {heading.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
