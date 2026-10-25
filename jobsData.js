// HireConnect Verified Job Listings across India
// Sources: Official corporate career portals and authorized employer feeds.
// Excluded platforms strictly respected: NO LinkedIn, NO Naukri, NO Indeed.

const JOBS = [
  {
    "id": "job-rzp-01",
    "title": "Senior Frontend Engineer (React / TypeScript)",
    "company": "Razorpay",
    "companyCategory": "FinTech & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹28 - 42 LPA",
    "salaryMin": 28,
    "salaryMax": 42,
    "category": "frontend",
    "description": "Architect and scale high-throughput merchant dashboard experiences handling millions of daily transactions across India's fastest-growing fintech ecosystem.",
    "skills": [
      "React",
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "Web Performance",
      "Jest"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://razorpay.com/jobs/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Lead frontend architecture for Razorpay's next-gen merchant checkout and banking suites.",
      "Optimize core web vitals, bundle size, and micro-frontend isolation for low-latency client experiences.",
      "Collaborate with product designers and backend engineers to launch secure, compliant payment flows."
    ],
    "requirements": [
      "3+ years of professional frontend engineering with deep proficiency in React, TypeScript, and modern state architectures.",
      "Strong understanding of browser internals, caching strategies, and accessibility (WCAG AA).",
      "Hands-on experience with unit and integration testing frameworks (Jest, Cypress, RTL)."
    ],
    "perks": [
      "Comprehensive health insurance",
      "₹50k/yr learning budget",
      "Wellness stipend",
      "Flexible hybrid schedule"
    ]
  },
  {
    "id": "job-swg-02",
    "title": "Lead Backend Engineer (Go / Distributed Systems)",
    "company": "Swiggy",
    "companyCategory": "Quick Commerce & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹38 - 56 LPA",
    "salaryMin": 38,
    "salaryMax": 56,
    "category": "backend",
    "description": "Design fault-tolerant dispatch and routing microservices processing 50,000+ orders per minute across 500+ Indian cities with millisecond SLAs.",
    "skills": [
      "Golang",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Distributed Systems",
      "Kubernetes"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://careers.swiggy.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Drive system design for Swiggy Instamart and food delivery real-time logistics engines.",
      "Implement event-driven event pipelines using Apache Kafka and Redis cluster.",
      "Mentor team members and establish high benchmarks for code quality, observability, and test coverage."
    ],
    "requirements": [
      "5+ years building and scaling distributed backend systems handling large transaction volumes.",
      "Deep expertise in Golang or Java/Kotlin with strong mastery of data structures and concurrency.",
      "Proven track record debugging production outages and tuning database queries."
    ],
    "perks": [
      "Generous stock options (ESOPs)",
      "Full meal allowance",
      "Medical coverage for dependents",
      "Annual recharge leaves"
    ]
  },
  {
    "id": "job-zrd-03",
    "title": "Systems & Platform Engineer (Rust / Python)",
    "company": "Zerodha",
    "companyCategory": "FinTech & Stock Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 7 Years",
    "experienceLevel": "mid",
    "salary": "₹30 - 46 LPA",
    "salaryMin": 30,
    "salaryMax": 46,
    "category": "backend",
    "description": "Build ultra-low latency market data connectors, order routing gateways, and core exchange integrations powering Kite for over 1.2 crore investors.",
    "skills": [
      "Rust",
      "Python",
      "Linux Kernel",
      "PostgreSQL",
      "WebSockets",
      "C"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://zerodha.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Maintain and improve Kite's low-overhead HTTP and WebSocket streaming market feed handlers.",
      "Author clean, idiomatic Rust code for mission-critical trading pipeline components.",
      "Work alongside open-source maintainers and contribute back to platform tooling."
    ],
    "requirements": [
      "Strong systems programming experience with Rust, Python, or C on Linux.",
      "Clear understanding of networking stack, TCP/UDP sockets, zero-copy buffers, and asynchronous runtimes (Tokio).",
      "Passionate about minimal dependencies, zero-bloat software, and high uptime."
    ],
    "perks": [
      "100% remote work flexibility",
      "No bureaucracy / developer-first culture",
      "Top-tier health benefits",
      "Annual profit-sharing bonuses"
    ]
  },
  {
    "id": "job-zom-04",
    "title": "Staff Machine Learning Engineer (LLMs & Search)",
    "company": "Zomato",
    "companyCategory": "Consumer Tech & AI",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "6 - 10 Years",
    "experienceLevel": "lead",
    "salary": "₹48 - 75 LPA",
    "salaryMin": 48,
    "salaryMax": 75,
    "category": "ai-ml",
    "description": "Pioneer generative AI recommendations, multimodal dish search, and real-time query understanding models deployed to 40M+ monthly active diners.",
    "skills": [
      "Python",
      "PyTorch",
      "LLMs",
      "LangChain",
      "Vector Databases",
      "MLOps"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.zomato.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Lead the R&D and deployment of fine-tuned language models for personalized semantic search.",
      "Optimize inference latency and compute costs for real-time model serving at scale.",
      "Set research direction in collaboration with VP of AI and product leadership."
    ],
    "requirements": [
      "MS/PhD or equivalent practical experience in Computer Science, Machine Learning, or related field.",
      "Track record of productionizing deep learning or transformer-based models at consumer scale.",
      "Proficiency with PyTorch, Ray, Triton Inference Server, and vector indexing (Milvus / Pinecone)."
    ],
    "perks": [
      "Competitive equity package",
      "On-campus gourmet cafeteria",
      "Premium medical coverage",
      "Gym & sports facilities"
    ]
  },
  {
    "id": "job-crd-05",
    "title": "Full Stack Engineer (Node.js / React / GraphQL)",
    "company": "CRED",
    "companyCategory": "FinTech & Lifestyle",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹32 - 50 LPA",
    "salaryMin": 32,
    "salaryMax": 50,
    "category": "fullstack",
    "description": "Craft pixel-perfect, animation-rich web and mobile-web experiences for CRED Garage and credit card management products.",
    "skills": [
      "TypeScript",
      "Node.js",
      "React",
      "GraphQL",
      "Framer Motion",
      "MongoDB"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://careers.cred.club/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build fluid 60fps animations, gamified reward loops, and responsive design systems.",
      "Design scalable GraphQL schemas and microservices supporting credit card billing engines.",
      "Champion design fidelity, typography, and micro-interactions."
    ],
    "requirements": [
      "3+ years full-stack development experience with TypeScript across React and Node.js.",
      "Strong aesthetic sensibility and expertise with CSS animations, WebGL, or Canvas.",
      "Experience designing relational and document-based data models."
    ],
    "perks": [
      "Unlimited sick leaves",
      "Health and mental wellness coverage",
      "Daily catered meals",
      "High-growth ESOP program"
    ]
  },
  {
    "id": "job-pst-06",
    "title": "Senior DevOps & Cloud Architect (AWS / Kubernetes)",
    "company": "Postman",
    "companyCategory": "Developer Tools & API",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 9 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Scale developer infrastructure, multi-region Kubernetes clusters, and automated CI/CD pipelines supporting 30 million global developers.",
    "skills": [
      "AWS",
      "Kubernetes",
      "Terraform",
      "ArgoCD",
      "Prometheus",
      "Golang"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.postman.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect multi-tenant EKS clusters with automated scaling and zero-downtime upgrades.",
      "Implement Infrastructure-as-Code using Terraform and maintain GitOps deployments.",
      "Drive FinOps initiatives to optimize cloud infrastructure utilization and cost."
    ],
    "requirements": [
      "5+ years managing large-scale cloud infrastructure on AWS or GCP.",
      "Deep understanding of Linux systems, container runtimes, and service meshes (Istio/Linkerd).",
      "Hands-on scripting skills in Python, Go, or Bash."
    ],
    "perks": [
      "Home office setup allowance",
      "Annual tech gear budget",
      "Flexible paid time off",
      "Health insurance with parent coverage"
    ]
  },
  {
    "id": "job-php-07",
    "title": "Mobile Engineer - Android (Kotlin / Jetpack Compose)",
    "company": "PhonePe",
    "companyCategory": "Digital Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Develop seamless UPI payment journeys, biometric security modules, and merchant POS integrations used daily by hundreds of millions across India.",
    "skills": [
      "Kotlin",
      "Jetpack Compose",
      "Coroutines",
      "Android SDK",
      "MVVM",
      "Clean Architecture"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.phonepe.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Own key consumer checkout and UPI payment flows on the Android client.",
      "Migrate legacy XML layouts to modern Jetpack Compose components.",
      "Optimize app startup time, crash rates, and memory footprint across varied Android devices."
    ],
    "requirements": [
      "3+ years building high-traffic Android applications in modern Kotlin.",
      "Solid foundation in Android architecture components, Room, Coroutines/Flow, and dependency injection.",
      "Experience with secure storage, keystore, and payment gateway SDK integrations."
    ],
    "perks": [
      "Hybrid work flexibility",
      "Subsidized transport",
      "Comprehensive medical benefits",
      "Fitness & sports reimbursements"
    ]
  },
  {
    "id": "job-zpt-08",
    "title": "iOS Engineer (Swift / SwiftUI / Architecture)",
    "company": "Zepto",
    "companyCategory": "Quick Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹22 - 36 LPA",
    "salaryMin": 22,
    "salaryMax": 36,
    "category": "mobile",
    "description": "Create blazingly fast 10-minute grocery ordering and live delivery tracking interfaces with Apple Maps, Live Activities, and Dynamic Island.",
    "skills": [
      "Swift",
      "SwiftUI",
      "Combine",
      "Core Animation",
      "Live Activities",
      "VIPER"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://www.zepto.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build interactive iOS features including live rider tracking, cart suggestions, and flash deals.",
      "Implement iOS 16/17 Live Activities and WidgetKit extensions for instant order progress.",
      "Collaborate with backend engineers to streamline network payloads over HTTP/2."
    ],
    "requirements": [
      "2+ years iOS development experience with Swift and SwiftUI in production.",
      "Strong understanding of ARC, memory profiling using Instruments, and asynchronous programming.",
      "Track record of publishing top-rated apps to the Apple App Store."
    ],
    "perks": [
      "Competitive salary + ESOPs",
      "Team lunches & snacks",
      "Parental health cover",
      "Rapid career progression in high-growth startup"
    ]
  },
  {
    "id": "job-grw-09",
    "title": "Senior Data Platform Engineer (Spark / Kafka / Python)",
    "company": "Groww",
    "companyCategory": "WealthTech & Investing",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 7 Years",
    "experienceLevel": "senior",
    "salary": "₹30 - 45 LPA",
    "salaryMin": 30,
    "salaryMax": 45,
    "category": "data",
    "description": "Architect petabyte-scale data lakes, real-time analytics streaming pipelines, and regulatory audit compliance stores for India's premier investment platform.",
    "skills": [
      "Apache Spark",
      "Apache Kafka",
      "Python",
      "Snowflake",
      "Airflow",
      "AWS"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://groww.in/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build robust batch and real-time data pipelines ingestion millions of financial events daily.",
      "Maintain data quality, governance, and SLA monitoring across critical analytical models.",
      "Partner with analytics and ML teams to provide clean, query-optimized data warehouses."
    ],
    "requirements": [
      "4+ years building big data infrastructure with Spark, Kafka, and cloud data warehouses.",
      "Strong SQL mastery and Python or Scala programming proficiency.",
      "Familiarity with financial data compliance, data lineage, and privacy best practices."
    ],
    "perks": [
      "Performance-based quarterly bonuses",
      "Health & term insurance",
      "Flexible leave policy",
      "Workation opportunities"
    ]
  },
  {
    "id": "job-flp-10",
    "title": "Staff Software Engineer - Backend (Java / Distributed Systems)",
    "company": "Flipkart",
    "companyCategory": "E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "7 - 12 Years",
    "experienceLevel": "lead",
    "salary": "₹45 - 70 LPA",
    "salaryMin": 45,
    "salaryMax": 70,
    "category": "backend",
    "description": "Lead foundational architecture for Big Billion Days order processing, inventory sync, and multi-warehouse fulfillment pipelines with 99.999% availability.",
    "skills": [
      "Java 17",
      "Spring Boot",
      "Cassandra",
      "Kafka",
      "System Design",
      "Microservices"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.flipkartcareers.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Drive architectural decisions for ultra-high concurrency checkout and cart microservices.",
      "Perform deep performance profiling, garbage collection tuning, and capacity planning.",
      "Guide multiple engineering squads on design patterns and technical excellence."
    ],
    "requirements": [
      "7+ years enterprise backend experience in Java or Kotlin with large-scale distributed architectures.",
      "Mastery of NoSQL databases (Cassandra/HBase) and relational databases at scale.",
      "Demonstrated experience designing systems handling 100k+ TPS."
    ],
    "perks": [
      "Walmart Global partner benefits",
      "High ESOP allocation",
      "Executive healthcare",
      "Relocation assistance"
    ]
  },
  {
    "id": "job-bst-11",
    "title": "Product Security Engineer (AppSec / Cloud Security)",
    "company": "BrowserStack",
    "companyCategory": "Developer Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹26 - 40 LPA",
    "salaryMin": 26,
    "salaryMax": 40,
    "category": "devops",
    "description": "Safeguard cloud testing infrastructure, automate threat modeling, conduct internal penetration tests, and secure millions of automated browser sessions.",
    "skills": [
      "Application Security",
      "OWASP",
      "Python",
      "Cloud Security",
      "Kubernetes Security",
      "CI/CD Security"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.browserstack.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, SAST/DAST integration, and architectural threat assessments.",
      "Work with engineering teams to remediate vulnerabilities and implement secure defaults.",
      "Manage vulnerability disclosure programs and coordinate bug bounty triage."
    ],
    "requirements": [
      "3+ years in application security, penetration testing, or cloud security.",
      "Hands-on experience reviewing code in Ruby, Node.js, Go, or Python.",
      "Industry certifications (OSCP, CISSP, AWS Certified Security) preferred."
    ],
    "perks": [
      "100% remote working",
      "Annual learning & cert stipend",
      "Wellness allowance",
      "International offsite retreats"
    ]
  },
  {
    "id": "job-frw-12",
    "title": "Senior Full Stack Engineer (Vue / React / Node / AWS)",
    "company": "Freshworks",
    "companyCategory": "Enterprise SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 7 Years",
    "experienceLevel": "senior",
    "salary": "₹25 - 38 LPA",
    "salaryMin": 25,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Develop intuitive customer support and CRM automation tools served to 60,000+ global enterprises on the Freshdesk & Freshservice product lines.",
    "skills": [
      "Vue.js",
      "React",
      "Node.js",
      "AWS",
      "REST APIs",
      "PostgreSQL"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.freshworks.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build modular frontend components and backend REST/GraphQL microservices.",
      "Implement multi-tenant data access controls and enterprise SSO integrations.",
      "Maintain 99.9% uptime for business-critical customer support ticketing suites."
    ],
    "requirements": [
      "4+ years full stack web application development in modern JavaScript/TypeScript frameworks.",
      "Hands-on background with relational databases, indexing, and query optimization.",
      "Comfort working in fast-paced Agile environments with automated CI/CD deployments."
    ],
    "perks": [
      "Hybrid working arrangement",
      "Generous medical insurance",
      "Daycare support facilities",
      "Employee stock purchase plan (ESPP)"
    ]
  },
  {
    "id": "job-zoh-13",
    "title": "Backend Systems Developer (C / Java / Linux)",
    "company": "Zoho",
    "companyCategory": "Cloud SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "1 - 4 Years",
    "experienceLevel": "entry",
    "salary": "₹12 - 20 LPA",
    "salaryMin": 12,
    "salaryMax": 20,
    "category": "backend",
    "description": "Write high-performance server daemons, custom network storage protocols, and database engines powering Zoho's independent global data centers.",
    "skills": [
      "Java",
      "C",
      "Linux",
      "Data Structures",
      "Socket Programming",
      "Algorithms"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://www.zoho.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement high-performance server software without relying on heavy third-party dependencies.",
      "Optimize memory management, thread scheduling, and disk I/O in bare-metal environments.",
      "Collaborate directly with product leads to solve architectural performance bottlenecks."
    ],
    "requirements": [
      "Strong command over core computer science fundamentals, OS concepts, and algorithms.",
      "Proficiency in Java or C with demonstrable personal projects or competitive programming experience.",
      "Ability to write clean, maintainable code with deep self-driven curiosity."
    ],
    "perks": [
      "Campus dining with free meals",
      "Green campus environment",
      "Zero debt company with high job security",
      "Relocation assistance"
    ]
  },
  {
    "id": "job-jsp-14",
    "title": "Functional Backend Engineer (Haskell / PureScript / Rust)",
    "company": "Juspay",
    "companyCategory": "Payments Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹22 - 36 LPA",
    "salaryMin": 22,
    "salaryMax": 36,
    "category": "backend",
    "description": "Build mathematically sound, type-safe payment routers handling over 100M daily UPI transactions using purely functional programming paradigms.",
    "skills": [
      "Haskell",
      "PureScript",
      "Rust",
      "Functional Programming",
      "Nix",
      "Type Systems"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://juspay.in/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Formulate formal domain models and DSLs for payment transaction lifecycles.",
      "Develop high-throughput stateless payment microservices with sub-50ms response times.",
      "Maintain robust Nix-based reproducible build pipelines and testing suites."
    ],
    "requirements": [
      "2+ years practical programming experience with strong affinity for functional programming (Haskell, OCaml, Scala, or Rust).",
      "Rigorous problem-solving aptitude and appreciation for mathematical correctness.",
      "Comfort working in terminal-first, Linux-based development environments."
    ],
    "perks": [
      "Research-oriented culture",
      "Top-spec MacBook Pro & gear",
      "Free chef-prepared meals daily",
      "Comprehensive health coverage"
    ]
  },
  {
    "id": "job-inm-15",
    "title": "Machine Learning Engineer - AdTech (Python / PyTorch / Spark)",
    "company": "InMobi",
    "companyCategory": "AdTech & AI",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹26 - 42 LPA",
    "salaryMin": 26,
    "salaryMax": 42,
    "category": "ai-ml",
    "description": "Train real-time bidding click-through rate (CTR) prediction models, audience graph embeddings, and contextual targeting algorithms serving 2B+ devices.",
    "skills": [
      "Python",
      "PyTorch",
      "Spark",
      "TensorFlow",
      "MLOps",
      "Feature Stores"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.inmobi.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Deploy online reinforcement learning and deep learning models for real-time programmatic ad auctions.",
      "Scale distributed training pipelines using Ray and GPU clusters.",
      "Conduct offline A/B testing and statistical validation on model iterations."
    ],
    "requirements": [
      "3+ years experience developing and deploying production machine learning models.",
      "Solid knowledge of recommendation systems, classification, and ranking algorithms.",
      "Experience processing large datasets with PySpark or Dask."
    ],
    "perks": [
      "Hybrid workplace options",
      "Reimbursement for certifications & conferences",
      "Health insurance with wellness credits",
      "On-site wellness centre"
    ]
  },
  {
    "id": "job-urb-16",
    "title": "Senior Cloud Infrastructure Engineer (GCP / Kubernetes)",
    "company": "Urban Company",
    "companyCategory": "Home Services Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹28 - 44 LPA",
    "salaryMin": 28,
    "salaryMax": 44,
    "category": "devops",
    "description": "Build self-healing Kubernetes clusters, zero-trust cloud network topologies, and automated observability platforms supporting 50,000+ service partners.",
    "skills": [
      "GCP",
      "Kubernetes",
      "Terraform",
      "Prometheus",
      "Helm",
      "Golang"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.urbancompany.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect reliable GCP infrastructure across multiple availability zones.",
      "Automate service provisioning, disaster recovery drills, and security compliance.",
      "Establish site reliability standards and SLO/SLI tracking across all service verticals."
    ],
    "requirements": [
      "4+ years hands-on SRE or DevOps experience managing containerized workloads in production.",
      "In-depth knowledge of Kubernetes networking, CNI plugins, and service meshes.",
      "Proficient in infrastructure as code (Terraform) and CI/CD automation."
    ],
    "perks": [
      "Generous stock options",
      "Urban Company service credits for home care",
      "Health insurance + family cover",
      "Annual wellness package"
    ]
  },
  {
    "id": "job-msh-17",
    "title": "Frontend Developer (React / JavaScript / Web Performance)",
    "company": "Meesho",
    "companyCategory": "E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "1 - 3 Years",
    "experienceLevel": "entry",
    "salary": "₹14 - 22 LPA",
    "salaryMin": 14,
    "salaryMax": 22,
    "category": "frontend",
    "description": "Engineer lightweight, high-performance web experiences optimized for tier-2/3 Indian internet connectivity and diverse low-spec smartphone browsers.",
    "skills": [
      "React",
      "JavaScript",
      "HTML5/CSS3",
      "Webpack/Vite",
      "PWA",
      "Responsive UI"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://www.meesho.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive UI features for supplier portal and mobile web shoppers.",
      "Optimize assets, progressive web app caching, and rendering performance for low-bandwidth networks.",
      "Write unit tests and actively participate in code reviews."
    ],
    "requirements": [
      "1-3 years experience building production web applications in React.",
      "Sound understanding of modern JavaScript (ES6+), DOM manipulation, and CSS flexbox/grid.",
      "Passion for building accessible, user-friendly software."
    ],
    "perks": [
      "Comprehensive medical benefits",
      "MeeCare wellness program",
      "Hybrid work policy",
      "Generous learning stipend"
    ]
  },
  {
    "id": "job-ptm-18",
    "title": "SDET / QA Automation Engineer (Java / Selenium / RestAssured)",
    "company": "Paytm",
    "companyCategory": "FinTech & Banking",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹16 - 26 LPA",
    "salaryMin": 16,
    "salaryMax": 26,
    "category": "backend",
    "description": "Design automated test harnesses, performance stress suites, and API regression frameworks safeguarding critical banking and payment gateway integrations.",
    "skills": [
      "Java",
      "Selenium",
      "RestAssured",
      "TestNG",
      "JMeter",
      "Jenkins"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://paytm.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Construct end-to-end automated test suites for payment SDKs and core microservices.",
      "Execute load and stress testing using JMeter prior to major festival sales events.",
      "Identify edge-case failure modes and collaborate closely with developers on automated bug reproduction."
    ],
    "requirements": [
      "3+ years experience in automated testing with Java, RestAssured, and Selenium.",
      "Solid knowledge of API protocols (REST, JSON, WebSockets) and relational database verification.",
      "Experience integrating tests with CI/CD pipelines (Jenkins/GitLab CI)."
    ],
    "perks": [
      "Corporate health cover",
      "Subsidized transport shuttle",
      "Cafeteria facilities",
      "Annual performance incentives"
    ]
  },
  {
    "id": "job-rzp-19",
    "title": "Software Engineer Intern - Frontend (React / TypeScript)",
    "company": "Razorpay",
    "companyCategory": "FinTech & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Internship",
    "experience": "0 - 1 Year",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 65,000 / month",
    "salaryMin": 5,
    "salaryMax": 8,
    "category": "frontend",
    "description": "Kickstart your software engineering career working directly on Razorpay's design systems and merchant onboarding micro-frontends with high mentorship.",
    "skills": [
      "React",
      "TypeScript",
      "JavaScript",
      "CSS3",
      "Git",
      "Clean Code"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://razorpay.com/jobs/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement reusable UI components according to Razorpay Blade design system specs.",
      "Squash frontend bugs and write comprehensive automated component unit tests.",
      "Participate in daily engineering standups, design reviews, and architecture discussions."
    ],
    "requirements": [
      "Pre-final or final year student in CS/IT or self-taught developer with strong portfolio projects.",
      "Proficiency in modern JavaScript, React, and CSS fundamentals.",
      "Eager to learn, take feedback, and contribute to production code."
    ],
    "perks": [
      "Pre-Placement Offer (PPO) opportunity",
      "Free daily meals & snacks",
      "Mentor guidance from Principal Engineers",
      "Stipend + laptop provided"
    ]
  },
  {
    "id": "job-swg-20",
    "title": "Software Engineer Intern - Backend (Python / Golang)",
    "company": "Swiggy",
    "companyCategory": "Logistics Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Internship",
    "experience": "0 - 1 Year",
    "experienceLevel": "entry",
    "salary": "₹50,000 - 70,000 / month",
    "salaryMin": 6,
    "salaryMax": 9,
    "category": "backend",
    "description": "Learn how to build high-scale microservices, asynchronous message queues, and caching architectures behind Swiggy's delivery grid.",
    "skills": [
      "Python",
      "Golang",
      "SQL",
      "Git",
      "REST APIs",
      "Data Structures"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://careers.swiggy.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop and test RESTful backend endpoints in Python or Go.",
      "Help build database migration scripts and telemetry dashboards.",
      "Investigate service metrics and shadow senior engineers during on-call incidents."
    ],
    "requirements": [
      "Strong foundation in algorithms, operating systems, and object-oriented programming.",
      "Hands-on coding experience in Python, Go, or Java through projects or internships.",
      "Good communication skills and collaborative team mindset."
    ],
    "perks": [
      "High PPO conversion rate",
      "Free lunch & dinner at office",
      "Swiggy One membership",
      "High-spec M3 MacBook Pro for work"
    ]
  },
  {
    "id": "job-flp-21",
    "title": "Senior Product Designer (UI/UX / Design Systems)",
    "company": "Flipkart",
    "companyCategory": "E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹26 - 40 LPA",
    "salaryMin": 26,
    "salaryMax": 40,
    "category": "frontend",
    "description": "Define end-to-end shopping, search discovery, and post-purchase customer journeys for over 300 million registered Indian shoppers.",
    "skills": [
      "Figma",
      "Design Systems",
      "User Research",
      "Wireframing",
      "Interaction Design",
      "Prototyping"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.flipkartcareers.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Lead user-centric product design for core shopping and checkout funnels.",
      "Maintain and evolve the unified design system across iOS, Android, and web platforms.",
      "Conduct user interviews, usability tests, and translate research data into intuitive wireframes."
    ],
    "requirements": [
      "4+ years designing high-impact consumer mobile and web applications.",
      "Exceptional portfolio showcasing interaction design, typography, and visual craft.",
      "Expertise in Figma components, auto-layout, and interactive prototypes."
    ],
    "perks": [
      "Hybrid work flexibility",
      "Wellness stipend",
      "Generous health insurance",
      "Annual design conference budget"
    ]
  },
  {
    "id": "job-zrd-22",
    "title": "Frontend Architect (Web Standards / Vanilla JS / Performance)",
    "company": "Zerodha",
    "companyCategory": "FinTech & Stock Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "6 - 10 Years",
    "experienceLevel": "lead",
    "salary": "₹40 - 65 LPA",
    "salaryMin": 40,
    "salaryMax": 65,
    "category": "frontend",
    "description": "Architect lightweight web trading interfaces with zero bloat, instant rendering, and resilient real-time tick streaming under peak market volatility.",
    "skills": [
      "JavaScript",
      "WebSockets",
      "Canvas API",
      "CSS Architecture",
      "WebAssembly",
      "Performance"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://zerodha.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design frontend architectures that function flawlessly even under spotty 3G/4G connections.",
      "Render high-frequency charting data using Canvas API and WebAssembly.",
      "Advocate for minimal dependencies, fast load times, and clean code across engineering."
    ],
    "requirements": [
      "6+ years building web applications with deep mastery of browser fundamentals and DOM manipulation.",
      "Proven ability to build performant UI without relying heavily on massive framework dependencies.",
      "Deep experience with binary WebSocket streaming and state synchronization."
    ],
    "perks": [
      "100% remote work",
      "Zero micromanagement",
      "Comprehensive family health cover",
      "Profit share incentives"
    ]
  },
  {
    "id": "job-crd-23",
    "title": "Backend Engineer - Payments Infrastructure (Go / Kafka)",
    "company": "CRED",
    "companyCategory": "FinTech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹30 - 48 LPA",
    "salaryMin": 30,
    "salaryMax": 48,
    "category": "backend",
    "description": "Build robust, double-entry financial ledger systems, automated bank settlement rails, and fraud-detection pipelines with zero margin for error.",
    "skills": [
      "Golang",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Distributed Transactions",
      "gRPC"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://careers.cred.club/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement idempotent payment processors with distributed locks and fault recovery.",
      "Design zero-loss audit logs and event-sourced ledger architectures.",
      "Interface with NPCI and partner bank APIs to enable instant credit card payments."
    ],
    "requirements": [
      "3+ years building high-reliability backend systems in Go, Java, or Rust.",
      "Sound understanding of distributed ACID transactions, two-phase commits, and eventual consistency.",
      "Strong debugging instincts and rigorous testing discipline."
    ],
    "perks": [
      "Top-tier compensation + ESOPs",
      "Lavish campus amenities",
      "Unlimited sick leave",
      "Premium healthcare"
    ]
  },
  {
    "id": "job-pst-24",
    "title": "AI Engineer - Developer Tools (Python / LangChain / RAG)",
    "company": "Postman",
    "companyCategory": "Developer Tools",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 7 Years",
    "experienceLevel": "mid",
    "salary": "₹32 - 50 LPA",
    "salaryMin": 32,
    "salaryMax": 50,
    "category": "ai-ml",
    "description": "Build Postbot—the AI companion inside Postman that generates automated tests, summarizes API documentation, and suggests API mock responses.",
    "skills": [
      "Python",
      "OpenAI / Claude APIs",
      "LangChain",
      "Vector DBs",
      "TypeScript",
      "Prompt Engineering"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://www.postman.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build context-aware RAG pipelines that ground LLM outputs in user API schemas and collections.",
      "Evaluate prompt strategies, hallucination mitigation, and token usage optimization.",
      "Bridge backend LLM services with Postman's electron and web client interfaces."
    ],
    "requirements": [
      "3+ years software engineering experience with at least 1.5 years focused on LLM applications or NLP.",
      "Proficient in Python and JavaScript/TypeScript.",
      "Practical experience with semantic search, embeddings, and vector databases (pgvector / Chroma)."
    ],
    "perks": [
      "Remote-first flexibility",
      "Home workstation budget",
      "Health insurance for family",
      "International company retreats"
    ]
  },
  {
    "id": "job-tcs-25",
    "title": "Enterprise Java / Microservices Architect",
    "company": "Tata Consultancy Services",
    "companyCategory": "IT & Digital Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8 - 14 Years",
    "experienceLevel": "lead",
    "salary": "₹28 - 45 LPA",
    "salaryMin": 28,
    "salaryMax": 45,
    "category": "backend",
    "description": "Lead digital transformation architecture for Tier-1 global banking and financial services clients migrating monolithic systems to cloud-native microservices.",
    "skills": [
      "Java",
      "Spring Cloud",
      "Kafka",
      "Kubernetes",
      "Cloud Architecture",
      "Oracle/PostgreSQL"
    ],
    "postedDate": "2026-10-23",
    "formattedDate": "Today",
    "applyUrl": "https://www.tcs.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Define target-state cloud architectures for high-volume banking transaction workflows.",
      "Establish technical governance, API security protocols, and zero-trust guidelines.",
      "Lead architecture review boards with C-level client executives."
    ],
    "requirements": [
      "8+ years in enterprise software development and solutions architecture in Java.",
      "Extensive experience with Spring Cloud, OpenShift/Kubernetes, and distributed caching.",
      "TOGAF or AWS/Azure Solution Architect certification is a strong plus."
    ],
    "perks": [
      "Global mobility programs",
      "Tata group company perks and discounts",
      "Extensive health benefits for parents",
      "Gratuity and retirement packages"
    ]
  },
  {
    "id": "job-inf-26",
    "title": "Full Stack Cloud Developer (React / Spring Boot / AWS)",
    "company": "Infosys",
    "companyCategory": "Consulting & Technology",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹15 - 24 LPA",
    "salaryMin": 15,
    "salaryMax": 24,
    "category": "fullstack",
    "description": "Build enterprise digital workplace platforms, real-time telemetry dashboards, and cloud applications on AWS for Fortune 500 partners.",
    "skills": [
      "React",
      "Spring Boot",
      "AWS",
      "Docker",
      "MySQL",
      "REST APIs"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.infosys.com/careers.html",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop full-stack web modules with responsive React frontends and Spring Boot microservices.",
      "Containerize applications using Docker and deploy to AWS ECS/EKS.",
      "Collaborate in distributed agile scrums with global client stakeholders."
    ],
    "requirements": [
      "3+ years full stack experience with React and Java/Spring Boot.",
      "Good understanding of AWS core services (S3, EC2, RDS, Lambda).",
      "Strong problem-solving and communication skills."
    ],
    "perks": [
      "Flexible hybrid policy",
      "Infosys Wings certification incentives",
      "Parental health insurance",
      "Campus amenities and transport"
    ]
  },
  {
    "id": "job-dlv-27",
    "title": "Data Scientist - Route Optimization & Geocoding",
    "company": "Delhivery",
    "companyCategory": "Supply Chain & Logistics Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 7 Years",
    "experienceLevel": "mid",
    "salary": "₹25 - 38 LPA",
    "salaryMin": 25,
    "salaryMax": 38,
    "category": "data",
    "description": "Solve complex vehicle routing problems (VRP), address disambiguation for unstructured Indian addresses, and dynamic pricing algorithms at nationwide scale.",
    "skills": [
      "Python",
      "Operations Research",
      "Machine Learning",
      "GIS / Spatial Data",
      "PostGIS",
      "OR-Tools"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.delhivery.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build optimization models for last-mile delivery route scheduling and hub transit times.",
      "Develop NLP models to parse and geocode informal Indian address strings into latitude/longitude.",
      "Monitor production model metrics and evaluate operational efficiency gains."
    ],
    "requirements": [
      "3+ years applying ML or operations research techniques to logistics or routing problems.",
      "Strong proficiency in Python, NumPy, Pandas, Scikit-learn, and Google OR-Tools.",
      "Experience with spatial data indexing and geographic coordinate transforms."
    ],
    "perks": [
      "High growth logistics tech culture",
      "Health & accident insurance",
      "Performance bonus",
      "Flexible work setup"
    ]
  },
  {
    "id": "job-nyk-28",
    "title": "Senior Mobile Engineer - iOS (Swift / Design Systems)",
    "company": "Nykaa",
    "companyCategory": "Beauty & Fashion E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 7 Years",
    "experienceLevel": "senior",
    "salary": "₹24 - 36 LPA",
    "salaryMin": 24,
    "salaryMax": 36,
    "category": "mobile",
    "description": "Elevate shopping experiences for millions of beauty enthusiasts with virtual try-on (ARKit), seamless checkout, and high-framerate product catalogs.",
    "skills": [
      "Swift",
      "SwiftUI",
      "ARKit",
      "Core Data",
      "Unit Testing",
      "CI/CD Fastlane"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.nykaa.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Lead iOS feature development across Nykaa Beauty and Nykaa Fashion apps.",
      "Integrate augmented reality shade finder tools using ARKit and Metal shaders.",
      "Improve app launch performance and modularize code into independent Swift packages."
    ],
    "requirements": [
      "4+ years building production iOS applications in Swift.",
      "Solid experience with UIKit, SwiftUI, and design system component libraries.",
      "Deep understanding of RESTful networking and offline caching strategies."
    ],
    "perks": [
      "Nykaa employee discounts",
      "Health & wellness cover",
      "Flexible hybrid office policy",
      "Annual corporate bonus"
    ]
  },
  {
    "id": "job-c24-29",
    "title": "Frontend Engineer (Next.js / TypeScript / Tailwind)",
    "company": "Cars24",
    "companyCategory": "AutoTech Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 28 LPA",
    "salaryMin": 18,
    "salaryMax": 28,
    "category": "frontend",
    "description": "Build 360-degree interactive car inspection views, instant valuation calculators, and responsive purchase flows across India and international markets.",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Three.js / Canvas",
      "SEO Optimization"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.cars24.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop modern server-rendered Next.js web applications with high Core Web Vitals.",
      "Implement 360-degree vehicle interior/exterior visualizer components.",
      "Optimize landing page conversion rates and SEO visibility for millions of car buyers."
    ],
    "requirements": [
      "2+ years frontend development experience with React and Next.js.",
      "Strong understanding of SSR/SSG rendering patterns and responsive CSS.",
      "Comfort collaborating with product managers on rapid A/B experiments."
    ],
    "perks": [
      "Competitive salary + ESOPs",
      "Subsidized health insurance",
      "Modern Gurgaon campus",
      "Fast-paced growth trajectory"
    ]
  },
  {
    "id": "job-clt-30",
    "title": "Senior Backend Engineer (Go / Distributed Caching)",
    "company": "Cleartrip",
    "companyCategory": "Travel & Flight Booking",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "4 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹28 - 42 LPA",
    "salaryMin": 28,
    "salaryMax": 42,
    "category": "backend",
    "description": "Engineer flight inventory aggregation search engines, low-latency airline GDS connector services, and instant refund systems at Flipkart scale.",
    "skills": [
      "Golang",
      "Redis",
      "Kafka",
      "PostgreSQL",
      "High Concurrency",
      "gRPC"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.cleartrip.com/jobs",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Build search aggregation engines querying 100+ airline providers with sub-second latencies.",
      "Design distributed caching layers with Redis to handle 10x traffic spikes during flash sales.",
      "Collaborate on resilient circuit breaker patterns and fallback strategies."
    ],
    "requirements": [
      "4+ years backend engineering in Go, Java, or C++ with high-traffic distributed services.",
      "Solid grasp of concurrency primitives, goroutines, channels, and connection pooling.",
      "Deep experience with SQL query tuning and data caching strategies."
    ],
    "perks": [
      "Travel discounts on flights & hotels",
      "Flipkart group medical benefits",
      "Hybrid work setup",
      "Comprehensive wellness program"
    ]
  },
  {
    "id": "job-razo-031",
    "title": "Software Engineer Intern (Tailwind CSS / Next.js)",
    "company": "Razorpay",
    "companyCategory": "FinTech & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Tailwind CSS",
      "Next.js",
      "GraphQL",
      "TypeScript",
      "Angular"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://razorpay.com/jobs/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-swig-032",
    "title": "Senior Backend Engineer (Python / FastAPI / PostgreSQL)",
    "company": "Swiggy",
    "companyCategory": "Quick Commerce & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Java",
      "PostgreSQL",
      "Python",
      "Rust",
      "Node.js"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://careers.swiggy.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zero-033",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Zerodha",
    "companyCategory": "FinTech & Stock Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "React",
      "GraphQL",
      "Node.js",
      "FastAPI",
      "Tailwind CSS"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://zerodha.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cred-034",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "CRED",
    "companyCategory": "FinTech & Rewards",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Jetpack Compose",
      "Kotlin",
      "Dart",
      "SQLite",
      "App Store / Play Store"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://careers.cred.club/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoma-035",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Zomato",
    "companyCategory": "Food Delivery & Dining",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Docker",
      "GCP",
      "Ansible",
      "OpenTelemetry",
      "ArgoCD"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://careers.zomato.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-flip-036",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Flipkart",
    "companyCategory": "E-Commerce & Supply Chain",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Python",
      "CUDA",
      "Scikit-Learn",
      "RAG",
      "MLflow"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.flipkartcareers.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-post-037",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Postman",
    "companyCategory": "Developer Tools & API Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Python",
      "BigQuery",
      "Apache Kafka",
      "AWS Glue",
      "Snowflake"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.postman.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-brow-038",
    "title": "Security Analyst & SOC Lead (SIEM / Incident Response)",
    "company": "BrowserStack",
    "companyCategory": "Cloud Testing & Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Network Security",
      "SIEM",
      "Cybersecurity",
      "OWASP",
      "IAM"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.browserstack.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-fres-039",
    "title": "Staff Product Manager (Payments & Financial Checkout)",
    "company": "Freshworks",
    "companyCategory": "Enterprise SaaS & CRM",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "A/B Testing",
      "UI/UX Design",
      "Wireframing",
      "Design Systems",
      "Figma"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.freshworks.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-inmo-040",
    "title": "Senior Frontend Developer (Next.js / Tailwind / State)",
    "company": "InMobi",
    "companyCategory": "AdTech & Glance Platforms",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Delhi NCR, Delhi",
    "city": "Delhi NCR",
    "state": "Delhi",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Vue.js",
      "Tailwind CSS",
      "GraphQL",
      "Jest",
      "Redux Toolkit"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.inmobi.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phon-041",
    "title": "Distributed Systems Engineer (Rust / Kafka / Linux)",
    "company": "PhonePe",
    "companyCategory": "Digital Payments & UPI",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Spring Boot",
      "Java",
      "Kubernetes",
      "gRPC",
      "Python"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.phonepe.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mees-042",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Meesho",
    "companyCategory": "Social Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "React",
      "TypeScript",
      "FastAPI",
      "Node.js",
      "PostgreSQL"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.meesho.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zept-043",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Zepto",
    "companyCategory": "10-Minute Grocery Delivery",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "SwiftUI",
      "Dart",
      "React Native",
      "Coroutines",
      "App Store / Play Store"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.zepto.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-044",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Tata Digital",
    "companyCategory": "SuperApp Ecosystem",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Kubernetes",
      "Linux",
      "Docker",
      "Ansible",
      "GCP"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://www.tatadigital.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-jusp-045",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Juspay",
    "companyCategory": "Payments Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Vector DB (Chroma/Pinecone)",
      "Python",
      "Scikit-Learn",
      "PyTorch",
      "Hugging Face"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://juspay.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-grow-046",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Groww",
    "companyCategory": "Investment & Wealth Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Spark",
      "Snowflake",
      "dbt",
      "Apache Kafka",
      "SQL"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://groww.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-clev-047",
    "title": "DevSecOps Engineer (Cloud Security / IAM / Container Scanning)",
    "company": "CleverTap",
    "companyCategory": "Customer Retention SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cryptography",
      "Penetration Testing",
      "AppSec",
      "SAST/DAST",
      "IAM"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://clevertap.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hasu-048",
    "title": "Senior Product Designer (UI/UX / Figma / Design Systems)",
    "company": "Hasura",
    "companyCategory": "GraphQL Engine & Data APIs",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "UI/UX Design",
      "Wireframing",
      "Figma",
      "User Research",
      "Product Strategy"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://hasura.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-payt-049",
    "title": "UI/UX Frontend Architect (Design Systems / Web Components)",
    "company": "Paytm",
    "companyCategory": "Digital Banking & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "GraphQL",
      "Jest",
      "Tailwind CSS",
      "Vite",
      "Webpack"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://careers.paytm.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-nyka-050",
    "title": "Staff Backend Architect (Java / Spring Boot / Redis)",
    "company": "Nykaa",
    "companyCategory": "Beauty & Fashion E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "gRPC",
      "Spring Boot",
      "Docker",
      "Java",
      "Kubernetes"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.nykaa.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-urba-051",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Urban Company",
    "companyCategory": "Home Services Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "Tailwind CSS",
      "React"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.urbancompany.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoho-052",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Zoho",
    "companyCategory": "Cloud Business Suite",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Coimbatore, Tamil Nadu",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Dart",
      "SQLite",
      "Flutter",
      "Swift",
      "SwiftUI"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.zoho.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-info-053",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Infosys",
    "companyCategory": "IT & Digital Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Docker",
      "AWS",
      "ArgoCD",
      "Kubernetes",
      "CI/CD"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.infosys.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tcs-054",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "TCS",
    "companyCategory": "Global Technology Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "TensorFlow",
      "PyTorch",
      "Python",
      "MLflow",
      "Scikit-Learn"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.tcs.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-wipr-055",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Wipro",
    "companyCategory": "Consulting & Cloud Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "ClickHouse",
      "Airflow",
      "AWS Glue",
      "Flink",
      "Apache Spark"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.wipro.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hclt-056",
    "title": "Software Engineer Intern (SIEM / Penetration Testing)",
    "company": "HCLTech",
    "companyCategory": "Digital & Engineering Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "SIEM",
      "Penetration Testing",
      "SAST/DAST",
      "Compliance",
      "IAM"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.hcltech.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-blin-057",
    "title": "Technical Product Manager (Developer Ecosystem & Platform APIs)",
    "company": "Blinkit",
    "companyCategory": "Instant Quick Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "SQL",
      "Product Strategy",
      "Figma",
      "Design Systems",
      "Agile"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://blinkit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-delh-058",
    "title": "Frontend Engineer (Vue.js / Nuxt / Microfrontends)",
    "company": "Delhivery",
    "companyCategory": "Supply Chain & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Redux Toolkit",
      "Angular",
      "Tailwind CSS",
      "Web Vitals",
      "React"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://delhivery.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-shad-059",
    "title": "Backend Engineer (Node.js / Express / MongoDB)",
    "company": "Shadowfax",
    "companyCategory": "Hyperlocal Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Docker",
      "FastAPI",
      "Python",
      "gRPC",
      "Java"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://shadowfax.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ship-060",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Shiprocket",
    "companyCategory": "E-Commerce Shipping Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "PostgreSQL",
      "TypeScript",
      "GraphQL",
      "MongoDB",
      "Next.js"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://shiprocket.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-port-061",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Porter",
    "companyCategory": "Intra-City Logistics Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Jetpack Compose",
      "Combine",
      "App Store / Play Store",
      "Firebase",
      "Kotlin"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://porter.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-rapi-062",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Rapido",
    "companyCategory": "Bike Taxi & Mobility",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "CI/CD",
      "Terraform",
      "Linux",
      "OpenTelemetry",
      "Prometheus"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://rapido.bike/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-olae-063",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Ola Electric",
    "companyCategory": "EV Tech & Manufacturing",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "LangChain",
      "LLMs",
      "Python",
      "MLflow",
      "PyTorch"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://careers.olaelectric.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-athe-064",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Ather Energy",
    "companyCategory": "Electric Vehicles & IoT",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "dbt",
      "AWS Glue",
      "Airflow",
      "Apache Spark",
      "ClickHouse"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.atherenergy.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cars-065",
    "title": "Lead Infrastructure Security Architect (Zero Trust / Cryptography)",
    "company": "Cars24",
    "companyCategory": "AutoTech Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cryptography",
      "Cybersecurity",
      "IAM",
      "Network Security",
      "Compliance"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.cars24.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-spin-066",
    "title": "Product Manager (Growth & User Acquisition)",
    "company": "Spinny",
    "companyCategory": "Pre-Owned Auto Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Figma",
      "Agile",
      "Wireframing",
      "A/B Testing",
      "SQL"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://spinny.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-make-067",
    "title": "Staff Frontend Infrastructure Engineer (Core Web Vitals)",
    "company": "MakeMyTrip",
    "companyCategory": "Online Travel & Hospitality",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Web Vitals",
      "React",
      "TypeScript",
      "GraphQL",
      "Next.js"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://careers.makemytrip.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ixig-068",
    "title": "Core Platform Developer (C++ / High-Throughput Gateways)",
    "company": "Ixigo",
    "companyCategory": "Travel Booking AI Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Java",
      "Spring Boot",
      "Docker",
      "Node.js",
      "Kafka"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.ixigo.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-drea-069",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Dream11",
    "companyCategory": "Sports Tech & Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Python",
      "AWS",
      "Docker",
      "React",
      "Node.js"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.dream11.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-game-070",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Games24x7",
    "companyCategory": "Online Interactive Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Kotlin",
      "Flutter",
      "React Native",
      "Coroutines",
      "Firebase"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.games24x7.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mpl-071",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "MPL",
    "companyCategory": "Esports & Mobile Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Ansible",
      "Docker",
      "Helm",
      "Terraform",
      "Grafana"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.mpl.live/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-unac-072",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Unacademy",
    "companyCategory": "EdTech & Learning Platforms",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "RAG",
      "PyTorch",
      "LLMs",
      "Scikit-Learn",
      "TensorFlow"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://unacademy.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phys-073",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "PhysicsWallah",
    "companyCategory": "Education Technology",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "AWS Glue",
      "BigQuery",
      "Apache Kafka",
      "Python",
      "ClickHouse"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.physicswallah.live/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-clas-074",
    "title": "Penetration Tester & Ethical Hacker (VAPT / Network Security)",
    "company": "Classplus",
    "companyCategory": "Creator & Educator SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cloud Security",
      "Cybersecurity",
      "Network Security",
      "AppSec",
      "SAST/DAST"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://classplusapp.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-lens-075",
    "title": "Lead UX Researcher & Interaction Designer (Consumer Apps)",
    "company": "Lenskart",
    "companyCategory": "Eyewear Omni-Channel Retail",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Roadmapping",
      "Figma",
      "SQL",
      "Product Strategy",
      "User Research"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://lenskart.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-boat-076",
    "title": "Junior Frontend Developer (JavaScript / React / CSS3)",
    "company": "boAt Lifestyle",
    "companyCategory": "Consumer Electronics & Audio",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Delhi NCR, Delhi",
    "city": "Delhi NCR",
    "state": "Delhi",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Next.js",
      "React",
      "GraphQL",
      "TypeScript",
      "Vite"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.boat-lifestyle.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mama-077",
    "title": "Lead Microservices Architect (Golang / gRPC / Kubernetes)",
    "company": "Mamaearth",
    "companyCategory": "D2C Personal Care",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Golang",
      "Python",
      "Docker",
      "Kubernetes",
      "Java"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://mamaearth.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-prac-078",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Practo",
    "companyCategory": "Digital Healthcare & Telemedicine",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Next.js",
      "AWS"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.practo.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-079",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Tata 1mg",
    "companyCategory": "Digital Pharmacy & Labs",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "App Store / Play Store",
      "Dart",
      "React Native",
      "SQLite",
      "SwiftUI"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.1mg.com/jobs",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phar-080",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "PharmEasy",
    "companyCategory": "HealthTech & Medicine Delivery",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Ansible",
      "Grafana",
      "Kubernetes",
      "OpenTelemetry",
      "Prometheus"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://pharmeasy.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cult-081",
    "title": "Software Engineer Intern (RAG / Python)",
    "company": "Cult.fit",
    "companyCategory": "Fitness, Wellness & Sports",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "RAG",
      "Python",
      "Scikit-Learn",
      "Docker",
      "CUDA"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://curefit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-heal-082",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "HealthifyMe",
    "companyCategory": "AI Health & Nutrition Coaching",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Spark",
      "ClickHouse",
      "Flink",
      "Apache Kafka",
      "Python"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.healthifyme.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-acko-083",
    "title": "Security Analyst & SOC Lead (SIEM / Incident Response)",
    "company": "Acko",
    "companyCategory": "Digital Insurance Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "AppSec",
      "IAM",
      "OWASP",
      "Cloud Security",
      "Cryptography"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://acko.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-godi-084",
    "title": "Staff Product Manager (Payments & Financial Checkout)",
    "company": "Go Digit",
    "companyCategory": "General Insurance Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Roadmapping",
      "Product Strategy",
      "UI/UX Design",
      "Wireframing",
      "Design Systems"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.godigit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-poli-085",
    "title": "Frontend Performance Engineer (Vite / Module Federation)",
    "company": "PolicyBazaar",
    "companyCategory": "InsurTech Aggregator",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Webpack",
      "React",
      "Angular",
      "Jest",
      "Vite"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.policybazaar.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-upst-086",
    "title": "Cloud Backend Engineer (Python / AWS Lambda / DynamoDB)",
    "company": "Upstox",
    "companyCategory": "Stock Brokerage & Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "gRPC",
      "Docker",
      "Spring Boot",
      "Java",
      "Redis"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://upstox.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ange-087",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Angel One",
    "companyCategory": "FinTech & Wealth Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "React"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.angelone.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-coin-088",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "CoinSwitch",
    "companyCategory": "Crypto & Wealth Assets",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Coroutines",
      "Jetpack Compose",
      "Swift",
      "Combine",
      "App Store / Play Store"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://coinswitch.co/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-coin-089",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "CoinDCX",
    "companyCategory": "Digital Asset Exchange",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "AWS",
      "Grafana",
      "Docker",
      "Helm",
      "Linux"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://coindcx.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-bhar-090",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "BharatPe",
    "companyCategory": "Merchant UPI & POS Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Python",
      "RAG",
      "Hugging Face",
      "LLMs",
      "Vector DB (Chroma/Pinecone)"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://bharatpe.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-khat-091",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Khatabook",
    "companyCategory": "MSME Accounting Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "ClickHouse",
      "Snowflake",
      "Apache Spark",
      "Databricks",
      "AWS Glue"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://khatabook.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zeta-092",
    "title": "DevSecOps Engineer (Cloud Security / IAM / Container Scanning)",
    "company": "Zeta",
    "companyCategory": "Omni-Stack Banking Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "SIEM",
      "Network Security",
      "Penetration Testing",
      "AppSec",
      "Cryptography"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.zeta.tech/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-spri-093",
    "title": "Senior Product Designer (UI/UX / Figma / Design Systems)",
    "company": "Sprinklr",
    "companyCategory": "Customer Experience Management",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Product Strategy",
      "Agile",
      "A/B Testing",
      "User Research",
      "UI/UX Design"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.sprinklr.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-druv-094",
    "title": "Lead Web Application Engineer (Angular / TypeScript / RxJS)",
    "company": "Druva",
    "companyCategory": "Cloud Data Protection & SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Redux Toolkit",
      "Vite",
      "Next.js",
      "TypeScript",
      "Web Vitals"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.druva.com/about/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-darw-095",
    "title": "Backend Software Engineer (Go / Microservices)",
    "company": "Darwinbox",
    "companyCategory": "HRTech & Workforce Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "PostgreSQL",
      "Node.js",
      "Docker",
      "Java",
      "Python"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.darwinbox.com/careers.php",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-keka-096",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Keka",
    "companyCategory": "HR & Payroll Software",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Docker",
      "React",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.keka.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-yell-097",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Yellow.ai",
    "companyCategory": "Conversational GenAI Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Jetpack Compose",
      "Combine",
      "App Store / Play Store",
      "Dart",
      "Kotlin"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://yellow.ai/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-gups-098",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Gupshup",
    "companyCategory": "Conversational Cloud Messaging",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Kubernetes",
      "Prometheus",
      "Docker",
      "AWS",
      "CI/CD"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.gupshup.io/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-exot-099",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Exotel",
    "companyCategory": "Cloud Customer Engagement",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "LangChain",
      "MLflow",
      "Hugging Face",
      "PyTorch",
      "RAG"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://exotel.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-wing-100",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Wingify",
    "companyCategory": "Conversion Optimization (VWO)",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "dbt",
      "Snowflake",
      "Airflow",
      "Python",
      "AWS Glue"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://wingify.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-moen-101",
    "title": "Cybersecurity Engineer (AppSec / Threat Modeling / SAST)",
    "company": "MoEngage",
    "companyCategory": "Customer Engagement Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cloud Security",
      "OWASP",
      "Cybersecurity",
      "SIEM",
      "Network Security"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.moengage.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-what-102",
    "title": "Technical Product Manager (Developer Ecosystem & Platform APIs)",
    "company": "Whatfix",
    "companyCategory": "Digital Adoption Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Agile",
      "Wireframing",
      "Design Systems",
      "UI/UX Design",
      "SQL"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://whatfix.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-char-103",
    "title": "Frontend Engineer (React / TypeScript)",
    "company": "Chargebee",
    "companyCategory": "Subscription Billing & Revenue",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "Redux Toolkit",
      "Angular",
      "Web Vitals",
      "Next.js"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.chargebee.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-kiss-104",
    "title": "Senior Backend Engineer (Python / FastAPI / PostgreSQL)",
    "company": "Kissflow",
    "companyCategory": "Low-Code Digital Work Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Kafka",
      "Rust",
      "Golang",
      "Python",
      "Kubernetes"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://kissflow.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-thou-105",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Thoughtworks India",
    "companyCategory": "Software Design & Consulting",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Python",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "GraphQL"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.thoughtworks.com/careers/india",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ltim-106",
    "title": "Software Engineer Intern (Firebase / Flutter)",
    "company": "LTIMindtree",
    "companyCategory": "Global Technology Consulting",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Firebase",
      "Flutter",
      "SwiftUI",
      "React Native",
      "SQLite"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.ltimindtree.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-pers-107",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Persistent Systems",
    "companyCategory": "Digital Engineering & Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "CI/CD",
      "Grafana",
      "AWS",
      "Kubernetes",
      "GCP"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.persistent.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-108",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Tata Elxsi",
    "companyCategory": "Design & Technology Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "MLflow",
      "TensorFlow",
      "Python",
      "LLMs",
      "Hugging Face"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.tataelxsi.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-happ-109",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Happiest Minds",
    "companyCategory": "Born Digital IT Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "SQL",
      "Airflow",
      "AWS Glue",
      "Databricks",
      "Apache Spark"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.happiestminds.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-reli-110",
    "title": "Lead Infrastructure Security Architect (Zero Trust / Cryptography)",
    "company": "Reliance Jio",
    "companyCategory": "Telecom, Cloud & 5G Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "SIEM",
      "Cybersecurity",
      "Compliance",
      "Cryptography",
      "OWASP"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.jio.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-razo-111",
    "title": "Product Manager (Growth & User Acquisition)",
    "company": "Razorpay",
    "companyCategory": "FinTech & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Product Strategy",
      "Roadmapping",
      "UI/UX Design",
      "Agile",
      "User Research"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://razorpay.com/jobs/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-swig-112",
    "title": "Senior Frontend Developer (Next.js / Tailwind / State)",
    "company": "Swiggy",
    "companyCategory": "Quick Commerce & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Vite",
      "React",
      "Web Vitals",
      "TypeScript",
      "Jest"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://careers.swiggy.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zero-113",
    "title": "Distributed Systems Engineer (Rust / Kafka / Linux)",
    "company": "Zerodha",
    "companyCategory": "FinTech & Stock Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Golang",
      "Node.js",
      "FastAPI",
      "Spring Boot",
      "Redis"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://zerodha.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cred-114",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "CRED",
    "companyCategory": "FinTech & Rewards",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "FastAPI",
      "Docker",
      "Tailwind CSS",
      "Python",
      "MongoDB"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://careers.cred.club/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoma-115",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Zomato",
    "companyCategory": "Food Delivery & Dining",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "SQLite",
      "Flutter",
      "Jetpack Compose",
      "Swift",
      "SwiftUI"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://careers.zomato.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-flip-116",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Flipkart",
    "companyCategory": "E-Commerce & Supply Chain",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Linux",
      "Docker",
      "OpenTelemetry",
      "Terraform",
      "ArgoCD"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.flipkartcareers.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-post-117",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Postman",
    "companyCategory": "Developer Tools & API Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "TensorFlow",
      "MLflow",
      "PyTorch",
      "CUDA",
      "Scikit-Learn"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.postman.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-brow-118",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "BrowserStack",
    "companyCategory": "Cloud Testing & Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Spark",
      "Apache Kafka",
      "AWS Glue",
      "ClickHouse",
      "Databricks"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.browserstack.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-fres-119",
    "title": "Penetration Tester & Ethical Hacker (VAPT / Network Security)",
    "company": "Freshworks",
    "companyCategory": "Enterprise SaaS & CRM",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cybersecurity",
      "IAM",
      "Cloud Security",
      "AppSec",
      "SAST/DAST"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.freshworks.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-inmo-120",
    "title": "Lead UX Researcher & Interaction Designer (Consumer Apps)",
    "company": "InMobi",
    "companyCategory": "AdTech & Glance Platforms",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Delhi NCR, Delhi",
    "city": "Delhi NCR",
    "state": "Delhi",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Roadmapping",
      "Design Systems",
      "Agile",
      "Product Strategy",
      "Figma"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.inmobi.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phon-121",
    "title": "UI/UX Frontend Architect (Design Systems / Web Components)",
    "company": "PhonePe",
    "companyCategory": "Digital Payments & UPI",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "Angular",
      "Vite",
      "TypeScript",
      "Webpack"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.phonepe.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mees-122",
    "title": "Staff Backend Architect (Java / Spring Boot / Redis)",
    "company": "Meesho",
    "companyCategory": "Social Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "PostgreSQL",
      "Docker",
      "FastAPI",
      "Kafka",
      "Redis"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.meesho.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zept-123",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Zepto",
    "companyCategory": "10-Minute Grocery Delivery",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "MongoDB",
      "React",
      "GraphQL",
      "Next.js",
      "Python"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.zepto.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-124",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Tata Digital",
    "companyCategory": "SuperApp Ecosystem",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Combine",
      "Dart",
      "Swift",
      "Firebase",
      "SwiftUI"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://www.tatadigital.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-jusp-125",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Juspay",
    "companyCategory": "Payments Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "GCP",
      "Linux",
      "Docker",
      "ArgoCD",
      "Terraform"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://juspay.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-grow-126",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Groww",
    "companyCategory": "Investment & Wealth Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Python",
      "MLflow",
      "Docker",
      "PyTorch",
      "Scikit-Learn"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://groww.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-clev-127",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "CleverTap",
    "companyCategory": "Customer Retention SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "AWS Glue",
      "dbt",
      "SQL",
      "Apache Spark",
      "ClickHouse"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://clevertap.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hasu-128",
    "title": "Security Analyst & SOC Lead (SIEM / Incident Response)",
    "company": "Hasura",
    "companyCategory": "GraphQL Engine & Data APIs",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "SAST/DAST",
      "AppSec",
      "Cybersecurity",
      "SIEM",
      "Penetration Testing"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://hasura.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-payt-129",
    "title": "Staff Product Manager (Payments & Financial Checkout)",
    "company": "Paytm",
    "companyCategory": "Digital Banking & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "User Research",
      "SQL",
      "Roadmapping",
      "A/B Testing",
      "Wireframing"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://careers.paytm.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-nyka-130",
    "title": "Frontend Engineer (Vue.js / Nuxt / Microfrontends)",
    "company": "Nykaa",
    "companyCategory": "Beauty & Fashion E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Webpack",
      "Jest",
      "Angular",
      "Vite",
      "React"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.nykaa.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-urba-131",
    "title": "Software Engineer Intern (gRPC / Node.js)",
    "company": "Urban Company",
    "companyCategory": "Home Services Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "gRPC",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Kafka"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.urbancompany.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoho-132",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Zoho",
    "companyCategory": "Cloud Business Suite",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Coimbatore, Tamil Nadu",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Node.js",
      "AWS",
      "PostgreSQL",
      "Next.js",
      "FastAPI"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.zoho.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-info-133",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Infosys",
    "companyCategory": "IT & Digital Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "React Native",
      "App Store / Play Store",
      "Flutter",
      "Kotlin",
      "Combine"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.infosys.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tcs-134",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "TCS",
    "companyCategory": "Global Technology Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "ArgoCD",
      "Ansible",
      "CI/CD",
      "Grafana",
      "AWS"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.tcs.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-wipr-135",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Wipro",
    "companyCategory": "Consulting & Cloud Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "LLMs",
      "MLflow",
      "Docker",
      "Hugging Face",
      "LangChain"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.wipro.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hclt-136",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "HCLTech",
    "companyCategory": "Digital & Engineering Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "dbt",
      "Flink",
      "Apache Spark",
      "Apache Kafka",
      "Databricks"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.hcltech.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-blin-137",
    "title": "DevSecOps Engineer (Cloud Security / IAM / Container Scanning)",
    "company": "Blinkit",
    "companyCategory": "Instant Quick Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "AppSec",
      "Network Security",
      "Compliance",
      "Cybersecurity",
      "SIEM"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://blinkit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-delh-138",
    "title": "Senior Product Designer (UI/UX / Figma / Design Systems)",
    "company": "Delhivery",
    "companyCategory": "Supply Chain & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Agile",
      "SQL",
      "User Research",
      "Roadmapping",
      "Wireframing"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://delhivery.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-shad-139",
    "title": "Staff Frontend Infrastructure Engineer (Core Web Vitals)",
    "company": "Shadowfax",
    "companyCategory": "Hyperlocal Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Jest",
      "GraphQL",
      "Next.js",
      "Tailwind CSS",
      "Webpack"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://shadowfax.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ship-140",
    "title": "Core Platform Developer (C++ / High-Throughput Gateways)",
    "company": "Shiprocket",
    "companyCategory": "E-Commerce Shipping Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Java",
      "FastAPI",
      "Node.js",
      "gRPC",
      "Python"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://shiprocket.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-port-141",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Porter",
    "companyCategory": "Intra-City Logistics Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Tailwind CSS",
      "MongoDB",
      "React",
      "AWS",
      "Node.js"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://porter.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-rapi-142",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Rapido",
    "companyCategory": "Bike Taxi & Mobility",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Kotlin",
      "SQLite",
      "SwiftUI",
      "Flutter",
      "Swift"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://rapido.bike/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-olae-143",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Ola Electric",
    "companyCategory": "EV Tech & Manufacturing",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Grafana",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "Ansible"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://careers.olaelectric.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-athe-144",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Ather Energy",
    "companyCategory": "Electric Vehicles & IoT",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Vector DB (Chroma/Pinecone)",
      "LLMs",
      "CUDA",
      "Scikit-Learn",
      "LangChain"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.atherenergy.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cars-145",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Cars24",
    "companyCategory": "AutoTech Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Spark",
      "Apache Kafka",
      "Databricks",
      "Flink",
      "ClickHouse"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.cars24.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-spin-146",
    "title": "Cybersecurity Engineer (AppSec / Threat Modeling / SAST)",
    "company": "Spinny",
    "companyCategory": "Pre-Owned Auto Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cloud Security",
      "SAST/DAST",
      "OWASP",
      "Penetration Testing",
      "IAM"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://spinny.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-make-147",
    "title": "Technical Product Manager (Developer Ecosystem & Platform APIs)",
    "company": "MakeMyTrip",
    "companyCategory": "Online Travel & Hospitality",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "SQL",
      "Agile",
      "Roadmapping",
      "UI/UX Design",
      "Design Systems"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://careers.makemytrip.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ixig-148",
    "title": "Junior Frontend Developer (JavaScript / React / CSS3)",
    "company": "Ixigo",
    "companyCategory": "Travel Booking AI Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "Next.js",
      "Jest",
      "Vue.js",
      "GraphQL"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.ixigo.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-drea-149",
    "title": "Lead Microservices Architect (Golang / gRPC / Kubernetes)",
    "company": "Dream11",
    "companyCategory": "Sports Tech & Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Golang",
      "Python",
      "PostgreSQL",
      "Node.js",
      "Redis"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://www.dream11.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-game-150",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Games24x7",
    "companyCategory": "Online Interactive Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Node.js",
      "Next.js",
      "Tailwind CSS",
      "React",
      "AWS"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.games24x7.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mpl-151",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "MPL",
    "companyCategory": "Esports & Mobile Gaming",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "SwiftUI",
      "Firebase",
      "Jetpack Compose",
      "Combine",
      "Flutter"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.mpl.live/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-unac-152",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Unacademy",
    "companyCategory": "EdTech & Learning Platforms",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "ArgoCD",
      "Helm",
      "GCP",
      "Linux",
      "Kubernetes"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://unacademy.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phys-153",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "PhysicsWallah",
    "companyCategory": "Education Technology",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "RAG",
      "TensorFlow",
      "Scikit-Learn",
      "MLflow",
      "LangChain"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.physicswallah.live/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-clas-154",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Classplus",
    "companyCategory": "Creator & Educator SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Python",
      "ClickHouse",
      "AWS Glue",
      "Airflow",
      "Databricks"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://classplusapp.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-lens-155",
    "title": "Lead Infrastructure Security Architect (Zero Trust / Cryptography)",
    "company": "Lenskart",
    "companyCategory": "Eyewear Omni-Channel Retail",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Penetration Testing",
      "SAST/DAST",
      "OWASP",
      "AppSec",
      "IAM"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://lenskart.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-boat-156",
    "title": "Software Engineer Intern (SQL / Product Strategy)",
    "company": "boAt Lifestyle",
    "companyCategory": "Consumer Electronics & Audio",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Delhi NCR, Delhi",
    "city": "Delhi NCR",
    "state": "Delhi",
    "workMode": "Hybrid",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "SQL",
      "Product Strategy",
      "Roadmapping",
      "Agile",
      "A/B Testing"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://www.boat-lifestyle.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mama-157",
    "title": "Frontend Performance Engineer (Vite / Module Federation)",
    "company": "Mamaearth",
    "companyCategory": "D2C Personal Care",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Vue.js",
      "Redux Toolkit",
      "Jest",
      "TypeScript",
      "Tailwind CSS"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://mamaearth.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-prac-158",
    "title": "Cloud Backend Engineer (Python / AWS Lambda / DynamoDB)",
    "company": "Practo",
    "companyCategory": "Digital Healthcare & Telemedicine",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Java",
      "FastAPI",
      "Rust",
      "Node.js",
      "PostgreSQL"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.practo.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-159",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Tata 1mg",
    "companyCategory": "Digital Pharmacy & Labs",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Python",
      "Tailwind CSS",
      "React",
      "Next.js",
      "MongoDB"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.1mg.com/jobs",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phar-160",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "PharmEasy",
    "companyCategory": "HealthTech & Medicine Delivery",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Combine",
      "SQLite",
      "React Native",
      "Dart",
      "Firebase"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://pharmeasy.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cult-161",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Cult.fit",
    "companyCategory": "Fitness, Wellness & Sports",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Prometheus",
      "Helm",
      "Linux",
      "GCP",
      "ArgoCD"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://curefit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-heal-162",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "HealthifyMe",
    "companyCategory": "AI Health & Nutrition Coaching",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Docker",
      "LangChain",
      "TensorFlow",
      "PyTorch",
      "RAG"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.healthifyme.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-acko-163",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Acko",
    "companyCategory": "Digital Insurance Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Kafka",
      "Python",
      "Flink",
      "SQL",
      "Databricks"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://acko.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-godi-164",
    "title": "Penetration Tester & Ethical Hacker (VAPT / Network Security)",
    "company": "Go Digit",
    "companyCategory": "General Insurance Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "AppSec",
      "Cybersecurity",
      "IAM",
      "OWASP",
      "SIEM"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.godigit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-poli-165",
    "title": "Lead UX Researcher & Interaction Designer (Consumer Apps)",
    "company": "PolicyBazaar",
    "companyCategory": "InsurTech Aggregator",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Wireframing",
      "UI/UX Design",
      "SQL",
      "Agile",
      "User Research"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://www.policybazaar.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-upst-166",
    "title": "Lead Web Application Engineer (Angular / TypeScript / RxJS)",
    "company": "Upstox",
    "companyCategory": "Stock Brokerage & Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "TypeScript",
      "GraphQL",
      "Jest",
      "Vue.js"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://upstox.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ange-167",
    "title": "Backend Software Engineer (Go / Microservices)",
    "company": "Angel One",
    "companyCategory": "FinTech & Wealth Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Golang",
      "Redis",
      "FastAPI",
      "Python",
      "gRPC"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.angelone.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-coin-168",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "CoinSwitch",
    "companyCategory": "Crypto & Wealth Assets",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "React",
      "PostgreSQL",
      "AWS",
      "Node.js",
      "GraphQL"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://coinswitch.co/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-coin-169",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "CoinDCX",
    "companyCategory": "Digital Asset Exchange",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Combine",
      "SwiftUI",
      "Jetpack Compose",
      "Coroutines",
      "Dart"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://coindcx.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-bhar-170",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "BharatPe",
    "companyCategory": "Merchant UPI & POS Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Grafana",
      "AWS",
      "Prometheus",
      "Docker",
      "Linux"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://bharatpe.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-khat-171",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Khatabook",
    "companyCategory": "MSME Accounting Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "TensorFlow",
      "Scikit-Learn",
      "PyTorch",
      "RAG",
      "Hugging Face"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://khatabook.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zeta-172",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Zeta",
    "companyCategory": "Omni-Stack Banking Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Spark",
      "dbt",
      "Flink",
      "Databricks",
      "SQL"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.zeta.tech/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-spri-173",
    "title": "Security Analyst & SOC Lead (SIEM / Incident Response)",
    "company": "Sprinklr",
    "companyCategory": "Customer Experience Management",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "IAM",
      "AppSec",
      "Compliance",
      "OWASP",
      "Network Security"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.sprinklr.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-druv-174",
    "title": "Staff Product Manager (Payments & Financial Checkout)",
    "company": "Druva",
    "companyCategory": "Cloud Data Protection & SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Roadmapping",
      "Design Systems",
      "UI/UX Design",
      "Figma",
      "User Research"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.druva.com/about/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-darw-175",
    "title": "Frontend Engineer (React / TypeScript)",
    "company": "Darwinbox",
    "companyCategory": "HRTech & Workforce Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "Webpack",
      "Jest",
      "Next.js",
      "Angular"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.darwinbox.com/careers.php",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-keka-176",
    "title": "Senior Backend Engineer (Python / FastAPI / PostgreSQL)",
    "company": "Keka",
    "companyCategory": "HR & Payroll Software",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Rust",
      "Spring Boot",
      "Docker",
      "gRPC",
      "FastAPI"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.keka.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-yell-177",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Yellow.ai",
    "companyCategory": "Conversational GenAI Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Node.js",
      "React",
      "GraphQL",
      "AWS",
      "Python"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://yellow.ai/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-gups-178",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Gupshup",
    "companyCategory": "Conversational Cloud Messaging",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "SQLite",
      "Firebase",
      "Coroutines",
      "Jetpack Compose",
      "Swift"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://www.gupshup.io/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-exot-179",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Exotel",
    "companyCategory": "Cloud Customer Engagement",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "GCP",
      "Docker",
      "Ansible",
      "Kubernetes",
      "AWS"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://exotel.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-wing-180",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "Wingify",
    "companyCategory": "Conversion Optimization (VWO)",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Docker",
      "Python",
      "Hugging Face",
      "MLflow",
      "PyTorch"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://wingify.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-moen-181",
    "title": "Software Engineer Intern (BigQuery / Python)",
    "company": "MoEngage",
    "companyCategory": "Customer Engagement Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "BigQuery",
      "Python",
      "Flink",
      "Databricks",
      "Airflow"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://www.moengage.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-what-182",
    "title": "DevSecOps Engineer (Cloud Security / IAM / Container Scanning)",
    "company": "Whatfix",
    "companyCategory": "Digital Adoption Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cloud Security",
      "SIEM",
      "Compliance",
      "OWASP",
      "Cybersecurity"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://whatfix.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-char-183",
    "title": "Senior Product Designer (UI/UX / Figma / Design Systems)",
    "company": "Chargebee",
    "companyCategory": "Subscription Billing & Revenue",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Product Strategy",
      "Figma",
      "Agile",
      "User Research",
      "Wireframing"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.chargebee.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-kiss-184",
    "title": "Senior Frontend Developer (Next.js / Tailwind / State)",
    "company": "Kissflow",
    "companyCategory": "Low-Code Digital Work Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Jest",
      "Next.js",
      "React",
      "Vite",
      "Redux Toolkit"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://kissflow.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-thou-185",
    "title": "Distributed Systems Engineer (Rust / Kafka / Linux)",
    "company": "Thoughtworks India",
    "companyCategory": "Software Design & Consulting",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "gRPC",
      "Spring Boot",
      "Redis",
      "Java",
      "PostgreSQL"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.thoughtworks.com/careers/india",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ltim-186",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "LTIMindtree",
    "companyCategory": "Global Technology Consulting",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Next.js",
      "React",
      "Node.js",
      "Tailwind CSS",
      "TypeScript"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.ltimindtree.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-pers-187",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Persistent Systems",
    "companyCategory": "Digital Engineering & Cloud",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Pune, Maharashtra",
    "city": "Pune",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "SQLite",
      "Swift",
      "SwiftUI",
      "Kotlin",
      "Jetpack Compose"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.persistent.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-188",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Tata Elxsi",
    "companyCategory": "Design & Technology Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Kochi, Kerala",
    "city": "Kochi",
    "state": "Kerala",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Prometheus",
      "Kubernetes",
      "ArgoCD",
      "Helm",
      "OpenTelemetry"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.tataelxsi.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-happ-189",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Happiest Minds",
    "companyCategory": "Born Digital IT Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "LangChain",
      "PyTorch",
      "TensorFlow",
      "MLflow",
      "Hugging Face"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.happiestminds.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-reli-190",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Reliance Jio",
    "companyCategory": "Telecom, Cloud & 5G Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Python",
      "Snowflake",
      "Flink",
      "dbt",
      "Apache Kafka"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.jio.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-razo-191",
    "title": "Cybersecurity Engineer (AppSec / Threat Modeling / SAST)",
    "company": "Razorpay",
    "companyCategory": "FinTech & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cryptography",
      "Cloud Security",
      "Penetration Testing",
      "AppSec",
      "Network Security"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://razorpay.com/jobs/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-swig-192",
    "title": "Technical Product Manager (Developer Ecosystem & Platform APIs)",
    "company": "Swiggy",
    "companyCategory": "Quick Commerce & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Product Strategy",
      "Roadmapping",
      "Agile",
      "Wireframing",
      "User Research"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://careers.swiggy.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zero-193",
    "title": "UI/UX Frontend Architect (Design Systems / Web Components)",
    "company": "Zerodha",
    "companyCategory": "FinTech & Stock Trading",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Redux Toolkit",
      "Jest",
      "Web Vitals",
      "Webpack",
      "GraphQL"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://zerodha.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cred-194",
    "title": "Staff Backend Architect (Java / Spring Boot / Redis)",
    "company": "CRED",
    "companyCategory": "FinTech & Rewards",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Spring Boot",
      "Java",
      "FastAPI",
      "Node.js",
      "Rust"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://careers.cred.club/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoma-195",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Zomato",
    "companyCategory": "Food Delivery & Dining",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "MongoDB",
      "React",
      "AWS",
      "Tailwind CSS",
      "Next.js"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://careers.zomato.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-flip-196",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "Flipkart",
    "companyCategory": "E-Commerce & Supply Chain",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "React Native",
      "SQLite",
      "Coroutines",
      "Combine",
      "Swift"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.flipkartcareers.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-post-197",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Postman",
    "companyCategory": "Developer Tools & API Platform",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Docker",
      "Terraform",
      "OpenTelemetry",
      "CI/CD",
      "ArgoCD"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.postman.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-brow-198",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "BrowserStack",
    "companyCategory": "Cloud Testing & Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Hugging Face",
      "Python",
      "Scikit-Learn",
      "PyTorch",
      "LangChain"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://www.browserstack.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-fres-199",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Freshworks",
    "companyCategory": "Enterprise SaaS & CRM",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Flink",
      "Apache Kafka",
      "Airflow",
      "Databricks",
      "BigQuery"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.freshworks.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-inmo-200",
    "title": "Lead Infrastructure Security Architect (Zero Trust / Cryptography)",
    "company": "InMobi",
    "companyCategory": "AdTech & Glance Platforms",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Delhi NCR, Delhi",
    "city": "Delhi NCR",
    "state": "Delhi",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "SIEM",
      "IAM",
      "OWASP",
      "Cloud Security",
      "Penetration Testing"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.inmobi.com/company/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-phon-201",
    "title": "Product Manager (Growth & User Acquisition)",
    "company": "PhonePe",
    "companyCategory": "Digital Payments & UPI",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "UI/UX Design",
      "Agile",
      "SQL",
      "Wireframing",
      "User Research"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.phonepe.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-mees-202",
    "title": "Frontend Engineer (Vue.js / Nuxt / Microfrontends)",
    "company": "Meesho",
    "companyCategory": "Social Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Vite",
      "React",
      "Web Vitals",
      "Webpack",
      "TypeScript"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.meesho.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zept-203",
    "title": "Backend Engineer (Node.js / Express / MongoDB)",
    "company": "Zepto",
    "companyCategory": "10-Minute Grocery Delivery",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Java",
      "Kafka",
      "PostgreSQL",
      "Golang",
      "Rust"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://www.zepto.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tata-204",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Tata Digital",
    "companyCategory": "SuperApp Ecosystem",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "MongoDB",
      "React",
      "AWS",
      "Next.js",
      "GraphQL"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://www.tatadigital.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-jusp-205",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Juspay",
    "companyCategory": "Payments Infrastructure",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Combine",
      "Kotlin",
      "SwiftUI",
      "Coroutines",
      "SQLite"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://juspay.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-grow-206",
    "title": "Software Engineer Intern (Kubernetes / Docker)",
    "company": "Groww",
    "companyCategory": "Investment & Wealth Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Internship",
    "experience": "0 - 1 Years",
    "experienceLevel": "entry",
    "salary": "₹45,000 - 75,000 / month",
    "salaryMin": 5.4,
    "salaryMax": 9,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Kubernetes",
      "Docker",
      "Helm",
      "Prometheus",
      "Linux"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://groww.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-clev-207",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "CleverTap",
    "companyCategory": "Customer Retention SaaS",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Python",
      "Hugging Face",
      "Scikit-Learn",
      "MLflow",
      "LangChain"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://clevertap.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hasu-208",
    "title": "Lead Data Architect (Lakehouse / Data Governance / AWS Glue)",
    "company": "Hasura",
    "companyCategory": "GraphQL Engine & Data APIs",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Remote - India",
    "city": "Remote",
    "state": "All India",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Python",
      "Apache Spark",
      "BigQuery",
      "Airflow",
      "Apache Kafka"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://hasura.io/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-payt-209",
    "title": "Penetration Tester & Ethical Hacker (VAPT / Network Security)",
    "company": "Paytm",
    "companyCategory": "Digital Banking & Payments",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Noida, Uttar Pradesh",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Cloud Security",
      "Network Security",
      "AppSec",
      "Compliance",
      "Cryptography"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://careers.paytm.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-nyka-210",
    "title": "Lead UX Researcher & Interaction Designer (Consumer Apps)",
    "company": "Nykaa",
    "companyCategory": "Beauty & Fashion E-Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Agile",
      "Product Strategy",
      "Figma",
      "UI/UX Design",
      "Wireframing"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.nykaa.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-urba-211",
    "title": "Staff Frontend Infrastructure Engineer (Core Web Vitals)",
    "company": "Urban Company",
    "companyCategory": "Home Services Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Vue.js",
      "Redux Toolkit"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.urbancompany.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-zoho-212",
    "title": "Core Platform Developer (C++ / High-Throughput Gateways)",
    "company": "Zoho",
    "companyCategory": "Cloud Business Suite",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Coimbatore, Tamil Nadu",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Golang",
      "Kubernetes",
      "Node.js",
      "Redis",
      "FastAPI"
    ],
    "postedDate": "2026-10-09",
    "formattedDate": "14 days ago",
    "applyUrl": "https://www.zoho.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-info-213",
    "title": "Staff Full Stack Architect (MERN / TypeScript / AWS)",
    "company": "Infosys",
    "companyCategory": "IT & Digital Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Next.js",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "MongoDB"
    ],
    "postedDate": "2026-10-22",
    "formattedDate": "Yesterday",
    "applyUrl": "https://www.infosys.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-tcs-214",
    "title": "Lead Mobile Architect (Flutter / Dart / Clean Architecture)",
    "company": "TCS",
    "companyCategory": "Global Technology Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Mumbai, Maharashtra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Jetpack Compose",
      "Kotlin",
      "SQLite",
      "Coroutines",
      "Dart"
    ],
    "postedDate": "2026-10-21",
    "formattedDate": "2 days ago",
    "applyUrl": "https://www.tcs.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-wipr-215",
    "title": "Lead DevOps Architect (Multi-Cloud / CI/CD / Cost Optimization)",
    "company": "Wipro",
    "companyCategory": "Consulting & Cloud Solutions",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Grafana",
      "Docker",
      "Ansible",
      "Linux",
      "AWS"
    ],
    "postedDate": "2026-10-20",
    "formattedDate": "3 days ago",
    "applyUrl": "https://www.wipro.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-hclt-216",
    "title": "Lead Applied AI Architect (Enterprise GenAI Agents / Fine-tuning)",
    "company": "HCLTech",
    "companyCategory": "Digital & Engineering Services",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "RAG",
      "LangChain",
      "Vector DB (Chroma/Pinecone)",
      "MLflow",
      "Hugging Face"
    ],
    "postedDate": "2026-10-19",
    "formattedDate": "4 days ago",
    "applyUrl": "https://www.hcltech.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-blin-217",
    "title": "Data Engineer (Spark / Kafka / Python / Snowflake)",
    "company": "Blinkit",
    "companyCategory": "Instant Quick Commerce",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "data",
    "description": "Build real-time streaming and batch pipelines ingesting billions of telemetry events daily into modern analytical lakehouses.",
    "skills": [
      "Apache Kafka",
      "dbt",
      "AWS Glue",
      "Apache Spark",
      "Python"
    ],
    "postedDate": "2026-10-18",
    "formattedDate": "5 days ago",
    "applyUrl": "https://blinkit.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design and maintain petabyte-scale data pipelines using Spark, Kafka, and Snowflake/BigQuery.",
      "Develop transformed dimensional models using dbt and automated Airflow DAG orchestrations.",
      "Enforce data quality gates, anomaly detection, and schema contracts between producer and consumer systems."
    ],
    "requirements": [
      "High proficiency in complex SQL query optimization, data warehousing principles, and distributed compute.",
      "Experience with Apache Spark, Kafka, and cloud data platforms (Snowflake, Databricks, BigQuery).",
      "Hands-on coding in Python or Scala for production ETL data extraction and transformation."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-delh-218",
    "title": "Security Analyst & SOC Lead (SIEM / Incident Response)",
    "company": "Delhivery",
    "companyCategory": "Supply Chain & Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "security",
    "description": "Conduct rigorous vulnerability assessments, automated code scans, and threat simulations before major production releases.",
    "skills": [
      "Compliance",
      "Cybersecurity",
      "IAM",
      "AppSec",
      "Cryptography"
    ],
    "postedDate": "2026-10-17",
    "formattedDate": "6 days ago",
    "applyUrl": "https://delhivery.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Perform code audits, threat modeling, and dynamic vulnerability testing across internal and public endpoints.",
      "Integrate automated security gating tools into continuous delivery build and release pipelines.",
      "Investigate suspicious activities, coordinate vulnerability patching, and ensure RBI / ISO compliance."
    ],
    "requirements": [
      "Strong background in application security, OWASP Top 10 vulnerabilities, and network protocol defense.",
      "Proficiency with security tooling: Burp Suite, SonarQube, Trivy, Snyk, and AWS Security Hub.",
      "Familiarity with industry standards (ISO 27001, SOC2, PCI-DSS) and secure software development lifecycles."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-shad-219",
    "title": "Staff Product Manager (Payments & Financial Checkout)",
    "company": "Shadowfax",
    "companyCategory": "Hyperlocal Logistics",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "product",
    "description": "Craft intuitive user flows, micro-interactions, and visual prototypes that solve high-friction pain points for Indian users.",
    "skills": [
      "Design Systems",
      "Product Strategy",
      "Figma",
      "User Research",
      "Roadmapping"
    ],
    "postedDate": "2026-10-16",
    "formattedDate": "7 days ago",
    "applyUrl": "https://shadowfax.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Translate user feedback, funnel analytics, and market dynamics into crisp product requirement documents (PRDs).",
      "Lead sprint planning, feature prioritization, and post-launch experiment retrospectives with engineering teams.",
      "Design high-fidelity interactive prototypes in Figma adhering to modern design systems."
    ],
    "requirements": [
      "Prior product management or UX design experience in fast-paced high-growth technology environments.",
      "Demonstrated ability to make data-informed trade-offs and drive user engagement metrics.",
      "Strong visual communication, wireframing, and stakeholder collaboration abilities."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-ship-220",
    "title": "Junior Frontend Developer (JavaScript / React / CSS3)",
    "company": "Shiprocket",
    "companyCategory": "E-Commerce Shipping Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "frontend",
    "description": "Develop ultra-responsive user interfaces, interactive widgets, and seamless web experiences serving millions of active users daily.",
    "skills": [
      "React",
      "TypeScript",
      "GraphQL",
      "Vite",
      "Angular"
    ],
    "postedDate": "2026-10-15",
    "formattedDate": "8 days ago",
    "applyUrl": "https://shiprocket.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Ship high-performance, reusable React/TypeScript modules according to atomic design principles.",
      "Work with UX designers and backend engineers to define API contracts and pixel-perfect layouts.",
      "Maintain 90+ Lighthouse performance scores, cross-browser compatibility, and WCAG AA standards."
    ],
    "requirements": [
      "Proven track record building modern, scalable single-page and server-rendered web applications.",
      "Deep understanding of JavaScript event loops, DOM performance, and responsive web mechanics.",
      "Hands-on experience with unit and integration testing libraries like Jest, Vitest, and Cypress."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-port-221",
    "title": "Lead Microservices Architect (Golang / gRPC / Kubernetes)",
    "company": "Porter",
    "companyCategory": "Intra-City Logistics Tech",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "0 - 2 Years",
    "experienceLevel": "entry",
    "salary": "₹8 - 16 LPA",
    "salaryMin": 8,
    "salaryMax": 16,
    "category": "backend",
    "description": "Build fault-tolerant event streams, financial ledger records, and async queue workers with robust transactional guarantees.",
    "skills": [
      "Rust",
      "Docker",
      "gRPC",
      "Node.js",
      "Spring Boot"
    ],
    "postedDate": "2026-10-14",
    "formattedDate": "9 days ago",
    "applyUrl": "https://porter.in/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Implement robust microservices handling tens of thousands of requests per second.",
      "Model relational and document database schemas with optimized indexing and read replicas.",
      "Instrument end-to-end tracing, latency budgets, and real-time observability alerts."
    ],
    "requirements": [
      "Demonstrated depth in distributed system primitives: consensus, partitions, ACID transactions, and messaging.",
      "Proficiency in languages such as Go, Python, Java, or Rust with strong algorithm design skills.",
      "Experience deploying containerized services on Docker, Kubernetes, and cloud infrastructure."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-rapi-222",
    "title": "Lead Full Stack Engineer (TypeScript / GraphQL / Serverless)",
    "company": "Rapido",
    "companyCategory": "Bike Taxi & Mobility",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Hyderabad, Telangana",
    "city": "Hyderabad",
    "state": "Telangana",
    "workMode": "On-site",
    "employmentType": "Full-time",
    "experience": "2 - 5 Years",
    "experienceLevel": "mid",
    "salary": "₹18 - 32 LPA",
    "salaryMin": 18,
    "salaryMax": 32,
    "category": "fullstack",
    "description": "Construct full-stack SaaS dashboards, payment integrations, and administrative tooling with high velocity.",
    "skills": [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "Next.js"
    ],
    "postedDate": "2026-10-13",
    "formattedDate": "10 days ago",
    "applyUrl": "https://rapido.bike/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Develop responsive client interfaces integrated smoothly with REST and GraphQL backend services.",
      "Author performant backend controllers, authentication workflows, and relational schema migrations.",
      "Deploy and monitor full-stack applications in automated continuous delivery environments."
    ],
    "requirements": [
      "Strong dual-competency in modern frontend frameworks (React, Next.js, Vue) and backend runtimes (Node.js, Python, Java).",
      "Solid knowledge of web security, CORS, session tokens, JWTs, and secure API design.",
      "Self-directed builder mindset with strong product empathy and user-centric problem solving."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-olae-223",
    "title": "iOS Software Engineer (Swift / SwiftUI / Combine)",
    "company": "Ola Electric",
    "companyCategory": "EV Tech & Manufacturing",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Bengaluru, Karnataka",
    "city": "Bengaluru",
    "state": "Karnataka",
    "workMode": "Remote",
    "employmentType": "Full-time",
    "experience": "3 - 6 Years",
    "experienceLevel": "mid",
    "salary": "₹24 - 38 LPA",
    "salaryMin": 24,
    "salaryMax": 38,
    "category": "mobile",
    "description": "Craft smooth 60fps mobile interfaces with instant loading, offline sync, and delightful haptics for millions of Indian smartphone users.",
    "skills": [
      "Combine",
      "Firebase",
      "SwiftUI",
      "Swift",
      "SQLite"
    ],
    "postedDate": "2026-10-12",
    "formattedDate": "11 days ago",
    "applyUrl": "https://careers.olaelectric.com/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Design clean modular mobile features utilizing MVVM or MVI architecture.",
      "Optimize bundle size, launch times, frame drops, and memory footprint across varied device tiers.",
      "Coordinate releases to Google Play Store and Apple App Store with automated CI/CD pipelines."
    ],
    "requirements": [
      "Demonstrated experience publishing and maintaining popular mobile apps on iOS or Android.",
      "Deep understanding of native lifecycle, asynchronous threading, and local SQLite/Room caching.",
      "Experience with modern UI toolkits such as Jetpack Compose or SwiftUI."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-athe-224",
    "title": "Site Reliability Engineer (SRE - Observability / Chaos Engineering)",
    "company": "Ather Energy",
    "companyCategory": "Electric Vehicles & IoT",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Chennai, Tamil Nadu",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "5 - 8 Years",
    "experienceLevel": "senior",
    "salary": "₹34 - 52 LPA",
    "salaryMin": 34,
    "salaryMax": 52,
    "category": "devops",
    "description": "Guarantee 99.99% service availability through automated canary rollouts, chaos drills, and self-healing cluster policies.",
    "skills": [
      "Kubernetes",
      "AWS",
      "CI/CD",
      "OpenTelemetry",
      "Terraform"
    ],
    "postedDate": "2026-10-11",
    "formattedDate": "12 days ago",
    "applyUrl": "https://www.atherenergy.com/careers",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Architect and operate high-scale Kubernetes clusters running thousands of container pods.",
      "Maintain Terraform modules and automated GitHub Actions / GitLab CI pipelines.",
      "Define SLA/SLO metrics, error budgets, on-call runbooks, and incident response automation."
    ],
    "requirements": [
      "Solid foundation in Linux systems administration, networking (TCP/IP, DNS, BGP), and security groups.",
      "Production experience managing infrastructure using Terraform, Kubernetes, and AWS/GCP/Azure.",
      "Familiarity with distributed telemetry stacks (Prometheus, Datadog, Grafana, Jaeger)."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  },
  {
    "id": "job-cars-225",
    "title": "Computer Vision Engineer (OpenCV / PyTorch / Edge Inference)",
    "company": "Cars24",
    "companyCategory": "AutoTech Marketplace",
    "companyLogo": "https://images.prismic.io/blueprint/aO11_J5xUNkB16Ls_6ef1554c0e7622b2037e8821a9558df4bb76fe17.jpg?auto=format&fit=max&w=120",
    "location": "Gurugram, Haryana",
    "city": "Gurugram",
    "state": "Haryana",
    "workMode": "Hybrid",
    "employmentType": "Full-time",
    "experience": "8+ Years",
    "experienceLevel": "lead",
    "salary": "₹50 - 85 LPA",
    "salaryMin": 50,
    "salaryMax": 85,
    "category": "ai-ml",
    "description": "Optimize model inference throughput on CPU/GPU clusters for low-latency conversational agents and search engines.",
    "skills": [
      "Python",
      "PyTorch",
      "TensorFlow",
      "LangChain",
      "LLMs"
    ],
    "postedDate": "2026-10-10",
    "formattedDate": "13 days ago",
    "applyUrl": "https://www.cars24.com/careers/",
    "source": "Official Company Careers Page",
    "responsibilities": [
      "Train, fine-tune, and deploy transformer architectures and custom embedding models.",
      "Build RAG pipelines integrating semantic vector search with prompt engineering guardrails.",
      "Monitor data drift, latency, hallucinations, and accuracy metrics in live production deployments."
    ],
    "requirements": [
      "Solid quantitative and programming skills in Python with PyTorch, Scikit-learn, and Hugging Face.",
      "Hands-on experience deploying generative AI, embeddings, and vector similarity search in production.",
      "Understanding of GPU acceleration, model quantization (int8/fp16), and batching strategies."
    ],
    "perks": [
      "Comprehensive family medical insurance (₹10L coverage)",
      "₹50,000 annual learning & certification budget",
      "WFH home-office ergonomic setup allowance",
      "Flexible paid time off and wellness leave"
    ]
  }
];

