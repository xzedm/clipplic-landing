import fs from 'node:fs';
import path from 'node:path';

const categories = [
  {
    title: "Ship polished UI",
    description: "Ship interfaces that match design intent, not generic agent output.",
    slugs: [
      "frontend-design",
      "emil-design-eng",
      "web-interface-guidelines",
      "web-artifacts-builder",
      "impeccable",
      "better-ui",
      "better-typography",
      "better-colors",
      "better-layout",
      "better-accessibility",
      "gpt-taste",
      "industrial-brutalist-ui",
      "apple-hig-designer",
      "apple-ui-designer",
      "android-design-guidelines",
      "mobile-android-design",
      "vercel-react-best-practices",
      "apple-design"
    ]
  },
  {
    title: "Build design systems",
    description: "Tokens, Tailwind patterns, and DESIGN.md-style contracts in code.",
    slugs: [
      "tailwind-design-system",
      "stitch-design-md",
      "extract-design-system",
      "gstack",
      "vercel-composition-patterns",
      "material-3"
    ]
  },
  {
    title: "Implement from Figma",
    description: "Pull designs into the repo and hand off cleanly to production.",
    slugs: [
      "figma-use",
      "figma-generate-design",
      "design-handoff"
    ]
  },
  {
    title: "Prototype with motion",
    description: "Animation, Remotion, and fast vibe-coded experiments.",
    slugs: [
      "remotion-best-practices",
      "vibe-coding",
      "vercel-react-view-transitions",
      "hyperframes",
      "animate",
      "review-animations",
      "animation-vocabulary",
      "improve-animations",
      "find-animation-opportunities",
      "find-skills"
    ]
  },
  {
    title: "Ship & deploy",
    description: "Deploy to production and verify flows in a real browser.",
    slugs: [
      "deploy-to-vercel",
      "agent-browser",
      "review-loop"
    ]
  },
  {
    title: "Prep for interviews",
    description: "Pattern-based coding practice for technical interviews.",
    slugs: [
      "leetcode-teacher"
    ]
  }
];

function decodeHtml(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}

