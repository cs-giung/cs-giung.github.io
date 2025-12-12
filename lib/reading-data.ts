import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { getAllPosts } from './posts'

export interface ReadingItem {
    title: string
    authors: string
    url?: string
    note?: string
}

export interface ReadingData {
    scrapbook: ReadingItem[]
    outer: ReadingItem[]
}

export function getReadingData(): ReadingData {
    const filePath = path.join(process.cwd(), 'data', 'reading.yaml')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const readingData = yaml.load(fileContents) as ReadingData

    // Get all posts and convert to ReadingItem format
    const posts = getAllPosts()
    const postItems: ReadingItem[] = posts.map(post => ({
        title: post.title,
        authors: post.author,
        url: `/reading/${post.slug}`,
        note: post.description
    }))

    // Filter out posts that are already manually defined in reading.yaml (by URL)
    // to avoid duplicates if the user hasn't cleaned up yaml yet.
    const existingUrls = new Set(readingData.scrapbook?.map(item => item.url) || [])
    const newPostItems = postItems.filter(item => !existingUrls.has(item.url))

    return {
        ...readingData,
        scrapbook: [
            ...(readingData.scrapbook || []),
            ...newPostItems
        ]
    }
}
