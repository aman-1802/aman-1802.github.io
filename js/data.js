// ============================================================
//  PORTFOLIO DATA — Edit this file to update your portfolio
//  All sections are clearly labeled. Save & push to GitHub.
// ============================================================

const PORTFOLIO = {

  // ── PERSONAL INFO ─────────────────────────────────────────
  name: "Aman Agarwal",
  title: "Mechanical Engineer · AI Automation Builder",
  tagline: "I build AI-driven automation systems — independently, using no-code and AI-first tools.",
  location: "Ahmedabad, Gujarat, India",
  email: "aagarwal1802@gmail.com",
  phone: "+91 8128393043",
  linkedin: "https://www.linkedin.com/in/aman-agarwal-992a70200",
  github: "https://github.com/aman-1802",
  resumeFile: "assets/Resume_Aman_Agarwal.pdf",

  // ── ABOUT ─────────────────────────────────────────────────
  about: `I'm a Mechanical Engineering graduate from SVNIT Surat who discovered a passion for building
    software systems from the ground up. I specialize in AI-driven workflow automation, creating tools
    that replace manual processes with intelligent, connected systems.
    My approach is independent and self-taught — I leverage no-code platforms, AI-first tools, and
    modern APIs to ship fast, functional products. I enjoy owning entire projects end-to-end, from
    architecture to deployment.`,

  // ── EXPERIENCE ────────────────────────────────────────────
  experience: [
    {
      role: "Engineering Intern",
      company: "Marudhar Industries Limited",
      period: "Jan 2025 – May 2025",
      location: "Ahmedabad, Gujarat, India",
      highlights: [
        "Built digital web applications that fully replaced manual paper-based processes on the shop floor.",
        "Integrated apps with Google Sheets for real-time data sync across departments.",
        "Designed and deployed a DRM (Document & Record Management) application for structured file access.",
        "Created an inventory layout system to optimize warehouse space utilization.",
        "Reduced data entry time significantly by automating repetitive reporting workflows."
      ]
    }
  ],

  // ── PROJECTS (newest first) ───────────────────────────────
  projects: [
    {
      title: "AiSolutions RevOps Automation",
      tags: ["n8n", "Python", "RAG", "ElevenLabs", "FastAPI", "Multi-Agent"],
      description: "A four-agent revenue operations system — prospecting, cold email drafting, a voice RAG agent, and calendar booking — all running on a single self-hosted Hetzner VPS with n8n, FastAPI, ChromaDB, and ElevenLabs.",
      metrics: ["4 AI Agents", "6-Tool Stack", "VPS Deployed"],
      file: "projects/aisolutions-revops.html",
      thumbnail: "assets/projects/aisolutions-revops.png",
      date: "May 2026",
      github: "",
      demo: "",
      featured: true,
      category: "automation"
    },
    {
      title: "SaudaaAI — Voice to Quotation, Instantly",
      tags: ["n8n", "Python", "Flask", "Sarvam AI", "Gemini", "Telegram Bot"],
      description: "An end-to-end voice-to-quotation system for Indian commodity buyers. Send a voice message in Hindi or Gujarati on Telegram — get a professional quotation document back in seconds. No app, no portal, no friction.",
      metrics: ["2 Languages", "Voice → DOCX", "6 Integrations"],
      file: "projects/saudaa-ai.html",
      thumbnail: "assets/projects/saudaa-ai.png",
      date: "April 2026",
      github: "",
      demo: "",
      featured: true,
      category: "automation"
    },
    {
      title: "Aeon to Telegram — AI Essay Summary Automation",
      tags: ["n8n", "AI Agents", "Automation", "Telegram Bot"],
      description: "An AI-powered workflow that monitors newly published Aeon essays daily, generates concise AI summaries, and delivers them instantly to Telegram — with duplicate tracking so only fresh content is ever processed.",
      metrics: ["Daily Monitor", "Zero Duplicates", "Auto-Delivered"],
      file: "projects/aeon-telegram.html",
      thumbnail: "assets/projects/aeon-telegram.png",
      date: "March 2026",
      github: "",
      demo: "",
      featured: true,
      category: "automation"
    },
    {
      title: "Engineered to the Last Atom | AURELIUS Chronometer",
      tags: ["AI Video", "Ad Creative", "Generative AI", "Motion Design", "Product Commercial"],
      description: "A fully AI-generated luxury watch commercial — brand, visuals, motion, and copy created from scratch using generative AI tools. No camera. No studio. No real footage.",
      file: "projects/aurelius-ad.html",
      thumbnail: "https://img.youtube.com/vi/iEKz3KSffRw/maxresdefault.jpg",
      videoEmbed: "https://www.youtube.com/embed/iEKz3KSffRw?rel=0&modestbranding=1",
      date: "May 2026",
      github: "",
      demo: "https://youtu.be/iEKz3KSffRw",
      featured: true,
      category: "creative"
    }
    // ── ADD NEW PROJECTS HERE ──
    // {
    //   title: "Your New Project",
    //   tags: ["Tag1", "Tag2"],
    //   description: "Project description here.",
    //   category: "automation", // or "creative"
    //   file: "projects/your-project.html",
    //   thumbnail: "assets/projects/your-thumbnail.png",
    //   videoEmbed: "", // YouTube embed URL for creative projects
    //   github: "https://github.com/...",
    //   demo: "https://...",
    //   featured: false
    // }
  ],

  // ── SKILLS ────────────────────────────────────────────────
  skills: {
    technical: [
      { name: "n8n / Workflow Automation" },
      { name: "Python" },
      { name: "API Integrations" },
      { name: "Multi-Agent AI Systems" },
      { name: "MCP" },
      { name: "MS Office Suite" }
    ],
    creative: [
      "Visual Storyteller",
      "AI Image & Video Creation"
    ],
    soft: [
      "Problem Solving",
      "Self-Learning",
      "Project Ownership",
      "Clear Communication",
      "Systems Thinking"
    ],
    tools: ["n8n", "Python", "VS Code", "Git", "Google Workspace", "Notion", "Claude", "Gemini", "ChatGPT"]
  },

  // ── EDUCATION ─────────────────────────────────────────────
  education: [
    {
      degree: "B.Tech — Mechanical Engineering",
      institution: "SVNIT Surat (Sardar Vallabhbhai National Institute of Technology)",
      period: "2021 – 2025",
      details: "Four-year undergraduate program covering thermodynamics, fluid mechanics, manufacturing, and engineering design. Independently explored software development and self-taught automation and AI.",
      logo: "assets/education/svnit-logo.svg"
    }
  ],

  // ── CERTIFICATIONS ────────────────────────────────────────
  certifications: [
    {
      title: "Claude 101",
      issuer: "Anthropic",
      date: "April 2026",
      description: "Covered the fundamentals of prompt engineering and working effectively with Claude. Explored Claude's unique features including Claude Code, agentic workflows, Claude's memory system, and best practices for building AI-powered automation systems.",
      pdfFile: "assets/certs/claude-101.pdf",
      thumbStyle: "claude"
    },
    {
      title: "AI Builder: Create Agents, Voice Agents & Automations in n8n",
      issuer: "Udemy — Ligency & Ed Donner",
      date: "March 2026",
      description: "Built end-to-end automation workflows in n8n including AI agents, voice agents with tool-calling, and multi-step pipelines. Covered workflow design, webhook integrations, HTTP requests, and connecting LLMs to real-world APIs and actions.",
      pdfFile: "assets/certs/n8n-builder.pdf",
      thumbStyle: "udemy"
    }
  ],

  // ── BLOG POSTS ────────────────────────────────────────────
  // Each post needs a corresponding HTML file in the /blog folder.
  // Template: { title, date, summary, file: "blog/my-post.html", tags: [] }
  // ── BLOG POSTS — newest first ─────────────────────────────
  blog: [
    {
      title: "I Made a Bridal Film Without a Camera. Here Is How.",
      date: "May 2026",
      summary: "A sari brand. A brief about heritage, emotion, and light. And a team of AI tools instead of a crew. This is the story of how AANCHAL came to life — frame by frame, without a single real photograph.",
      file: "blog/aanchal-bridal-film.html",
      thumbnail: "assets/blog/aanchal-thumbnail.jpg",
      tags: ["AI Video", "Bridal Film", "Generative AI", "Creative"]
    },
    {
      title: "What I Learned Building My First AI Agent",
      date: "May 2026",
      summary: "I built an AI agent that scans websites, summarizes updates, and sends them to Telegram. It worked perfectly — until it didn't. Here's what broke and what it taught me about the real architecture of automation.",
      file: "blog/first-ai-agent.html",
      thumbnail: "assets/blog/first-ai-agent.png",
      tags: ["AI Agents", "Automation", "n8n", "Lessons Learned"]
    },
    {
      title: "Second Brain Universe: How I Built Multiple AI Knowledge Bases Using Claude",
      date: "April 2026",
      summary: "Inspired by Andrej Karpathy's Second Brain concept, I built multiple AI-powered knowledge bases — one for health, finance, history — using Claude Code. Here's how it works, when to use it, and when not to.",
      file: "blog/second-brain-universe.html",
      thumbnail: "assets/blog/second-brain-universe.png",
      tags: ["AI", "Second Brain", "Claude", "Knowledge Management"]
    }
    // ── ADD NEW POSTS HERE (newest first) ──
    // {
    //   title: "Your Post Title",
    //   date: "Month Year",
    //   summary: "Short description shown on the blog card.",
    //   file: "blog/your-post-filename.html",
    //   thumbnail: "assets/blog/your-thumbnail.jpg",
    //   tags: ["Tag1", "Tag2"]
    // }
  ],

  // ── GOOGLE ANALYTICS ─────────────────────────────────────
  // Replace with your actual GA4 Measurement ID (format: G-XXXXXXXXXX)
  // Get it at: https://analytics.google.com → Admin → Data Streams → Web stream details
  googleAnalyticsId: "G-KX0GT1GQPX",

  // ── GOOGLE SHEETS CONTACT FORM ────────────────────────────
  // 1. Create a Google Sheet
  // 2. Go to Extensions → Apps Script
  // 3. Paste the Apps Script from README.md and deploy as Web App
  // 4. Paste the deployed Web App URL here
  contactFormEndpoint: "https://script.google.com/macros/s/AKfycbyTqNhf7Ah9qb1BgjvGIQCRwyBLDQ7R4niaOjvIy9OmtVO0ATtDpQfSxvuUvry1AQsymw/exec"

};