function extractDescription(rawSkill) {
  const lines = rawSkill.split('\n');
  let inDesc = false;
  let descLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('---') && i > 0) break;

    if (inDesc) {
      if (line.match(/^[a-zA-Z0-9_-]+:/)) {
        break;
      }
      if (line.startsWith('  ') || line.trim() === '') {
        descLines.push(line.trim());
      } else {
        break;
      }
    } else {
      const match = line.match(/^description:\s*(.*)$/);
      if (match) {
        const val = match[1].trim();
        if (val === '' || ['|', '>', '>-', '|-,', '|-'].includes(val)) {
          inDesc = true;
        } else {
          return val.replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  if (descLines.length > 0) {
    return descLines.filter(Boolean).join(' ').replace(/^["']|["']$/g, '');
  }
  return '';
}

function extractInstallCommand(html, slug) {
  const promptMatch = html.match(/q=[^"'\s&]*npx(?:%20|\+)+skills(?:%20|\+)+add[^"'\s&]*/i) ||
                      html.match(/prompt=[^"'\s&]*npx(?:%20|\+)+skills(?:%20|\+)+add[^"'\s&]*/i) ||
                      html.match(/text=[^"'\s&]*npx(?:%20|\+)+skills(?:%20|\+)+add[^"'\s&]*/i);

  if (promptMatch) {
    const decoded = decodeURIComponent(promptMatch[0]);
    const cmdMatch = decoded.match(/npx\s+skills\s+add\s+[^\r\n]+/);
    if (cmdMatch) {
      return cmdMatch[0].trim();
    }
  }

  const match = html.match(/npx\s+skills\s+add\s+[^\r\n"&<]+/);
  if (match) return match[0].trim();

  return `npx skills add ${slug}`;
}

async function fetchSkillData(slug, categoryTitle) {
  const url = `https://aiuxplayground.com/skills/${slug}`;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const html = await res.text();

      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const displayName = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : slug;

      const authorMatch = html.match(/github\.com\/([^.\/"]+)\.png/);
      const author = authorMatch ? authorMatch[1] : 'community';

      const npxCommand = extractInstallCommand(html, slug);

      const githubMatch = html.match(/href="(https:\/\/github\.com\/[^"]+)"/);
      const githubUrl = githubMatch ? githubMatch[1] : null;

      const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
      if (!preMatch) throw new Error(`No <pre> found for ${slug}`);
      const rawSkill = decodeHtml(preMatch[1]).trim();

      const nameMatch = rawSkill.match(/^name:\s*(.+)$/m);
      const description = extractDescription(rawSkill);

      return {
        slug,
        displayName,
        author,
        category: categoryTitle,
        npxCommand,
        githubUrl,
        sourceUrl: url,
        skillName: nameMatch ? nameMatch[1].trim() : slug,
        description,
        skillContent: rawSkill
      };
    } catch (err) {
      lastErr = err;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function removeIfSymlinkOrExists(p) {
  try {
    const stat = fs.lstatSync(p);
    if (stat.isSymbolicLink() || stat.isFile()) {
      fs.unlinkSync(p);
    } else if (stat.isDirectory()) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  } catch {}
}

function anchorSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Fetching skills metadata and content from aiuxplayground.com...');
  const allSkills = [];

  for (const cat of categories) {
    console.log(`Processing category: ${cat.title} (${cat.slugs.length} skills)`);
    for (let i = 0; i < cat.slugs.length; i += 5) {
      const batch = cat.slugs.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(s => fetchSkillData(s, cat.title)));
      allSkills.push(...batchResults);
    }
  }

  console.log(`Fetched ${allSkills.length} skills successfully.`);

  // 2. Prepare directories
  fs.mkdirSync('.agents/skills', { recursive: true });
  fs.mkdirSync('.skills', { recursive: true });
  fs.mkdirSync('.cursor/skills', { recursive: true });
  fs.mkdirSync('.claude/skills', { recursive: true });

  // 3. Write individual SKILL.md files & create symlinks
  for (const skill of allSkills) {
    const agentSkillDir = path.join('.agents/skills', skill.slug);
    fs.mkdirSync(agentSkillDir, { recursive: true });
    fs.writeFileSync(path.join(agentSkillDir, 'SKILL.md'), skill.skillContent + '\n', 'utf8');

    // .skills symlink
    const dotSkillsLink = path.join('.skills', skill.slug);
    removeIfSymlinkOrExists(dotSkillsLink);
    try {
      fs.symlinkSync(path.join('..', '.agents/skills', skill.slug), dotSkillsLink);
    } catch {
      fs.cpSync(agentSkillDir, dotSkillsLink, { recursive: true });
    }

    // .cursor/skills symlink
    const cursorLink = path.join('.cursor/skills', skill.slug);
    removeIfSymlinkOrExists(cursorLink);
    try {
      fs.symlinkSync(path.join('..', '..', '.agents/skills', skill.slug), cursorLink);
    } catch {
      fs.cpSync(agentSkillDir, cursorLink, { recursive: true });
    }

    // .claude/skills symlink
    const claudeLink = path.join('.claude/skills', skill.slug);
    removeIfSymlinkOrExists(claudeLink);
    try {
      fs.symlinkSync(path.join('..', '..', '.agents/skills', skill.slug), claudeLink);
    } catch {
      fs.cpSync(agentSkillDir, claudeLink, { recursive: true });
    }
  }
  console.log('Installed individual SKILL.md files across .agents/skills, .skills, .cursor/skills, .claude/skills');

  // 4. Generate master SKILLS.md
  let md = `# Engineering & AI/UX Agent Skills

> **Curated collection of 41 agent skills** for engineers and design engineers from [AI UX Playground](https://aiuxplayground.com/skills/for-engineers).
>
> Encodes UI polish, web interface guidelines, typography, OKLCH color systems, Tailwind v4 design systems, Figma MCP integration, motion & animations, deployment, and code review into standardized \`SKILL.md\` formats.
>
> **You can copy this file, individual sections, or individual skill blocks directly into any project, prompt, or agent configuration.**

---

## 📖 How to Use These Skills

### 1. Ready-To-Use in This Project
Every skill is already installed and discoverable by all major AI coding agents:
- \`.agents/skills/<skill>/SKILL.md\` (Universal / Cursor standard)
- \`.cursor/skills/<skill>\` (Cursor IDE)
- \`.claude/skills/<skill>\` (Claude Code CLI)
- \`.skills/<skill>\` (Universal agent skill directory)

### 2. Copying into New Projects or Prompts
- **Whole File**: Copy this \`SKILLS.md\` file into your new project root or \`.cursorrules\` / \`AGENTS.md\` / \`CLAUDE.md\`.
- **Single Skill**: Navigate to the skill section below, copy the entire fenced \`SKILL.md\` block, and paste it into:
  - Your project's \`.cursorrules\` or Cursor system prompt
  - Claude / ChatGPT custom instructions or chat context
  - A file named \`SKILL.md\` in your agent's skills folder (e.g. \`.agents/skills/<skill-name>/SKILL.md\`)

### 3. Official CLI Installation via \`npx skills\`
Each skill includes its official CLI command (e.g. \`npx skills add ...\`) to install globally or in any other repo.

---

## 📑 Table of Contents

| Category | Skills Count | Description |
| :--- | :---: | :--- |
`;

  for (const cat of categories) {
    md += `| [${cat.title}](#${anchorSlug(cat.title)}) | ${cat.slugs.length} | ${cat.description} |\n`;
  }

  md += `\n---\n\n## ⚡ Quick Reference Index\n\n`;
  md += `| # | Skill | Category | Author | Description |\n`;
  md += `| :---: | :--- | :--- | :--- | :--- |\n`;

  let counter = 1;
  for (const skill of allSkills) {
    const cleanDesc = skill.description.replace(/\|/g, '\\|');
    const shortDesc = cleanDesc.length > 85 ? cleanDesc.slice(0, 82) + '...' : cleanDesc;
    md += `| ${counter++} | [**${skill.displayName}**](#${anchorSlug(skill.slug + '-' + skill.displayName)}) | ${skill.category} | \`@${skill.author}\` | ${shortDesc} |\n`;
  }

  md += `\n---\n\n`;

  // Detailed categories and skills
  for (const cat of categories) {
    md += `## ${cat.title}\n\n`;
    md += `*${cat.description}*\n\n`;

    const catSkills = allSkills.filter(s => s.category === cat.title);
    for (const skill of catSkills) {
      const anchorId = anchorSlug(skill.slug + '-' + skill.displayName);
      md += `<a id="${anchorId}"></a>\n\n`;
      md += `### ${skill.displayName} (\`${skill.slug}\`)\n\n`;
      md += `- **Category**: ${skill.category}\n`;
      md += `- **Author**: [@${skill.author}](https://github.com/${skill.author})\n`;
      md += `- **Source**: [aiuxplayground.com/skills/${skill.slug}](${skill.sourceUrl})\n`;
      if (skill.githubUrl) {
        md += `- **GitHub Repository**: [${skill.githubUrl}](${skill.githubUrl})\n`;
      }
      md += `- **Install Command**:\n\`\`\`bash\n${skill.npxCommand}\n\`\`\`\n\n`;
      md += `#### SKILL.md Content\n\n`;
      md += `\`\`\`markdown\n${skill.skillContent}\n\`\`\`\n\n`;
      md += `---\n\n`;
    }
  }

  fs.writeFileSync('SKILLS.md', md, 'utf8');
  console.log(`Generated SKILLS.md (${(md.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
