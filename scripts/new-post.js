const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
const BLOG_DIR = path.join(process.cwd(), 'data', 'blog');

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

rl.question('Type (1: Reading, 2: Blog) [default: 1]: ', (type) => {
    const isBlog = type === '2';
    const targetDir = isBlog ? BLOG_DIR : POSTS_DIR;
    const typeLabel = isBlog ? 'Blog' : 'Reading';

    rl.question(`${typeLabel} Post Title: `, (title) => {
        if (!title) {
            console.error('Title is required.');
            rl.close();
            return;
        }

        const date = new Date().toISOString().split('T')[0];
        const slug = slugify(title);
        const filename = isBlog ? `${slug}.md` : `${date}-${slug}.md`;
        const filePath = path.join(targetDir, filename);

        // Check if file exists
        if (fs.existsSync(filePath)) {
            console.error(`Error: Post already exists at ${filename}`);
            rl.close();
            return;
        }

        rl.question('Author (default: Giung Nam): ', (author) => {
            const finalAuthor = author.trim() || 'Giung Nam';

            const askCategory = (callback) => {
                if (isBlog) {
                    rl.question('Category (1: Posts, 2: Notes & Scribbles) [default: 1]: ', (cat) => {
                        const categories = { '1': 'Posts', '2': 'Notes & Scribbles' };
                        callback(categories[cat] || 'Posts');
                    });
                } else {
                    callback(null);
                }
            };

            askCategory((category) => {
                rl.question('Description: ', (description) => {

                    const categoryLine = isBlog ? `category: "${category}"\n` : '';
                    const frontmatter = `---
title: "${title}"
date: "${date}"
author: "${finalAuthor}"
${categoryLine}description: "${description || ''}"
---

Write your content here...
`;

                fs.writeFileSync(filePath, frontmatter);
                console.log(`\n✅ Created new ${typeLabel.toLowerCase()} post: ${filename}`);
                console.log(`File path: data/${isBlog ? 'blog' : 'posts'}/${filename}`);

                rl.close();
            });
        });
    });
});
