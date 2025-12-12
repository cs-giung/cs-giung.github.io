const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');

// Helper to slugify title
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

console.log('--- Create New Post ---');

rl.question('Post Title: ', (title) => {
    if (!title) {
        console.error('Title is required.');
        rl.close();
        return;
    }

    const date = new Date().toISOString().split('T')[0];
    const slug = slugify(title);
    const filename = `${date}-${slug}.md`;
    const filePath = path.join(POSTS_DIR, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        console.error(`Error: Post already exists at ${filename}`);
        rl.close();
        return;
    }

    rl.question('Author (default: Giung): ', (author) => {
        const finalAuthor = author.trim() || 'Giung';

        rl.question('Description: ', (description) => {

            const frontmatter = `---
title: "${title}"
date: "${date}"
author: "${finalAuthor}"
description: "${description || ''}"
---

Write your content here...
`;

            fs.writeFileSync(filePath, frontmatter);
            console.log(`\n✅ Created new post: ${filename}`);
            console.log(`File path: data/posts/${filename}`);

            rl.close();
        });
    });
});
