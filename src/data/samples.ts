export interface SamplePair {
  id: string;
  role: string;
  label: string;
  description: string;
  resumeFileName: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PAIRS: SamplePair[] = [
  {
    id: 'fullstack-dev',
    role: 'Senior Full-Stack Engineer',
    label: 'Senior Full-Stack Engineer (React & Node.js)',
    description: 'Strong technical match with distributed systems, React, Node.js, and TypeScript.',
    resumeFileName: 'Alex_Chen_Senior_FullStack_Resume.docx',
    resumeText: `ALEX CHEN
San Francisco, CA | (555) 382-9102 | alex.chen@example.com | linkedin.com/in/alexchen-dev | github.com/alexchen

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 7+ years of experience architecting resilient cloud-native applications, microservices, and reactive web applications using React, TypeScript, Node.js, and AWS. Proven track record of improving system latency by 42% and leading engineering pods to deliver enterprise SaaS products.

CORE SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Webpack/Vite, WebSockets
- Backend & Cloud: Node.js (Express/NestJS), GraphQL, REST APIs, PostgreSQL, Redis, Docker, AWS (ECS, Lambda, S3, CloudFront)
- Architecture & Practices: Microservices, CI/CD (GitHub Actions), Test-Driven Development (Jest, Cypress), Agile/Scrum

PROFESSIONAL EXPERIENCE

Lead Full-Stack Engineer | CloudScale Systems (2021 – Present) | San Francisco, CA
- Spearheaded the architectural migration of core monolith into containerized microservices on AWS ECS, improving API response times by 38% and reducing infrastructure costs by $120,000 annually.
- Built real-time analytics dashboard in React 18 and TypeScript used by 45,000+ daily active enterprise users, reducing page load latency from 2.8s to 0.9s.
- Designed distributed caching tier using Redis and PostgreSQL connection pooling, handling peak loads of 15,000 requests/sec with 99.99% uptime.
- Mentored 6 junior and mid-level engineers, organized weekly architecture reviews, and increased test coverage across 14 repositories from 64% to 89%.

Full-Stack Developer | Nexus Interactive (2018 – 2021) | Austin, TX
- Engineered high-throughput checkout microservice using Node.js, Express, and Stripe API, processing over $4.2M in monthly e-commerce transactions with zero downtime.
- Developed component library in React, Storybook, and Tailwind CSS adopted across 5 product teams, cutting new feature delivery time by 30%.
- Automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing release cycles from bi-weekly to multiple daily automated deployments.
- Collaborated with product managers and UX designers to deliver A/B tests that boosted user checkout conversion by 14.5%.

Software Engineer | BitWave Solutions (2017 – 2018) | Austin, TX
- Developed RESTful API endpoints in Node.js and PostgreSQL for B2B inventory tracking system.
- Implemented responsive frontend interfaces in React and Sass, integrating third-party logistics APIs.
- Authored unit and integration test suites using Jest and Supertest, maintaining 85%+ code coverage.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin (2013 – 2017)
- GPA: 3.8 / 4.0 | Dean's Honor Roll

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2023)`,
    jobDescription: `Senior Full-Stack Engineer

Company: Apex Platform Technologies
Location: San Francisco, CA / Remote (Hybrid)

About the Role:
Apex Platform Technologies is looking for a Senior Full-Stack Engineer to lead the design and implementation of our next-generation enterprise workflow automation platform. You will be responsible for building high-performance frontend interfaces and robust backend microservices that handle millions of events per day.

Key Responsibilities:
- Architect and develop scalable web applications using React, TypeScript, and Node.js.
- Build resilient microservices, asynchronous event processors, and REST/GraphQL APIs.
- Design database schemas and optimize query performance in PostgreSQL and Redis.
- Collaborate with product management, design, and DevOps teams to deliver mission-critical software.
- Drive high engineering standards through thorough code reviews, automated CI/CD pipelines, and comprehensive unit/integration testing (Jest, Cypress).
- Mentor junior engineers and champion clean code, observability, and modern cloud architecture.

Requirements:
- 5+ years of professional full-stack software development experience.
- Deep expertise in React, modern JavaScript/TypeScript, and modern frontend state management.
- Strong backend experience with Node.js (Express, NestJS, or similar) and relational databases (PostgreSQL).
- Proven experience with Docker, cloud infrastructure (AWS or GCP), and CI/CD automation.
- Solid understanding of distributed systems principles, caching strategies (Redis), and API design.
- Excellent communication skills and passion for collaborating in an agile team environment.

Preferred Qualifications:
- Experience with Kubernetes or container orchestration.
- Familiarity with Kafka or distributed message queues.
- Bachelor's degree in Computer Science or related engineering field.`
  },
  {
    id: 'product-manager',
    role: 'Lead Product Manager',
    label: 'Lead Product Manager (FinTech / SaaS)',
    description: 'Product leadership, user discovery, metrics quantification, and roadmap strategy.',
    resumeFileName: 'Jordan_Taylor_Lead_PM_Resume.pdf',
    resumeText: `JORDAN TAYLOR
New York, NY | (212) 555-0199 | jordan.taylor@example.com | linkedin.com/in/jordantaylor-pm

EXECUTIVE SUMMARY
Results-driven Lead Product Manager with 8+ years of experience leading cross-functional teams to build high-growth SaaS and B2B FinTech products. Track record of scaling product ARR from $4M to $22M, launching AI-assisted reconciliation tools, and optimizing onboarding funnels that increased activation by 35%.

CORE COMPETENCIES
- Strategy & Roadmapping: Product Vision, OKRs, Product Lifecycle Management, Market Research, Competitive Analysis
- Execution & Delivery: Agile/Scrum, Sprint Planning, PRDs, User Story Mapping, JIRA, Linear
- Data & Analytics: SQL, Amplitude, Mixpanel, Tableau, A/B Testing, User Retention Modeling
- Technical & Design: API Concepts, Figma, Wireframing, User Journey Mapping, Design Systems

EXPERIENCE

Lead Product Manager | NovaPay Financial (2021 – Present) | New York, NY
- Directed cross-functional team of 14 engineers, 2 product designers, and 2 data analysts to build NovaPay's flagship automated reconciliation engine, generating $8.5M in ARR within the first 12 months.
- Formulated and executed multi-year product roadmap aligned with company OKRs, prioritizing features based on user feedback, competitive research, and revenue impact.
- Ran extensive A/B tests across customer onboarding flow, reducing time-to-first-transaction from 4 days to 18 minutes and boosting 30-day user activation by 35%.
- Collaborated with enterprise sales and compliance teams to ensure SOC 2 Type II and PCI-DSS compliance across all payment flows.

Senior Product Manager | MetricFlow Analytics (2018 – 2021) | Boston, MA
- Owned the self-serve subscription product line, growing self-serve ARR by 140% year-over-year.
- Led the zero-to-one build of custom dashboard reporting suite in Figma and Linear, adopted by 70% of enterprise tier customers within 90 days of launch.
- Conducted 80+ customer discovery interviews to synthesize user pain points into actionable PRDs and user stories.
- Partnered with marketing to launch customer engagement campaigns that reduced monthly churn from 3.2% to 1.4%.

Product Manager | BlueSky Labs (2016 – 2018) | Boston, MA
- Managed sprint backlog and groomed user stories for mobile iOS and Android applications with 200,000+ MAU.
- Analyzed user cohort retention and funnels using Amplitude and SQL to identify key drop-off stages.

EDUCATION & CERTIFICATIONS
Bachelor of Arts in Economics & Media Studies | Boston University (2012 – 2016)
Certified Scrum Product Owner (CSPO) | Pragmatic Institute Certified (PMC-III)`,
    jobDescription: `Principal Product Manager - SaaS Growth

Company: FinStack Technologies
Location: New York, NY (Hybrid)

Role Overview:
FinStack is hiring a Principal Product Manager to own our core B2B payments and financial automation platform. In this role, you will define product vision, align executive stakeholders, and work closely with engineering and design to build intuitive, mission-critical financial tools.

What You'll Do:
- Own end-to-end product strategy and execution for our B2B workflow platform.
- Translate business objectives and customer discovery insights into clear roadmaps, PRDs, and quantifiable success metrics.
- Partner with engineering leads to drive agile execution, manage trade-offs, and deliver releases on schedule.
- Run experiments, user research, and data analyses (using SQL, Amplitude, or Mixpanel) to optimize customer adoption and retention.
- Work closely with Sales, Customer Success, and Compliance to unblock enterprise deals.

Requirements:
- 6+ years of product management experience, preferably in B2B SaaS, FinTech, or developer platforms.
- Proven track record of taking complex products from discovery to scale with measurable revenue growth.
- Deep expertise in data-driven decision making, product metrics, and experimentation methodologies.
- Exceptional written and oral communication skills, with experience presenting to executive leadership.
- Technical fluency: Ability to engage with engineers on API design, data architecture, and technical feasibility.

Nice-to-Have:
- Experience with FinTech payment rails, automated reconciliation, or ledger architecture.
- Background in Economics, Finance, or Computer Science.`
  }
];