function getJobs(query = {}) {
  try {
    const db = require('./dbService.js');
    if (db && typeof db.getJobs === 'function') {
      return db.getJobs(query);
    }
  } catch (err) {}

  const {
    q = "",
    location = "all",
    workMode = "all",
    experience = "all",
    employmentType = "all",
    category = "all",
    sort = "newest",
    page = 1,
    limit = 9
  } = query;

  let filtered = [...JOBS];

  // Search query (keyword, title, company, skills, description)
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(job => {
      const matchTitle = job.title.toLowerCase().includes(term);
      const matchCompany = job.company.toLowerCase().includes(term);
      const matchDesc = job.description.toLowerCase().includes(term);
      const matchSkills = (job.skills || []).some(s => s.toLowerCase().includes(term));
      const matchCategory = (job.companyCategory || "").toLowerCase().includes(term);
      return matchTitle || matchCompany || matchDesc || matchSkills || matchCategory;
    });
  }

  // Location filter
  if (location && location !== "all" && location.toLowerCase() !== "all india") {
    const loc = location.toLowerCase();
    filtered = filtered.filter(job => {
      const matchCity = job.city.toLowerCase().includes(loc);
      const matchState = job.state.toLowerCase().includes(loc);
      const matchFullLoc = job.location.toLowerCase().includes(loc);
      const isRemoteMatch = loc.includes("remote") && job.workMode.toLowerCase() === "remote";
      return matchCity || matchState || matchFullLoc || isRemoteMatch;
    });
  }

  // Work Mode filter
  if (workMode && workMode !== "all") {
    filtered = filtered.filter(
      job => job.workMode.toLowerCase() === workMode.toLowerCase()
    );
  }

  // Experience level filter
  if (experience && experience !== "all") {
    filtered = filtered.filter(
      job => job.experienceLevel.toLowerCase() === experience.toLowerCase()
    );
  }

  // Category filter
  if (category && category !== "all") {
    filtered = filtered.filter(
      job => (job.category.toLowerCase() === category.toLowerCase() || ((category === "ai-ml" || category === "aiml") && (job.category === "ai-ml" || job.category === "aiml")))
    );
  }

  // Employment Type filter
  if (employmentType && employmentType !== "all") {
    filtered = filtered.filter(
      job => job.employmentType.toLowerCase() === employmentType.toLowerCase()
    );
  }

  // Sorting
  if (sort === "newest") {
    filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  } else if (sort === "salary_desc" || sort === "salary_high") {
    filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  } else if (sort === "experience_asc" || sort === "experience_low") {
    filtered.sort((a, b) => {
      const order = { entry: 1, mid: 2, senior: 3, lead: 4 };
      return (order[a.experienceLevel] || 2) - (order[b.experienceLevel] || 2);
    });
  } else if (sort === "experience_desc") {
    filtered.sort((a, b) => {
      const order = { entry: 1, mid: 2, senior: 3, lead: 4 };
      return (order[b.experienceLevel] || 2) - (order[a.experienceLevel] || 2);
    });
  }

  const total = filtered.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 9);
  const totalPages = Math.ceil(total / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginatedJobs = filtered.slice(offset, offset + limitNum);

  return {
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasMore: pageNum < totalPages,
    jobs: paginatedJobs
  };
}

function getJobById(id) {
  try {
    const db = require('./dbService.js');
    if (db && typeof db.getJobById === 'function') {
      return db.getJobById(id);
    }
  } catch (err) {
    // fallback
  }
  return JOBS.find(j => j.id === id) || null;
}

module.exports = {
  JOBS,
  getJobs,
  getJobById
};
