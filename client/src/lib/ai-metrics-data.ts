export interface MetricConfig {
  id: string;
  title: string;
  description: string;
  currentValue?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
  };
  chartType: "area" | "bar" | "donut" | "table" | "stat" | "timeline";
  timeSeries?: { date: string; value: number }[];
  comparison?: { label: string; value: number; color?: string; change?: number }[];
  milestones?: { date: string; title: string; description: string }[];
  source: string;
  sourceUrl: string;
  refreshFrequency: string;
}

export interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  metrics: MetricConfig[];
}

// Executive overview metrics shown at the top of the dashboard
export const EXECUTIVE_METRICS: {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  source: string;
}[] = [
  {
    id: "ai-market-size",
    label: "Global AI Market",
    value: "$244B",
    change: "+28%",
    trend: "up",
    source: "Grand View Research",
  },
  {
    id: "enterprise-adoption",
    label: "Enterprise Adoption",
    value: "72%",
    change: "+12%",
    trend: "up",
    source: "McKinsey Global Survey",
  },
  {
    id: "avg-token-cost",
    label: "Avg Token Cost (1M out)",
    value: "$3.50",
    change: "-68%",
    trend: "down",
    source: "Artificial Analysis",
  },
  {
    id: "ai-job-postings",
    label: "AI Job Postings",
    value: "128K",
    change: "+34%",
    trend: "up",
    source: "Indeed Hiring Lab",
  },
  {
    id: "ai-investment",
    label: "VC AI Investment (Q4)",
    value: "$18.9B",
    change: "+42%",
    trend: "up",
    source: "PitchBook",
  },
  {
    id: "top-model-score",
    label: "Top Model (MMLU)",
    value: "92.3%",
    change: "+3.1pp",
    trend: "up",
    source: "Papers With Code",
  },
];

