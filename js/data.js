// ============================================================
//  PORTFOLIO DATA — Edit this file to update your portfolio
//  All sections are clearly labeled. Save & push to GitHub.
// ============================================================

const PORTFOLIO = {

  // ── PERSONAL INFO ─────────────────────────────────────────
  name: "Aman Agarwal",
  title: "Mechanical Engineer · AI Automation Builder · Full-Stack Developer",
  tagline: "I build AI-driven automation systems and full-stack apps — independently, using no-code and AI-first tools.",
  location: "Ahmedabad, Gujarat, India",
  email: "aagarwal1802@gmail.com",
  phone: "+91 8128393043",
  linkedin: "https://www.linkedin.com/in/aman-agarwal-992a70200",
  github: "https://github.com/aman-1802",
  resumeFile: "assets/Resume_Aman_Agarwal.pdf",

  // ── ABOUT ─────────────────────────────────────────────────
  about: `I'm a Mechanical Engineering graduate from SVNIT Surat who discovered a passion for building
    software systems from the ground up. I specialize in AI-driven workflow automation and full-stack
    development, creating tools that replace manual processes with intelligent, connected systems.
    My approach is independent and self-taught — I leverage no-code platforms, AI-first tools, and
    modern APIs to ship fast, functional products. I enjoy owning entire projects end-to-end, from
    architecture to deployment.`,

  // ── EXPERIENCE ────────────────────────────────────────────
  experience: [
    {
      role: "Engineering Intern",
      company: "Marudhar Industries Limited",
      period: "Jan 2025 – May 2025",
      location: "Rajasthan, India",
      highlights: [
        "Built digital web applications that fully replaced manual paper-based processes on the shop floor.",
        "Integrated apps with Google Sheets for real-time data sync across departments.",
        "Designed and deployed a DRM (Document & Record Management) application for structured file access.",
        "Created an inventory layout system to optimize warehouse space utilization.",
        "Reduced data entry time significantly by automating repetitive reporting workflows."
      ]
    }
  ],

  // ── PROJECTS ──────────────────────────────────────────────
  projects: [
    {
      title: "Web Content Monitoring & AI Digest Agent",
      tags: ["n8n", "AI Agents", "Automation", "API"],
      description: "An automated agent that continuously monitors specified web pages for content changes, summarizes updates using an LLM, and delivers a structured digest via email or messaging platforms. Eliminates the need to manually track competitor sites or news sources.",
      github: "",    // ← add GitHub link when available
      demo: "",      // ← add live demo link when available
      featured: true
    },
    {
      title: "Multi-Agent Sales Automation System",
      tags: ["n8n", "Multi-Agent", "Python", "CRM"],
      description: "A multi-agent pipeline that automates the end-to-end sales prospecting workflow — from lead sourcing and enrichment to personalized outreach and follow-up scheduling. Each agent handles a distinct stage, coordinated through an orchestration layer.",
      github: "",
      demo: "",
      featured: true
    },
    {
      title: "Personal Expense Tracker",
      tags: ["Python", "Google Sheets", "API", "Full-Stack"],
      description: "A full-stack expense tracking application with a clean dashboard, category-wise analytics, and automatic sync to Google Sheets. Built with Python backend and a responsive frontend, with Google OAuth for secure access.",
      github: "",
      demo: "",
      featured: true
    }
    // ── ADD NEW PROJECTS HERE ──
    // {
    //   title: "Your New Project",
    //   tags: ["Tag1", "Tag2"],
    //   description: "Project description here.",
    //   github: "https://github.com/...",
    //   demo: "https://...",
    //   featured: false
    // }
  ],

  // ── SKILLS ────────────────────────────────────────────────
  skills: {
    technical: [
      { name: "n8n / Workflow Automation", level: 92 },
      { name: "Python", level: 80 },
      { name: "API Integrations", level: 85 },
      { name: "Multi-Agent AI Systems", level: 78 },
      { name: "OOP & Software Design", level: 75 },
      { name: "Full-Stack Development", level: 70 },
      { name: "Google Sheets / Apps Script", level: 82 },
      { name: "MS Office Suite", level: 88 }
    ],
    soft: [
      "Problem Solving",
      "Self-Learning",
      "Project Ownership",
      "Clear Communication",
      "Systems Thinking"
    ],
    tools: ["n8n", "Python", "VS Code", "Git", "Google Workspace", "Postman", "Notion", "Make (Integromat)"]
  },

  // ── EDUCATION ─────────────────────────────────────────────
  education: [
    {
      degree: "B.Tech — Mechanical Engineering",
      institution: "SVNIT Surat (Sardar Vallabhbhai National Institute of Technology)",
      period: "2021 – 2025",
      cgpa: "7.61 / 10",
      details: "Four-year undergraduate program covering thermodynamics, fluid mechanics, manufacturing, and engineering design. Independently pursued software development and AI automation throughout the degree."
    }
  ],

  // ── CERTIFICATIONS ────────────────────────────────────────
  // Add your certifications here when ready
  certifications: [
    // {
    //   title: "Certification Name",
    //   issuer: "Issuing Organization",
    //   date: "Month Year",
    //   link: "https://..."
    // }
  ],

  // ── BLOG POSTS ────────────────────────────────────────────
  // Each post needs a corresponding HTML file in the /blog folder.
  // Template: { title, date, summary, file: "blog/my-post.html", tags: [] }
  blog: [
    {
      title: "Second Brain Universe: How I Built Multiple AI Knowledge Bases Using Claude",
      date: "April 2026",
      summary: "Inspired by Andrej Karpathy's Second Brain concept, I built multiple AI-powered knowledge bases — one for health, finance, history — using Claude Code. Here's how it works, when to use it, and when not to.",
      file: "blog/second-brain-universe.html",
      thumbnail: "assets/blog/second-brain-universe.png",
      tags: ["AI", "Second Brain", "Claude", "Knowledge Management"]
    }
    // ── ADD NEW POSTS HERE ──
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
  contactFormEndpoint: ""  // ← paste your Google Apps Script Web App URL here

};