// Full category definitions with nested metrics
export const AI_DASHBOARD_CATEGORIES: CategoryConfig[] = [
  {
    id: "capability",
    title: "AI Capability & Performance",
    description: "Tracking frontier model benchmarks, reasoning ability, and multimodal progress.",
    icon: "Brain",
    gradient: "from-purple-600 to-indigo-600",
    metrics: [
      {
        id: "mmlu-leaderboard",
        title: "MMLU Benchmark Leaderboard",
        description: "Top models by Massive Multitask Language Understanding score.",
        chartType: "table",
        comparison: [
          { label: "Claude 4 Opus", value: 92.3, change: 0 },
          { label: "GPT-5", value: 91.8, change: -0.5 },
          { label: "Gemini Ultra 2", value: 90.7, change: -1.6 },
          { label: "Llama 4 405B", value: 88.9, change: -3.4 },
          { label: "Mistral Large 3", value: 86.2, change: -6.1 },
        ],
        source: "Papers With Code",
        sourceUrl: "https://paperswithcode.com/sota/multi-task-language-understanding-on-mmlu",
        refreshFrequency: "Weekly",
      },
      {
        id: "training-compute",
        title: "Training Compute Growth",
        description: "FLOPs used to train frontier models over time.",
        currentValue: "5e25",
        trend: { direction: "up", value: "+10x/year" },
        chartType: "area",
        timeSeries: [
          { date: "2020", value: 1e21 },
          { date: "2021", value: 5e21 },
          { date: "2022", value: 5e23 },
          { date: "2023", value: 2e24 },
          { date: "2024", value: 1e25 },
          { date: "2025", value: 5e25 },
        ],
        source: "Epoch AI",
        sourceUrl: "https://epochai.org/data/notable-ai-models",
        refreshFrequency: "Monthly",
      },
      {
        id: "reasoning-progress",
        title: "Reasoning Benchmarks (ARC-AGI)",
        description: "Progress on abstract reasoning challenges over time.",
        currentValue: "78%",
        trend: { direction: "up", value: "+22pp YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2022", value: 21 },
          { date: "2023 Q1", value: 34 },
          { date: "2023 Q3", value: 42 },
          { date: "2024 Q1", value: 56 },
          { date: "2024 Q3", value: 68 },
          { date: "2025 Q1", value: 78 },
        ],
        source: "ARC Prize",
        sourceUrl: "https://arcprize.org",
        refreshFrequency: "Quarterly",
      },
    ],
  },
  {
    id: "adoption",
    title: "Enterprise Adoption",
    description: "How organizations are integrating AI into their workflows.",
    icon: "Building2",
    gradient: "from-blue-600 to-cyan-600",
    metrics: [
      {
        id: "adoption-by-industry",
        title: "AI Adoption by Industry",
        description: "Percentage of organizations with at least one AI deployment.",
        chartType: "bar",
        comparison: [
          { label: "Tech/Software", value: 89, color: "#3b82f6" },
          { label: "Financial Svcs", value: 78, color: "#6366f1" },
          { label: "Healthcare", value: 65, color: "#8b5cf6" },
          { label: "Manufacturing", value: 58, color: "#a855f7" },
          { label: "Retail", value: 52, color: "#c084fc" },
          { label: "Education", value: 41, color: "#d8b4fe" },
        ],
        source: "McKinsey Global Survey",
        sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
        refreshFrequency: "Annually",
      },
      {
        id: "use-case-breakdown",
        title: "Top AI Use Cases",
        description: "Most commonly deployed AI use cases across enterprises.",
        chartType: "donut",
        comparison: [
          { label: "Content Gen", value: 28, color: "#3b82f6" },
          { label: "Code Assist", value: 22, color: "#6366f1" },
          { label: "Customer Svc", value: 18, color: "#8b5cf6" },
          { label: "Data Analysis", value: 16, color: "#a855f7" },
          { label: "Process Auto", value: 10, color: "#c084fc" },
          { label: "Other", value: 6, color: "#e2e8f0" },
        ],
        source: "Deloitte AI Institute",
        sourceUrl: "https://www2.deloitte.com/us/en/pages/consulting/articles/state-of-generative-ai-in-enterprise.html",
        refreshFrequency: "Quarterly",
      },
      {
        id: "developer-adoption",
        title: "Developer AI Tool Adoption",
        description: "Developers using AI coding assistants in daily workflow.",
        currentValue: "76%",
        trend: { direction: "up", value: "+18pp YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2022 Q3", value: 29 },
          { date: "2023 Q1", value: 38 },
          { date: "2023 Q3", value: 48 },
          { date: "2024 Q1", value: 58 },
          { date: "2024 Q3", value: 68 },
          { date: "2025 Q1", value: 76 },
        ],
        source: "Stack Overflow Developer Survey",
        sourceUrl: "https://survey.stackoverflow.co",
        refreshFrequency: "Annually",
      },
    ],
  },
  {
    id: "costs",
    title: "AI Costs & Pricing",
    description: "Token pricing trends, infrastructure costs, and ROI benchmarks.",
    icon: "DollarSign",
    gradient: "from-emerald-600 to-teal-600",
    metrics: [
      {
        id: "token-pricing-trend",
        title: "Output Token Pricing Trend",
        description: "Average cost per million output tokens for frontier models.",
        currentValue: "$3.50/M",
        trend: { direction: "down", value: "-68% YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2023 Q1", value: 60 },
          { date: "2023 Q3", value: 30 },
          { date: "2024 Q1", value: 15 },
          { date: "2024 Q3", value: 8 },
          { date: "2025 Q1", value: 3.5 },
        ],
        source: "Artificial Analysis",
        sourceUrl: "https://artificialanalysis.ai",
        refreshFrequency: "Weekly",
      },
      {
        id: "provider-pricing",
        title: "Provider Output Pricing Comparison",
        description: "Current output token prices per million across major providers.",
        chartType: "table",
        comparison: [
          { label: "GPT-4o", value: 2.5, change: -60 },
          { label: "Claude Sonnet", value: 3.0, change: -80 },
          { label: "Gemini 2 Pro", value: 3.5, change: -50 },
          { label: "Claude Opus", value: 15.0, change: -50 },
          { label: "GPT-5", value: 10.0, change: 0 },
        ],
        source: "Provider Pricing Pages",
        sourceUrl: "https://artificialanalysis.ai/models",
        refreshFrequency: "Daily",
      },
      {
        id: "gpu-cost-trend",
        title: "Cloud GPU Cost (A100/H100)",
        description: "Average hourly cost for high-end GPU instances.",
        currentValue: "$1.85/hr",
        trend: { direction: "down", value: "-42% YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2023 Q1", value: 4.5 },
          { date: "2023 Q3", value: 3.8 },
          { date: "2024 Q1", value: 3.2 },
          { date: "2024 Q3", value: 2.4 },
          { date: "2025 Q1", value: 1.85 },
        ],
        source: "Cloud Provider Pricing",
        sourceUrl: "https://cloud.google.com/pricing",
        refreshFrequency: "Monthly",
      },
    ],
  },
  {
    id: "investment",
    title: "AI Investment & Funding",
    description: "Venture capital flows, corporate spending, and market valuations.",
    icon: "TrendingUp",
    gradient: "from-amber-500 to-orange-600",
    metrics: [
      {
        id: "quarterly-vc",
        title: "Quarterly AI VC Investment",
        description: "Total venture capital invested in AI startups per quarter.",
        currentValue: "$18.9B",
        trend: { direction: "up", value: "+42% QoQ" },
        chartType: "area",
        timeSeries: [
          { date: "2023 Q1", value: 7.2 },
          { date: "2023 Q2", value: 8.1 },
          { date: "2023 Q3", value: 9.5 },
          { date: "2023 Q4", value: 12.3 },
          { date: "2024 Q1", value: 11.8 },
          { date: "2024 Q2", value: 13.2 },
          { date: "2024 Q3", value: 15.1 },
          { date: "2024 Q4", value: 18.9 },
        ],
        source: "PitchBook",
        sourceUrl: "https://pitchbook.com/news/reports/q4-2024-ai-ml-report",
        refreshFrequency: "Quarterly",
      },
      {
        id: "corporate-ai-spend",
        title: "Corporate AI Spending Forecast",
        description: "Projected global enterprise AI spending by year.",
        chartType: "bar",
        comparison: [
          { label: "2023", value: 154, color: "#f59e0b" },
          { label: "2024", value: 197, color: "#f97316" },
          { label: "2025E", value: 244, color: "#ea580c" },
          { label: "2026E", value: 312, color: "#dc2626" },
          { label: "2027E", value: 391, color: "#b91c1c" },
        ],
        source: "IDC Worldwide AI Spending Guide",
        sourceUrl: "https://www.idc.com/getdoc.jsp?containerId=prUS51236924",
        refreshFrequency: "Quarterly",
      },
      {
        id: "nvidia-revenue",
        title: "NVIDIA Data Center Revenue ($B)",
        description: "Quarterly data center segment revenue as AI infrastructure proxy.",
        currentValue: "$35.1B",
        trend: { direction: "up", value: "+94% YoY" },
        chartType: "area",
        timeSeries: [
          { date: "Q1'24", value: 14.5 },
          { date: "Q2'24", value: 18.4 },
          { date: "Q3'24", value: 22.6 },
          { date: "Q4'24", value: 27.5 },
          { date: "Q1'25", value: 35.1 },
        ],
        source: "NVIDIA Earnings",
        sourceUrl: "https://investor.nvidia.com",
        refreshFrequency: "Quarterly",
      },
    ],
  },
  {
    id: "talent",
    title: "AI Talent & Workforce",
    description: "Job market trends, skills demand, and workforce transformation.",
    icon: "Users",
    gradient: "from-rose-500 to-pink-600",
    metrics: [
      {
        id: "ai-job-postings-trend",
        title: "AI Job Postings Trend",
        description: "Monthly AI-related job postings on major platforms.",
        currentValue: "128K",
        trend: { direction: "up", value: "+34% YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2023 Q1", value: 68 },
          { date: "2023 Q2", value: 72 },
          { date: "2023 Q3", value: 78 },
          { date: "2023 Q4", value: 85 },
          { date: "2024 Q1", value: 95 },
          { date: "2024 Q2", value: 108 },
          { date: "2024 Q3", value: 118 },
          { date: "2024 Q4", value: 128 },
        ],
        source: "Indeed Hiring Lab",
        sourceUrl: "https://www.hiringlab.org",
        refreshFrequency: "Monthly",
      },
      {
        id: "top-ai-skills",
        title: "Most In-Demand AI Skills",
        description: "Skills most frequently listed in AI job postings.",
        chartType: "bar",
        comparison: [
          { label: "Prompt Eng", value: 82, color: "#f43f5e" },
          { label: "Python/ML", value: 78, color: "#ec4899" },
          { label: "LLM Fine-tune", value: 64, color: "#d946ef" },
          { label: "RAG/Retrieval", value: 58, color: "#a855f7" },
          { label: "MLOps", value: 45, color: "#8b5cf6" },
          { label: "AI Safety", value: 31, color: "#6366f1" },
        ],
        source: "LinkedIn Economic Graph",
        sourceUrl: "https://economicgraph.linkedin.com",
        refreshFrequency: "Monthly",
      },
      {
        id: "ai-salary-ranges",
        title: "AI Role Salary Benchmarks (USD)",
        description: "Median annual salary for key AI roles in the US.",
        chartType: "bar",
        comparison: [
          { label: "ML Engineer", value: 185, color: "#f43f5e" },
          { label: "AI Architect", value: 210, color: "#ec4899" },
          { label: "Data Scientist", value: 155, color: "#d946ef" },
          { label: "AI PM", value: 175, color: "#a855f7" },
          { label: "Prompt Eng", value: 140, color: "#8b5cf6" },
        ],
        source: "BLS & Levels.fyi",
        sourceUrl: "https://www.bls.gov/ooh/computer-and-information-technology",
        refreshFrequency: "Annually",
      },
    ],
  },
  {
    id: "infrastructure",
    title: "AI Infrastructure",
    description: "Compute capacity, model repositories, and open-source ecosystem.",
    icon: "Server",
    gradient: "from-slate-600 to-zinc-700",
    metrics: [
      {
        id: "huggingface-models",
        title: "Hugging Face Model Repository Growth",
        description: "Total number of publicly available models on Hugging Face.",
        currentValue: "950K+",
        trend: { direction: "up", value: "+85% YoY" },
        chartType: "area",
        timeSeries: [
          { date: "2022", value: 60000 },
          { date: "2023 Q1", value: 150000 },
          { date: "2023 Q3", value: 300000 },
          { date: "2024 Q1", value: 500000 },
          { date: "2024 Q3", value: 750000 },
          { date: "2025 Q1", value: 950000 },
        ],
        source: "Hugging Face",
        sourceUrl: "https://huggingface.co/models",
        refreshFrequency: "Weekly",
      },
      {
        id: "top500-ai",
        title: "Top500 Supercomputer AI Workloads",
        description: "Percentage of Top500 systems running AI/ML workloads.",
        currentValue: "68%",
        trend: { direction: "up", value: "+11pp YoY" },
        chartType: "stat",
        source: "Top500",
        sourceUrl: "https://www.top500.org",
        refreshFrequency: "Semi-annually",
      },
      {
        id: "ai-milestones",
        title: "Key AI Infrastructure Milestones",
        description: "Notable developments in AI compute and infrastructure.",
        chartType: "timeline",
        milestones: [
          { date: "2025 Q1", title: "1M-token context windows standard", description: "Major providers offer million-token contexts by default." },
          { date: "2024 Q4", title: "NVIDIA Blackwell ships", description: "GB200 NVL72 racks deployed at hyperscalers." },
          { date: "2024 Q3", title: "Open-source catches up", description: "Llama 3.1 405B matches GPT-4 class on key benchmarks." },
          { date: "2024 Q1", title: "Mixture of Experts goes mainstream", description: "MoE architectures adopted across major providers." },
        ],
        source: "Industry Reports",
        sourceUrl: "https://epochai.org",
        refreshFrequency: "Quarterly",
      },
    ],
  },
  {
    id: "regulation",
    title: "AI Regulation & Governance",
    description: "Policy developments, compliance frameworks, and safety standards.",
    icon: "Scale",
    gradient: "from-violet-600 to-purple-700",
    metrics: [
      {
        id: "ai-legislation",
        title: "AI Legislation Worldwide",
        description: "Countries with enacted or proposed AI regulation.",
        currentValue: "47",
        trend: { direction: "up", value: "+19 this year" },
        chartType: "stat",
        source: "Stanford HAI Index",
        sourceUrl: "https://aiindex.stanford.edu",
        refreshFrequency: "Annually",
      },
      {
        id: "ai-patents",
        title: "AI Patent Filings by Region",
        description: "Annual AI patent applications by major patent offices.",
        chartType: "bar",
        comparison: [
          { label: "China (CNIPA)", value: 62, color: "#7c3aed" },
          { label: "US (USPTO)", value: 28, color: "#8b5cf6" },
          { label: "EU (EPO)", value: 5.5, color: "#a78bfa" },
          { label: "Japan (JPO)", value: 3.2, color: "#c4b5fd" },
          { label: "Korea (KIPO)", value: 2.8, color: "#ddd6fe" },
        ],
        source: "USPTO / WIPO",
        sourceUrl: "https://www.uspto.gov/ip-policy/economic-research/research-datasets",
        refreshFrequency: "Annually",
      },
      {
        id: "regulatory-timeline",
        title: "Key Regulatory Milestones",
        description: "Major AI governance actions and their timelines.",
        chartType: "timeline",
        milestones: [
          { date: "2025 Q1", title: "US AI reporting rules take effect", description: "Large model training runs require federal notification." },
          { date: "2024 Q4", title: "EU AI Act enforcement begins", description: "Prohibited AI practices banned; high-risk timeline starts." },
          { date: "2024 Q3", title: "China deep synthesis rules expand", description: "Extended to cover all generative AI services." },
          { date: "2024 Q1", title: "UK AI Safety Institute launches", description: "First government AI safety testing body." },
        ],
        source: "Stanford HAI / OECD",
        sourceUrl: "https://oecd.ai/en/dashboards/overview",
        refreshFrequency: "Quarterly",
      },
    ],
  },
];
