const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, 'data', 'hireconnect_db.json');

// Helper to slugify company names
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Default Indian Tech Companies Seed Data
function generateSeedCompanies() {
  const seedList = [
    {
      id: 'comp-razorpay',
      name: 'Razorpay',
      category: 'FinTech & Payments',
      industry: 'FinTech',
      website: 'https://razorpay.com',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Hybrid', 'Remote'],
      teamSize: '2,500+ employees',
      foundedYear: '2014',
      verified: true,
      description: 'Razorpay is India\'s leading full-stack financial solutions company, empowering millions of businesses to accept payments, automate payouts, and access working capital.',
      culture: 'Engineering at Razorpay is driven by high-scale resilience, open design reviews, continuous integration, and deep ownership.',
      benefits: ['Comprehensive Medical & Mental Health Coverage', 'Flexible Work & Annual Workations', 'Competitive ESOPs & Wealth Creation', 'Learning & Certification Allowances', 'Generous Parental Leave'],
      techStack: ['Go', 'Python', 'React', 'TypeScript', 'Kubernetes', 'AWS', 'Kafka', 'MySQL'],
      authorizedRecruiters: ['user-recruiter-priya']
    },
    {
      id: 'comp-zerodha',
      name: 'Zerodha',
      category: 'FinTech & Stock Trading',
      industry: 'FinTech',
      website: 'https://zerodha.com',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Remote', 'Hybrid'],
      teamSize: '1,100+ employees',
      foundedYear: '2010',
      verified: true,
      description: 'Zerodha is India\'s largest retail stockbroker by active client base, pioneering zero-brokerage trading and open-source financial technology.',
      culture: 'No unnecessary meetings, deep asynchronous work, open source contributions, and lean high-impact engineering teams.',
      benefits: ['Fully Remote & Flexible Schedules', 'Zero-Brokerage Internal Trading Accounts', 'Profit Sharing & Annual Bonuses', 'Wellness Stipends', 'Ergonomic Home Office Setup Grants'],
      techStack: ['Go', 'Python', 'PostgreSQL', 'Redis', 'Vue.js', 'React', 'Linux'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-zepto',
      name: 'Zepto',
      category: 'Quick Commerce',
      industry: 'Quick Commerce',
      website: 'https://zeptonow.com',
      locations: ['Mumbai, Maharashtra', 'Bengaluru, Karnataka'],
      workModes: ['On-site', 'Hybrid'],
      teamSize: '3,000+ employees',
      foundedYear: '2021',
      verified: true,
      description: 'Zepto is India\'s fastest growing quick commerce platform delivering groceries, fresh produce, and essentials in 10 minutes.',
      culture: 'Rapid iteration, hyper-local spatial logistics routing, and customer obsession at extreme scale.',
      benefits: ['Rapid Career Acceleration', 'Competitive Equity Packages', 'Comprehensive Health Insurance', 'Daily Catered Gourmet Meals', 'Commute Shuttle Services'],
      techStack: ['Node.js', 'Go', 'React Native', 'Swift', 'Kotlin', 'AWS', 'MongoDB'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-swiggy',
      name: 'Swiggy',
      category: 'Logistics Tech & Delivery',
      industry: 'E-Commerce',
      website: 'https://swiggy.com',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Hybrid', 'Remote'],
      teamSize: '6,000+ employees',
      foundedYear: '2014',
      verified: true,
      description: 'Swiggy is India\'s premier on-demand convenience platform connecting consumers with food delivery, quick commerce (Instamart), and dining experiences.',
      culture: 'Data-driven decision making, scalable microservices, and relentless focus on hyperlocal fulfillment efficiency.',
      benefits: ['Hybrid & Remote-First Flexibility', 'Parental & Adoption Leaves', 'Unlimited Sick Leave', 'Learning Reimbursements', 'Annual Performance Rewards'],
      techStack: ['Java', 'Go', 'React', 'Kafka', 'Kubernetes', 'DynamoDB', 'AWS'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-cred',
      name: 'CRED',
      category: 'FinTech & Lifestyle',
      industry: 'FinTech',
      website: 'https://cred.club',
      locations: ['Bengaluru, Karnataka', 'Mumbai, Maharashtra'],
      workModes: ['On-site', 'Hybrid'],
      teamSize: '800+ employees',
      foundedYear: '2018',
      verified: true,
      description: 'CRED is an exclusive members-only community celebrating creditworthiness through financial rewards, high-end commerce, and peer-to-peer payments.',
      culture: 'Extreme design craftsmanship, micro-interactions, high talent density, and relentless pursuit of aesthetic and engineering elegance.',
      benefits: ['Top-of-Market Compensation', 'Generous ESOP Buyback Programs', 'Full Health & Life Coverage', 'Subsidized Housing Near Office', 'Unlimited Books & Gadgets Allowance'],
      techStack: ['Kotlin', 'Go', 'React Native', 'Swift', 'AWS', 'Kafka', 'Cassandra'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-meesho',
      name: 'Meesho',
      category: 'E-Commerce Marketplace',
      industry: 'E-Commerce',
      website: 'https://meesho.io',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Remote', 'Hybrid'],
      teamSize: '2,000+ employees',
      foundedYear: '2015',
      verified: true,
      description: 'Meesho democratizes internet commerce for everyone in India, empowering small businesses, individual entrepreneurs, and millions of consumers.',
      culture: 'User first, speed over perfection, and boundaryless collaboration.',
      benefits: ['Permanent Work-from-Anywhere Option', 'Half-Yearly Performance Reviews', 'Mental Health Counseling Services', 'Comprehensive Mediclaim', 'Company Sabbaticals'],
      techStack: ['Java', 'Python', 'React', 'Spark', 'Hadoop', 'AWS', 'Flink'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-postman',
      name: 'Postman',
      category: 'Developer Tools & SaaS',
      industry: 'SaaS & Cloud',
      website: 'https://postman.com',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Remote', 'Hybrid'],
      teamSize: '1,200+ employees',
      foundedYear: '2014',
      verified: true,
      description: 'Postman is the leading API platform used by over 30 million developers and 500,000 organizations across the globe.',
      culture: 'Developer-first mindset, open API protocols, distributed autonomy, and global collaboration.',
      benefits: ['Work from Anywhere Globally', 'Home Office Stipend', 'Health, Dental, & Vision Insurance', 'Generous Equity Options', 'Continuing Education Stipend'],
      techStack: ['Node.js', 'React', 'TypeScript', 'Electron', 'AWS', 'Docker', 'PostgreSQL'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-freshworks',
      name: 'Freshworks',
      category: 'Enterprise SaaS',
      industry: 'SaaS & Cloud',
      website: 'https://freshworks.com',
      locations: ['Chennai, Tamil Nadu', 'Bengaluru, Karnataka'],
      workModes: ['Hybrid'],
      teamSize: '5,000+ employees',
      foundedYear: '2010',
      verified: true,
      description: 'Freshworks creates AI-boosted business software designed to make customer support, IT operations, and sales intuitive and delightful.',
      culture: 'Craftsmanship, happy employees creating happy customers, and global scale from India.',
      benefits: ['Global NASDAQ Equity Plans', 'Modern Chennai Campus Facilities', 'Comprehensive Health Benefits', 'Childcare Daycare Subsidies', 'Innovation Hackathons'],
      techStack: ['Ruby on Rails', 'Java', 'React', 'AWS', 'Ember.js', 'MySQL', 'Kafka'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-phonepe',
      name: 'PhonePe',
      category: 'Digital Payments & Financial Services',
      industry: 'FinTech',
      website: 'https://phonepe.com',
      locations: ['Bengaluru, Karnataka', 'Pune, Maharashtra'],
      workModes: ['Hybrid', 'On-site'],
      teamSize: '4,000+ employees',
      foundedYear: '2015',
      verified: true,
      description: 'PhonePe is India\'s premier digital payments company processing billions of monthly transactions across UPI, merchants, and wealth management.',
      culture: 'Engineered for 99.999% uptime, distributed databases, high reliability, and extreme payment throughput.',
      benefits: ['Market-Leading Compensation', 'Robust Stock Ownership Program', 'Premium Health & Family Cover', 'On-campus Recreation & Cafes', 'Relocation Support'],
      techStack: ['Java', 'C++', 'React', 'Aerospike', 'HBase', 'Kafka', 'Spring Boot'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-zomato',
      name: 'Zomato',
      category: 'Food Delivery & Dining',
      industry: 'E-Commerce',
      website: 'https://zomato.com',
      locations: ['Gurugram, Haryana', 'Bengaluru, Karnataka'],
      workModes: ['On-site', 'Hybrid'],
      teamSize: '4,500+ employees',
      foundedYear: '2008',
      verified: true,
      description: 'Zomato is a pioneering food tech marketplace connecting customers, restaurant partners, and delivery personnel across 1,000+ Indian cities.',
      culture: 'Speed, bold experimentation, continuous delivery, and user delight.',
      benefits: ['Period Leave Policy', 'Parental & Surrogacy Support', 'Competitive Compensation & Stock Options', 'Free Catered Meals', 'Medical Insurance for Family'],
      techStack: ['Python', 'PHP', 'Node.js', 'React', 'Swift', 'Kotlin', 'Kubernetes'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-groww',
      name: 'Groww',
      category: 'Investment & Wealth Tech',
      industry: 'FinTech',
      website: 'https://groww.in',
      locations: ['Bengaluru, Karnataka', 'Remote - India'],
      workModes: ['Hybrid', 'Remote'],
      teamSize: '1,500+ employees',
      foundedYear: '2016',
      verified: true,
      description: 'Groww makes investing simple, transparent, and accessible to millions of Indians across mutual funds, stocks, US investing, and fixed deposits.',
      culture: 'Customer-first transparency, zero unnecessary hierarchy, and deep product obsession.',
      benefits: ['Flexible Work Schedules', 'High-Growth ESOPs', 'Comprehensive Health Coverage', 'Subsidized Learning Programs', 'Annual Wellness Breaks'],
      techStack: ['Microservices', 'Java', 'Go', 'React', 'React Native', 'Kubernetes', 'GCP'],
      authorizedRecruiters: []
    },
    {
      id: 'comp-inmobi',
      name: 'InMobi',
      category: 'AdTech & Glance Platforms',
      industry: 'AI / ML',
      website: 'https://inmobi.com',
      locations: ['Bengaluru, Karnataka', 'Delhi NCR, Delhi'],
      workModes: ['Hybrid'],
      teamSize: '2,500+ employees',
      foundedYear: '2007',
      verified: true,
      description: 'InMobi is India\'s first unicorn, powering smart mobile surfaces through Glance AI and transformative global advertising technology.',
      culture: 'Culture of innovation, intellectual rigor, machine learning at scale, and global impact.',
      benefits: ['Global Mobility Opportunities', 'Robust Healthcare & Wellness Plans', 'ESOP Wealth Creation', 'Learning Stipends', 'Concierge Employee Assistance'],
      techStack: ['Python', 'Scala', 'Spark', 'TensorFlow', 'Kubernetes', 'Azure', 'BigQuery'],
      authorizedRecruiters: []
    }
  ];

  return seedList;
}

// Generate Seed Candidates for Candidate Discovery
function generateSeedCandidates() {
  return [
    {
      id: 'user-candidate-aarav',
      userId: 'user-candidate-aarav',
      name: 'Aarav Sharma',
      email: 'candidate@hireconnect.io',
      headline: 'Senior Full Stack Engineer | React • Node.js • Distributed Systems',
      location: 'Bengaluru, Karnataka',
      phone: '+91 98765 43210',
      contactEmail: 'candidate@hireconnect.io',
      summary: 'Passionate product engineer with 5+ years of experience building high-throughput fintech APIs and responsive web apps. Open to senior product engineering roles.',
      avatarUrl: '',
      preferredModes: ['Remote', 'Hybrid'],
      preferredLocations: ['Bengaluru, Karnataka', 'Remote - India'],
      desiredTitles: ['Senior Full Stack Engineer', 'Lead Backend Engineer'],
      expectedSalary: '₹35–45 LPA',
      noticePeriod: '30 Days',
      skills: [
        { name: 'React / Next.js', level: 'Expert', category: 'Frontend' },
        { name: 'Node.js / Express', level: 'Expert', category: 'Backend' },
        { name: 'TypeScript', level: 'Advanced', category: 'Languages' },
        { name: 'PostgreSQL', level: 'Advanced', category: 'Databases' },
        { name: 'AWS & Docker', level: 'Intermediate', category: 'DevOps' },
        { name: 'Go', level: 'Intermediate', category: 'Backend' }
      ],
      experience: [
        {
          title: 'Full Stack Engineer',
          company: 'Groww',
          location: 'Bengaluru, Karnataka',
          startDate: '2023-01',
          endDate: 'Present',
          current: true,
          description: 'Architected trade order routing pipeline handling 100k+ req/sec. Reduced frontend initial load times by 40%.'
        },
        {
          title: 'Software Engineer',
          company: 'Freshworks',
          location: 'Chennai, Tamil Nadu',
          startDate: '2021-06',
          endDate: '2022-12',
          current: false,
          description: 'Built customer communication microservices and real-time dashboard widgets using React, Node.js, and Redis.'
        }
      ],
      education: [
        {
          institution: 'National Institute of Technology Karnataka (NITK)',
          degree: 'Bachelor of Technology (B.Tech)',
          field: 'Computer Science and Engineering',
          gradYear: '2021',
          grade: '8.8 CGPA'
        }
      ],
      projects: [
        {
          title: 'HireStream Real-time Event Hub',
          description: 'High performance message bus in Go & WebSocket for distributed system monitoring and latency analytics.',
          techStack: 'Go, WebSockets, Redis, Docker',
          githubUrl: 'https://github.com/aarav-sharma/hirestream',
          liveUrl: 'https://hirestream-demo.io'
        }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', year: '2024' }
      ],
      languages: ['English', 'Hindi', 'Kannada'],
      resume: {
        fileName: 'Aarav_Sharma_FullStack_Resume.pdf',
        fileUrl: '/api/profile/resume/download/user-candidate-aarav',
        fileType: 'application/pdf',
        fileSize: 420000,
        uploadedAt: '2026-10-15T10:00:00.000Z',
        contentText: 'Aarav Sharma - Senior Full Stack Engineer. 5 years building scalable fintech platforms with React, Node.js, Go, PostgreSQL, AWS.'
      },
      privacy: {
        isDiscoverable: true,
        allowResumeDownload: true,
        hideContactInfo: false
      },
      completionPercentage: 92,
      createdAt: '2026-10-01T08:00:00.000Z',
      updatedAt: '2026-10-23T12:00:00.000Z'
    },
    {
      id: 'user-candidate-neha',
      userId: 'user-candidate-neha',
      name: 'Neha Patel',
      email: 'neha.patel@example.com',
      headline: 'Frontend Engineer | React • Next.js • Design Systems • Web Performance',
      location: 'Pune, Maharashtra',
      phone: '+91 98112 23344',
      contactEmail: 'neha.patel@example.com',
      summary: 'Frontend specialist passionate about web accessibility, design systems, and rendering performance. 4 years of experience delivering pixel-perfect UIs.',
      avatarUrl: '',
      preferredModes: ['Remote', 'Hybrid'],
      preferredLocations: ['Pune, Maharashtra', 'Mumbai, Maharashtra', 'Remote - India'],
      desiredTitles: ['Senior Frontend Engineer', 'UI/UX Engineer'],
      expectedSalary: '₹22–30 LPA',
      noticePeriod: '15 Days',
      skills: [
        { name: 'React', level: 'Expert', category: 'Frontend' },
        { name: 'TypeScript', level: 'Expert', category: 'Languages' },
        { name: 'Next.js', level: 'Advanced', category: 'Frontend' },
        { name: 'Tailwind CSS', level: 'Expert', category: 'Styling' },
        { name: 'GraphQL', level: 'Intermediate', category: 'APIs' }
      ],
      experience: [
        {
          title: 'Frontend Engineer',
          company: 'Persistent Systems',
          location: 'Pune, Maharashtra',
          startDate: '2022-04',
          endDate: 'Present',
          current: true,
          description: 'Developed modern banking customer portals with Next.js, achieving 98+ Lighthouse scores.'
        }
      ],
      education: [
        {
          institution: 'College of Engineering, Pune (COEP)',
          degree: 'B.Tech Information Technology',
          field: 'Information Technology',
          gradYear: '2022',
          grade: '8.5 CGPA'
        }
      ],
      projects: [],
      certifications: [],
      languages: ['English', 'Marathi', 'Hindi'],
      resume: {
        fileName: 'Neha_Patel_Frontend_Resume.pdf',
        fileUrl: '/api/profile/resume/download/user-candidate-neha',
        fileType: 'application/pdf',
        fileSize: 310000,
        uploadedAt: '2026-10-18T14:00:00.000Z',
        contentText: 'Neha Patel - Frontend Engineer with 4 years building enterprise grade web apps.'
      },
      privacy: {
        isDiscoverable: true,
        allowResumeDownload: true,
        hideContactInfo: true
      },
      completionPercentage: 85,
      createdAt: '2026-10-05T09:00:00.000Z',
      updatedAt: '2026-10-22T15:00:00.000Z'
    },
    {
      id: 'user-candidate-vikram',
      userId: 'user-candidate-vikram',
      name: 'Vikram Singhal',
      email: 'vikram.singhal@example.com',
      headline: 'Backend & Cloud Architect | Go • Kubernetes • Kafka • Distributed Data',
      location: 'Hyderabad, Telangana',
      phone: '+91 97766 55443',
      contactEmail: 'vikram.singhal@example.com',
      summary: 'Backend engineer with 7+ years of expertise in distributed streaming architectures, Kubernetes orchestration, and database scaling.',
      avatarUrl: '',
      preferredModes: ['Hybrid', 'On-site'],
      preferredLocations: ['Hyderabad, Telangana', 'Bengaluru, Karnataka'],
      desiredTitles: ['Principal Backend Engineer', 'Cloud Architect'],
      expectedSalary: '₹48–65 LPA',
      noticePeriod: 'Immediate',
      skills: [
        { name: 'Go (Golang)', level: 'Expert', category: 'Backend' },
        { name: 'Kubernetes', level: 'Expert', category: 'DevOps' },
        { name: 'Kafka', level: 'Advanced', category: 'Streaming' },
        { name: 'PostgreSQL / ScyllaDB', level: 'Advanced', category: 'Databases' }
      ],
      experience: [
        {
          title: 'Senior Systems Engineer',
          company: 'Darwinbox',
          location: 'Hyderabad, Telangana',
          startDate: '2020-03',
          endDate: 'Present',
          current: true,
          description: 'Maintained core payroll computing microservices servicing over 2 million employees monthly.'
        }
      ],
      education: [
        {
          institution: 'IIIT Hyderabad',
          degree: 'M.Tech Computer Science',
          field: 'Computer Science',
          gradYear: '2019',
          grade: '9.1 CGPA'
        }
      ],
      projects: [],
      certifications: [],
      languages: ['English', 'Telugu', 'Hindi'],
      resume: {
        fileName: 'Vikram_Singhal_Architect_Resume.pdf',
        fileUrl: '/api/profile/resume/download/user-candidate-vikram',
        fileType: 'application/pdf',
        fileSize: 490000,
        uploadedAt: '2026-10-10T11:00:00.000Z',
        contentText: 'Vikram Singhal - Systems Architect with 7 years experience in Go and Cloud Native computing.'
      },
      privacy: {
        isDiscoverable: true,
        allowResumeDownload: true,
        hideContactInfo: false
      },
      completionPercentage: 90,
      createdAt: '2026-10-02T10:00:00.000Z',
      updatedAt: '2026-10-21T18:00:00.000Z'
    },
    {
      id: 'user-candidate-rahul',
      userId: 'user-candidate-rahul',
      name: 'Rahul Verma (Private Profile)',
      email: 'rahul.private@example.com',
      headline: 'Software Engineer | Mobile (Flutter & iOS)',
      location: 'Noida, Uttar Pradesh',
      phone: '+91 99001 12233',
      contactEmail: 'rahul.private@example.com',
      summary: 'Private candidate profile testing default privacy settings.',
      avatarUrl: '',
      preferredModes: ['Remote'],
      preferredLocations: ['Remote - India'],
      desiredTitles: ['Mobile Developer'],
      expectedSalary: '₹20–28 LPA',
      noticePeriod: '30 Days',
      skills: [{ name: 'Flutter', level: 'Expert', category: 'Mobile' }],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: ['English', 'Hindi'],
      resume: null,
      privacy: {
        isDiscoverable: false, // Strict Private Default
        allowResumeDownload: false,
        hideContactInfo: true
      },
      completionPercentage: 50,
      createdAt: '2026-10-20T12:00:00.000Z',
      updatedAt: '2026-10-20T12:00:00.000Z'
    }
  ];
}

function generateSeedTeamMembers() {
  return [
    {
      id: 'tm-neil',
      name: 'Neil Bhargava',
      role: 'Principal Recruiter & Talent Lead',
      email: 'neil.bhargava@hireconnect.io',
      specialties: ['Recruitment and hiring discussion', 'General HireConnect enquiry', 'Company onboarding', 'Strategic Partnership & Advisory'],
      timezone: 'Asia/Kolkata',
      avatarUrl: ''
    },
    {
      id: 'tm-neeraj',
      name: 'Neeraj Deshmukh',
      role: 'Lead Solutions Architect & Engineering Lead',
      email: 'neeraj.deshmukh@hireconnect.io',
      specialties: ['Technical demonstration', 'Talent Match demonstration'],
      timezone: 'Asia/Kolkata',
      avatarUrl: ''
    },
    {
      id: 'tm-pooja',
      name: 'Pooja Iyer',
      role: 'Head of Enterprise Client Onboarding',
      email: 'pooja.iyer@hireconnect.io',
      specialties: ['Company onboarding'],
      timezone: 'Asia/Kolkata',
      avatarUrl: ''
    },
    {
      id: 'tm-vikram',
      name: 'Vikramaditya Sen',
      role: 'Founding Partner & Strategic Growth',
      email: 'vikram.sen@hireconnect.io',
      specialties: ['Partnership or business enquiry', 'Other'],
      timezone: 'Asia/Kolkata',
      avatarUrl: ''
    }
  ];
}

function generateSeedMeetings() {
  return [
    {
      id: 'meet-seed-1',
      reference: 'HC-MEET-820194',
      name: 'Rohan Mehra',
      email: 'rohan.mehra@techcorp.in',
      phone: '+91 98201 12345',
      company: 'TechCorp India',
      purpose: 'Recruitment and hiring discussion',
      date: '2026-10-27',
      timeSlot: '02:00 PM - 02:30 PM',
      timezone: 'Asia/Kolkata',
      format: 'Video Call (Google Meet)',
      agenda: 'Scaling backend engineering team in Bengaluru and Pune.',
      durationMinutes: 30,
      hostId: 'tm-pooja',
      hostName: 'Pooja Iyer',
      hostRole: 'Head of Enterprise Client Onboarding',
      hostEmail: 'pooja.iyer@hireconnect.io',
      videoUrl: 'https://meet.hireconnect.io/room-hc-meet-820194',
      status: 'confirmed',
      createdAt: '2026-10-22T10:00:00.000Z',
      updatedAt: '2026-10-22T10:00:00.000Z'
    },
    {
      id: 'meet-seed-2',
      reference: 'HC-MEET-471089',
      name: 'Sunita Reddy',
      email: 'sunita.reddy@finscale.io',
      phone: '+91 94402 67890',
      company: 'FinScale Payments',
      purpose: 'Talent Match demonstration',
      date: '2026-10-28',
      timeSlot: '11:30 AM - 12:00 PM',
      timezone: 'Asia/Kolkata',
      format: 'Video Call (Google Meet)',
      agenda: 'Exploring AI matching algorithm for hiring Go and Kubernetes engineers.',
      durationMinutes: 30,
      hostId: 'tm-neeraj',
      hostName: 'Neeraj Deshmukh',
      hostRole: 'Lead Solutions Architect & Engineering Lead',
      hostEmail: 'neeraj.deshmukh@hireconnect.io',
      videoUrl: 'https://meet.hireconnect.io/room-hc-meet-471089',
      status: 'confirmed',
      createdAt: '2026-10-22T14:30:00.000Z',
      updatedAt: '2026-10-22T14:30:00.000Z'
    }
  ];
}

class DbService {
  constructor() {
    this.data = {
      companies: [],
      jobs: [],
      candidateProfiles: [],
      recruiterProfiles: [],
      applications: [],
      savedJobs: {},
      meetings: [],
      teamMembers: [],
      shortlistedCandidates: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.meetings) this.data.meetings = generateSeedMeetings();
        if (!this.data.teamMembers) this.data.teamMembers = generateSeedTeamMembers();
        if (!this.data.teamMembers.some(t => t.id === 'tm-neil')) {
          this.data.teamMembers.unshift(generateSeedTeamMembers()[0]);
        }
        if (!this.data.shortlistedCandidates) this.data.shortlistedCandidates = [];
        if (!this.data.savedJobs) this.data.savedJobs = {};
        console.log(`[DbService] Loaded DB from disk with ${this.data.companies.length} companies, ${this.data.jobs.length} jobs, ${this.data.meetings.length} meetings.`);
      } else {
        this.bootstrap();
      }
    } catch (err) {
      console.error('[DbService] Error loading DB, bootstrapping fresh:', err.message);
      this.bootstrap();
    }
  }

  bootstrap() {
    console.log('[DbService] Bootstrapping fresh HireConnect DB...');
    this.data.companies = generateSeedCompanies();
    this.data.candidateProfiles = generateSeedCandidates();
    this.data.teamMembers = generateSeedTeamMembers();
    this.data.meetings = generateSeedMeetings();
    this.data.shortlistedCandidates = [];
    this.data.savedJobs = {};
    this.data.recruiterProfiles = [
      {
        userId: 'user-recruiter-priya',
        name: 'Priya Mehta',
        email: 'recruiter@hireconnect.io',
        title: 'Lead Technical Talent Partner',
        phone: '+91 99887 76655',
        companyId: 'comp-razorpay',
        permissions: ['admin', 'job_poster', 'applicant_reviewer']
      }
    ];

    // Load initial jobs from jobsData.js if available
    try {
      const { getJobs } = require('./jobsData.js');
      const res = getJobs({ limit: 500 });
      this.data.jobs = (res.jobs || []).map(j => {
        // Find or map to companyId
        let comp = this.data.companies.find(c => c.name.toLowerCase() === (j.company || '').toLowerCase());
        if (!comp) {
          const compId = `comp-${slugify(j.company)}`;
          comp = {
            id: compId,
            name: j.company,
            category: j.companyCategory || 'Technology',
            industry: 'Technology',
            website: `https://${slugify(j.company)}.com`,
            locations: [j.location || 'Bengaluru, Karnataka'],
            workModes: [j.workMode || 'Hybrid'],
            teamSize: '500+ employees',
            foundedYear: '2018',
            verified: true,
            description: `${j.company} is a leading technology organization building next-generation digital products across India.`,
            culture: 'High ownership, agile delivery, and collaborative engineering excellence.',
            benefits: ['Health Insurance', 'Flexible Schedules', 'Learning Allowance', 'Performance Bonus'],
            techStack: j.skills || ['JavaScript', 'Python', 'Cloud'],
            authorizedRecruiters: []
          };
          this.data.companies.push(comp);
        }

        return {
          id: j.id,
          companyId: comp.id,
          company: j.company,
          title: j.title,
          department: j.companyCategory || 'Engineering',
          location: j.location,
          workMode: j.workMode,
          employmentType: j.employmentType || 'Full-time',
          experience: j.experience,
          salary: j.salary,
          salaryDisclosed: true,
          openingsCount: 1,
          description: j.description,
          requirements: j.requirements || [],
          responsibilities: j.responsibilities || [],
          skills: j.skills || [],
          perks: j.perks || [],
          applyUrl: j.applyUrl,
          deadline: '2026-12-31',
          screeningQuestions: [],
          status: 'published',
          recruiterId: comp.id === 'comp-razorpay' ? 'user-recruiter-priya' : null,
          applicantCount: Math.floor(Math.random() * 8) + 1,
          createdAt: j.postedDate || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
    } catch (e) {
      console.warn('[DbService] Could not import from jobsData.js, initializing empty jobs:', e.message);
      this.data.jobs = [];
    }

    // Seed initial applications for evaluation
    this.data.applications = [
      {
        id: 'app-seed-01',
        jobId: this.data.jobs[0]?.id || 'job-razorpay-01',
        candidateId: 'user-candidate-aarav',
        candidateName: 'Aarav Sharma',
        candidateEmail: 'candidate@hireconnect.io',
        candidateHeadline: 'Senior Full Stack Engineer | React • Node.js',
        companyId: this.data.jobs[0]?.companyId || 'comp-razorpay',
        resumeUrl: '/api/profile/resume/download/user-candidate-aarav',
        status: 'under_review',
        appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        notes: 'Strong candidate with extensive high-scale fintech background.'
      }
    ];

    this.save();
  }

  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DbService] Failed to persist DB to disk:', err.message);
    }
  }

  // ==================== COMPANIES ====================
  getCompanies({ q = '', industry = 'all', location = 'all', verifiedOnly = false, page = 1, limit = 100 } = {}) {
    let list = this.data.companies;

    if (q) {
      const cleanQ = q.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(cleanQ) ||
        (c.category && c.category.toLowerCase().includes(cleanQ)) ||
        (c.description && c.description.toLowerCase().includes(cleanQ)) ||
        (c.techStack && c.techStack.some(t => t.toLowerCase().includes(cleanQ)))
      );
    }

    if (industry && industry !== 'all') {
      const cleanInd = industry.toLowerCase();
      list = list.filter(c =>
        (c.industry && c.industry.toLowerCase().includes(cleanInd)) ||
        (c.category && c.category.toLowerCase().includes(cleanInd))
      );
    }

    if (location && location !== 'all') {
      const cleanLoc = location.toLowerCase();
      list = list.filter(c => c.locations && c.locations.some(l => l.toLowerCase().includes(cleanLoc)));
    }

    if (verifiedOnly) {
      list = list.filter(c => c.verified === true);
    }

    // Attach active job count dynamically from authoritative jobs store
    const mapped = list.map(c => {
      const activeJobsCount = this.data.jobs.filter(j => j.companyId === c.id && j.status === 'published').length;
      return { ...c, activeJobsCount };
    });

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 100);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = mapped.slice(startIndex, startIndex + limitNum);

    return {
      success: true,
      total: mapped.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(mapped.length / limitNum),
      companies: paginated
    };
  }

  getCompanyById(id) {
    if (!id) return null;
    const cleanId = String(id).toLowerCase().trim();
    const comp = this.data.companies.find(c => c.id.toLowerCase() === cleanId || slugify(c.name) === cleanId);
    if (!comp) return null;

    const activeJobs = this.data.jobs.filter(j => j.companyId === comp.id && j.status === 'published');
    return {
      ...comp,
      activeJobsCount: activeJobs.length,
      activeJobs
    };
  }

  registerCompany({ name, industry, website, locations, description, culture, benefits, teamSize }, recruiterUserId) {
    if (!name) throw new Error('Company name is required');
    const compId = `comp-${slugify(name)}-${crypto.randomBytes(3).toString('hex')}`;

    const newCompany = {
      id: compId,
      name: name.trim(),
      category: industry || 'Technology',
      industry: industry || 'Technology',
      website: website || '',
      locations: Array.isArray(locations) ? locations : [locations || 'Bengaluru, Karnataka'],
      workModes: ['Hybrid', 'Remote'],
      teamSize: teamSize || '50-200 employees',
      foundedYear: new Date().getFullYear().toString(),
      verified: true, // Verification approved for registered partner
      description: description || `${name} is an authorized hiring partner on HireConnect.`,
      culture: culture || 'Inclusive, engineering-centric culture.',
      benefits: Array.isArray(benefits) ? benefits : ['Health Insurance', 'Flexible Hours', 'Skill Allowances'],
      techStack: ['Full Stack', 'Cloud', 'Modern Web'],
      authorizedRecruiters: [recruiterUserId],
      ownerId: recruiterUserId,
      createdAt: new Date().toISOString()
    };

    this.data.companies.unshift(newCompany);

    // Link recruiter to company
    const rProfile = this.data.recruiterProfiles.find(r => r.userId === recruiterUserId);
    if (rProfile) {
      rProfile.companyId = compId;
    }

    this.save();
    return newCompany;
  }

  updateCompany(companyId, updateData, recruiterUserId) {
    const comp = this.data.companies.find(c => c.id === companyId);
    if (!comp) throw new Error('Company not found');

    // Strict Authorization Check: Only authorized recruiters for this company can edit
    if (!comp.authorizedRecruiters.includes(recruiterUserId) && comp.ownerId !== recruiterUserId) {
      const err = new Error('Unauthorized: You are not an authorized representative for this company.');
      err.status = 403;
      throw err;
    }

    if (updateData.description !== undefined) comp.description = updateData.description;
    if (updateData.website !== undefined) comp.website = updateData.website;
    if (updateData.industry !== undefined) {
      comp.industry = updateData.industry;
      comp.category = updateData.industry;
    }
    if (updateData.locations !== undefined) comp.locations = updateData.locations;
    if (updateData.benefits !== undefined) comp.benefits = updateData.benefits;
    if (updateData.culture !== undefined) comp.culture = updateData.culture;
    if (updateData.teamSize !== undefined) comp.teamSize = updateData.teamSize;

    comp.updatedAt = new Date().toISOString();
    this.save();
    return comp;
  }

  // ==================== JOBS (ONE AUTHORITATIVE SOURCE OF TRUTH) ====================
  getJobs({ q = '', location = 'all', workMode = 'all', experience = 'all', category = 'all', employmentType = 'all', companyId = '', sort = 'newest', page = 1, limit = 9, includeInactive = false, recruiterUserId = null } = {}) {
    let list = this.data.jobs;

    // Filter by active status unless specifically requesting inactive jobs for authorized recruiter
    if (!includeInactive) {
      list = list.filter(j => j.status === 'published');
    } else if (recruiterUserId) {
      // Authorized recruiter can see their company's published, paused, draft, and closed jobs
      const recruiterComp = this.getCompanyForRecruiter(recruiterUserId);
      if (recruiterComp) {
        list = list.filter(j => j.companyId === recruiterComp.id);
      }
    }

    if (companyId) {
      list = list.filter(j => j.companyId === companyId);
    }

    if (q) {
      const cleanQ = q.toLowerCase().trim();
      list = list.filter(j =>
        j.title.toLowerCase().includes(cleanQ) ||
        j.company.toLowerCase().includes(cleanQ) ||
        (j.description && j.description.toLowerCase().includes(cleanQ)) ||
        (j.skills && j.skills.some(s => s.toLowerCase().includes(cleanQ)))
      );
    }

    if (location && location !== 'all') {
      const cleanLoc = location.toLowerCase();
      list = list.filter(j => j.location && j.location.toLowerCase().includes(cleanLoc));
    }

    if (workMode && workMode !== 'all') {
      list = list.filter(j => j.workMode && j.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (experience && experience !== 'all') {
      list = list.filter(j => j.experience && j.experience.toLowerCase().includes(experience.toLowerCase()));
    }

    if (employmentType && employmentType !== 'all') {
      list = list.filter(j => j.employmentType && j.employmentType.toLowerCase().includes(employmentType.toLowerCase()));
    }

    if (category && category !== 'all') {
      list = list.filter(j =>
        (j.department && j.department.toLowerCase().includes(category.toLowerCase())) ||
        (j.title && j.title.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Sort
    if (sort === 'salary-high') {
      list.sort((a, b) => (parseInt(b.salary?.replace(/\D/g, '') || 0) - parseInt(a.salary?.replace(/\D/g, '') || 0)));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = list.slice(startIndex, startIndex + limit);

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + limit < total,
      jobs: paginatedJobs
    };
  }

  getJobById(id) {
    if (!id) return null;
    return this.data.jobs.find(j => j.id === id) || null;
  }

  createJob(jobData, recruiterUserId) {
    if (!jobData.title) throw new Error('Job title is required');

    // Verify recruiter authorization
    const recruiterComp = this.getCompanyForRecruiter(recruiterUserId);
    if (!recruiterComp) {
      const err = new Error('Unauthorized: You must be linked to a registered company to publish job openings.');
      err.status = 403;
      throw err;
    }

    const newId = `job-${slugify(recruiterComp.name)}-${crypto.randomBytes(4).toString('hex')}`;
    const newJob = {
      id: newId,
      companyId: recruiterComp.id,
      company: recruiterComp.name,
      title: jobData.title.trim(),
      department: jobData.department || 'Engineering',
      location: jobData.location || recruiterComp.locations[0] || 'Bengaluru, Karnataka',
      workMode: jobData.workMode || 'Hybrid',
      employmentType: jobData.employmentType || 'Full-time',
      experience: jobData.experience || '2 - 5 Years',
      salary: jobData.salaryDisclosed === false ? 'Competitive (Undisclosed)' : (jobData.salary || '₹24 - 36 LPA'),
      salaryDisclosed: jobData.salaryDisclosed !== false,
      openingsCount: parseInt(jobData.openingsCount, 10) || 1,
      description: jobData.description || 'We are looking for talented engineers to join our high-impact team.',
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [jobData.requirements || '3+ years of relevant experience'],
      responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [jobData.responsibilities || 'Own and drive architecture'],
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()) : ['React', 'Node.js']),
      perks: jobData.perks || recruiterComp.benefits,
      applyUrl: jobData.applyUrl || `${recruiterComp.website}/careers/${newId}`,
      deadline: jobData.deadline || '2026-12-31',
      screeningQuestions: jobData.screeningQuestions || [],
      status: jobData.status || 'published', // 'published', 'draft', 'paused', 'closed'
      recruiterId: recruiterUserId,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prepend to authoritative jobs store so it immediately shows up first
    this.data.jobs.unshift(newJob);
    this.save();
    return newJob;
  }

  updateJob(jobId, updateData, recruiterUserId) {
    const job = this.data.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const comp = this.data.companies.find(c => c.id === job.companyId);
    if (!comp || (!comp.authorizedRecruiters.includes(recruiterUserId) && comp.ownerId !== recruiterUserId)) {
      const err = new Error('Unauthorized: You cannot edit another company\'s job listing.');
      err.status = 403;
      throw err;
    }

    // Apply allowed updates
    const allowedFields = ['title', 'department', 'location', 'workMode', 'employmentType', 'experience', 'salary', 'salaryDisclosed', 'openingsCount', 'description', 'requirements', 'responsibilities', 'skills', 'perks', 'deadline', 'screeningQuestions'];
    for (const f of allowedFields) {
      if (updateData[f] !== undefined) job[f] = updateData[f];
    }
    job.updatedAt = new Date().toISOString();

    this.save();
    return job;
  }

  updateJobStatus(jobId, newStatus, recruiterUserId) {
    const job = this.data.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const comp = this.data.companies.find(c => c.id === job.companyId);
    if (!comp || (!comp.authorizedRecruiters.includes(recruiterUserId) && comp.ownerId !== recruiterUserId)) {
      const err = new Error('Unauthorized: You cannot modify the status of another company\'s job.');
      err.status = 403;
      throw err;
    }

    if (!['published', 'paused', 'closed', 'draft'].includes(newStatus)) {
      throw new Error('Invalid status. Allowed: published, paused, closed, draft');
    }

    job.status = newStatus;
    job.updatedAt = new Date().toISOString();
    this.save();
    return job;
  }

  getRecruiterJobs(recruiterUserId) {
    const comp = this.getCompanyForRecruiter(recruiterUserId);
    if (!comp) return [];
    return this.data.jobs.filter(j => j.companyId === comp.id);
  }

  // ==================== CANDIDATE PROFILES & PRIVACY ====================
  getCandidateProfile(userId) {
    let p = this.data.candidateProfiles.find(c => c.userId === userId || c.id === userId);
    if (!p) {
      // Initialize default candidate profile
      p = {
        id: userId,
        userId,
        name: 'HireConnect Candidate',
        email: '',
        headline: 'Software Engineer',
        location: 'Bengaluru, Karnataka',
        phone: '',
        contactEmail: '',
        summary: 'Passionate tech professional ready to contribute to innovative products.',
        avatarUrl: '',
        preferredModes: ['Remote', 'Hybrid'],
        preferredLocations: ['Bengaluru, Karnataka', 'Remote - India'],
        desiredTitles: ['Software Engineer'],
        expectedSalary: '',
        noticePeriod: '30 Days',
        skills: [{ name: 'JavaScript', level: 'Intermediate', category: 'Frontend' }],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        languages: ['English'],
        resume: null,
        privacy: {
          isDiscoverable: false, // Strict default private as per Principle A
          allowResumeDownload: true,
          hideContactInfo: false
        },
        completionPercentage: 40,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.candidateProfiles.push(p);
      this.save();
    }
    return p;
  }

  updateCandidateProfile(userId, updateData) {
    const profile = this.getCandidateProfile(userId);

    const allowed = ['name', 'headline', 'location', 'phone', 'contactEmail', 'summary', 'avatarUrl', 'preferredModes', 'preferredLocations', 'desiredTitles', 'expectedSalary', 'noticePeriod', 'skills', 'experience', 'education', 'projects', 'certifications', 'languages', 'privacy'];
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        profile[key] = updateData[key];
      }
    }

    // Recompute profile completion score
    let score = 20; // baseline
    if (profile.headline) score += 10;
    if (profile.summary && profile.summary.length > 30) score += 15;
    if (profile.skills && profile.skills.length >= 3) score += 15;
    if (profile.experience && profile.experience.length >= 1) score += 15;
    if (profile.education && profile.education.length >= 1) score += 10;
    if (profile.resume) score += 15;
    profile.completionPercentage = Math.min(100, score);
    profile.updatedAt = new Date().toISOString();

    this.save();
    return profile;
  }

  uploadResume(userId, fileMetadata) {
    const profile = this.getCandidateProfile(userId);

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const validExts = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(fileMetadata.fileName || '').toLowerCase();

    if (!validExts.includes(ext) && !validTypes.includes(fileMetadata.fileType)) {
      throw new Error('Unsupported format. Please upload a PDF or DOCX file.');
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fileMetadata.fileSize && fileMetadata.fileSize > MAX_SIZE) {
      throw new Error('File size exceeds 5MB limit. Please upload a smaller document.');
    }

    profile.resume = {
      fileName: fileMetadata.fileName || 'Resume.pdf',
      fileUrl: `/api/profile/resume/download/${userId}`,
      fileType: fileMetadata.fileType || 'application/pdf',
      fileSize: fileMetadata.fileSize || 250000,
      uploadedAt: new Date().toISOString(),
      contentText: fileMetadata.contentText || `${profile.name} - Professional CV.`
    };

    profile.updatedAt = new Date().toISOString();
    this.updateCandidateProfile(userId, {}); // recalculates completion
    this.save();
    return profile.resume;
  }

  deleteResume(userId) {
    const profile = this.getCandidateProfile(userId);
    profile.resume = null;
    this.updateCandidateProfile(userId, {});
    this.save();
    return true;
  }

  // Candidate Discovery for authorized recruiters
  discoverCandidates({ skills = '', experience = '', location = '', preferredMode = '', q = '' } = {}, requestingRecruiterUserId) {
    // Only candidates who explicitly opted-in (isDiscoverable === true)
    let candidates = this.data.candidateProfiles.filter(c => c.privacy && c.privacy.isDiscoverable === true);

    if (q) {
      const cleanQ = q.toLowerCase();
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(cleanQ) ||
        (c.headline && c.headline.toLowerCase().includes(cleanQ)) ||
        (c.skills && c.skills.some(s => s.name.toLowerCase().includes(cleanQ)))
      );
    }

    if (skills) {
      const skillTokens = skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
      candidates = candidates.filter(c =>
        skillTokens.some(st => c.skills && c.skills.some(cs => cs.name.toLowerCase().includes(st)))
      );
    }

    if (location && location !== 'all') {
      const cleanLoc = location.toLowerCase();
      candidates = candidates.filter(c =>
        (c.location && c.location.toLowerCase().includes(cleanLoc)) ||
        (c.preferredLocations && c.preferredLocations.some(pl => pl.toLowerCase().includes(cleanLoc)))
      );
    }

    if (preferredMode && preferredMode !== 'all') {
      const cleanM = preferredMode.toLowerCase();
      candidates = candidates.filter(c =>
        c.preferredModes && c.preferredModes.some(pm => pm.toLowerCase().includes(cleanM))
      );
    }

    // Mask private contact info if candidate set hideContactInfo === true
    return candidates.map(c => {
      const isContactHidden = Boolean(c.privacy?.hideContactInfo);
      return {
        id: c.id,
        userId: c.userId,
        name: c.name,
        headline: c.headline,
        location: c.location,
        phone: isContactHidden ? 'Contact via Recruiter Request' : c.phone,
        contactEmail: isContactHidden ? 'Contact via HireConnect Message' : c.contactEmail,
        summary: c.summary,
        avatarUrl: c.avatarUrl,
        preferredModes: c.preferredModes,
        preferredLocations: c.preferredLocations,
        desiredTitles: c.desiredTitles,
        expectedSalary: c.expectedSalary,
        noticePeriod: c.noticePeriod,
        skills: c.skills,
        experience: c.experience,
        education: c.education,
        projects: c.projects,
        certifications: c.certifications,
        languages: c.languages,
        hasResume: Boolean(c.resume),
        canDownloadResume: Boolean(c.privacy?.allowResumeDownload),
        completionPercentage: c.completionPercentage
      };
    });
  }

  // Check resume download authorization (Acceptance Test 2)
  canDownloadResume(candidateUserId, requestingUserId, requestingRole) {
    if (!candidateUserId) return false;
    // Candidate can always download their own resume
    if (requestingUserId === candidateUserId) return true;

    // If recruiter, check permissions
    if (requestingRole === 'recruiter') {
      const candidate = this.getCandidateProfile(candidateUserId);
      if (!candidate || !candidate.resume) return false;

      // Check if candidate applied to any of recruiter's company jobs
      const recruiterComp = this.getCompanyForRecruiter(requestingUserId);
      if (recruiterComp) {
        const hasApplication = this.data.applications.some(a => a.candidateId === candidateUserId && a.companyId === recruiterComp.id);
        if (hasApplication) return true;
      }

      // Or if candidate is discoverable AND allowResumeDownload is explicitly true
      if (candidate.privacy?.isDiscoverable === true && candidate.privacy?.allowResumeDownload === true) {
        return true;
      }
    }

    return false;
  }

  // ==================== APPLICATIONS ====================
  applyToJob(jobId, candidateUserId, { coverNote = '', customResumeUrl = '' } = {}) {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.status !== 'published') throw new Error('This job listing is no longer accepting applications.');

    // Check duplicate
    const existing = this.data.applications.find(a => a.jobId === jobId && a.candidateId === candidateUserId);
    if (existing) {
      throw new Error('You have already submitted an application for this position.');
    }

    const candidate = this.getCandidateProfile(candidateUserId);
    const appId = `app-${crypto.randomBytes(6).toString('hex')}`;

    const newApp = {
      id: appId,
      jobId,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.company,
      candidateId: candidateUserId,
      candidateName: candidate.name,
      candidateEmail: candidate.email || candidate.contactEmail,
      candidateHeadline: candidate.headline,
      candidateLocation: candidate.location,
      candidateSkills: candidate.skills ? candidate.skills.map(s => s.name) : [],
      resumeUrl: customResumeUrl || (candidate.resume ? candidate.resume.fileUrl : ''),
      coverNote: coverNote.trim(),
      status: 'applied', // 'applied', 'under_review', 'shortlisted', 'interviewing', 'offered', 'rejected'
      appliedAt: new Date().toISOString(),
      notes: ''
    };

    this.data.applications.unshift(newApp);
    job.applicantCount = (job.applicantCount || 0) + 1;
    this.save();
    return newApp;
  }

  getApplicationsForJob(jobId, recruiterUserId) {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');

    const comp = this.data.companies.find(c => c.id === job.companyId);
    if (!comp || (!comp.authorizedRecruiters.includes(recruiterUserId) && comp.ownerId !== recruiterUserId)) {
      const err = new Error('Unauthorized: You cannot view applications for another company\'s jobs.');
      err.status = 403;
      throw err;
    }

    return this.data.applications.filter(a => a.jobId === jobId);
  }

  getMyApplications(candidateUserId) {
    return this.data.applications.filter(a => a.candidateId === candidateUserId);
  }

  updateApplicationStatus(appId, newStatus, recruiterUserId) {
    const app = this.data.applications.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    const comp = this.data.companies.find(c => c.id === app.companyId);
    if (!comp || (!comp.authorizedRecruiters.includes(recruiterUserId) && comp.ownerId !== recruiterUserId)) {
      const err = new Error('Unauthorized: You cannot manage applicants for this company.');
      err.status = 403;
      throw err;
    }

    const validStatuses = ['applied', 'under_review', 'shortlisted', 'interviewing', 'offered', 'rejected'];
    if (!validStatuses.includes(newStatus)) throw new Error('Invalid application status');

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    this.save();
    return app;
  }

  // ==================== HELPERS ====================
  getCompanyForRecruiter(recruiterUserId) {
    return this.data.companies.find(c =>
      (c.authorizedRecruiters && c.authorizedRecruiters.includes(recruiterUserId)) ||
      c.ownerId === recruiterUserId
    ) || null;
  }

  getRecruiterProfile(userId) {
    let p = this.data.recruiterProfiles.find(r => r.userId === userId);
    const comp = this.getCompanyForRecruiter(userId);
    if (!p) {
      p = {
        userId,
        name: 'Hiring Team',
        email: '',
        title: 'Recruitment Partner',
        phone: '',
        companyId: comp ? comp.id : '',
        permissions: ['job_poster', 'applicant_reviewer']
      };
      this.data.recruiterProfiles.push(p);
      this.save();
    }
    return {
      ...p,
      company: comp,
      activity: this.getRecruiterActivity(userId)
    };
  }

  updateRecruiterProfile(userId, updateData) {
    let p = this.data.recruiterProfiles.find(r => r.userId === userId);
    if (!p) {
      this.getRecruiterProfile(userId);
      p = this.data.recruiterProfiles.find(r => r.userId === userId);
    }
    const allowed = ['name', 'title', 'phone', 'linkedin', 'bio', 'avatarUrl'];
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        p[key] = updateData[key];
      }
    }
    p.updatedAt = new Date().toISOString();
    this.save();
    return this.getRecruiterProfile(userId);
  }

  getRecruiterActivity(userId) {
    const comp = this.getCompanyForRecruiter(userId);
    const jobs = comp ? this.data.jobs.filter(j => j.companyId === comp.id) : [];
    const activeJobs = jobs.filter(j => j.status === 'published');
    const jobIds = jobs.map(j => j.id);
    const applications = this.data.applications.filter(a => jobIds.includes(a.jobId));
    const interviews = applications.filter(a => a.status === 'interviewing' || a.status === 'offered');
    
    return {
      totalJobsPosted: jobs.length,
      activeJobsCount: activeJobs.length,
      totalApplications: applications.length,
      reviewedApplications: applications.filter(a => a.status !== 'applied').length,
      interviewsScheduled: interviews.length
    };
  }

  getUserSettings(userId, role = 'employee') {
    if (!this.data.userSettings) this.data.userSettings = [];
    let s = this.data.userSettings.find(item => item.userId === userId);
    if (!s) {
      s = {
        userId,
        role,
        emailVerified: true,
        connectedGoogle: false,
        notifications: {
          applicationUpdates: true,
          recruiterMessages: true,
          weeklyJobMatches: true,
          marketingAnnouncements: false
        },
        privacy: {
          profileDiscoverable: role === 'recruiter' ? true : false,
          allowResumeDownload: true,
          hideDirectContact: false
        },
        updatedAt: new Date().toISOString()
      };
      this.data.userSettings.push(s);
      this.save();
    }
    return s;
  }

  updateUserSettings(userId, updates) {
    const s = this.getUserSettings(userId);
    if (updates.notifications) {
      s.notifications = { ...s.notifications, ...updates.notifications };
    }
    if (updates.privacy) {
      s.privacy = { ...s.privacy, ...updates.privacy };
      // Sync candidate profile privacy if candidate
      const cand = this.data.candidateProfiles.find(c => c.userId === userId);
      if (cand) {
        cand.privacy = {
          isDiscoverable: s.privacy.profileDiscoverable,
          allowResumeDownload: s.privacy.allowResumeDownload,
          hideContactInfo: s.privacy.hideDirectContact
        };
      }
    }
    s.updatedAt = new Date().toISOString();
    this.save();
    return s;
  }
  // ==================== SAVED JOBS & SHORTLISTING ====================
  toggleSavedJob(userId, jobId) {
    if (!this.data.savedJobs) this.data.savedJobs = {};
    if (!this.data.savedJobs[userId]) this.data.savedJobs[userId] = [];
    const idx = this.data.savedJobs[userId].indexOf(jobId);
    let isSaved = false;
    if (idx > -1) {
      this.data.savedJobs[userId].splice(idx, 1);
      isSaved = false;
    } else {
      this.data.savedJobs[userId].push(jobId);
      isSaved = true;
    }
    this.save();
    return { success: true, isSaved, savedCount: this.data.savedJobs[userId].length };
  }

  getSavedJobs(userId) {
    if (!this.data.savedJobs) this.data.savedJobs = {};
    const ids = this.data.savedJobs[userId] || [];
    return (this.data.jobs || []).filter(j => ids.includes(j.id) && j.status !== 'closed');
  }

  toggleShortlistCandidate(recruiterId, candidateId, jobId, notes = '') {
    if (!this.data.shortlistedCandidates) this.data.shortlistedCandidates = [];
    const idx = this.data.shortlistedCandidates.findIndex(s => s.recruiterId === recruiterId && s.candidateId === candidateId && s.jobId === jobId);
    let isShortlisted = false;
    if (idx > -1) {
      this.data.shortlistedCandidates.splice(idx, 1);
      isShortlisted = false;
    } else {
      this.data.shortlistedCandidates.push({
        id: `shortlist-${crypto.randomBytes(6).toString('hex')}`,
        recruiterId,
        candidateId,
        jobId,
        notes,
        createdAt: new Date().toISOString()
      });
      isShortlisted = true;
    }
    this.save();
    return { success: true, isShortlisted };
  }

  getShortlistedCandidates(recruiterId, jobId = null) {
    if (!this.data.shortlistedCandidates) this.data.shortlistedCandidates = [];
    let list = this.data.shortlistedCandidates.filter(s => s.recruiterId === recruiterId);
    if (jobId) {
      list = list.filter(s => s.jobId === jobId);
    }
    return list;
  }

  // ==================== TALENT MATCH ENGINE ====================
  getJobMatchesForCandidate(userId, filters = {}) {
    const candidate = this.data.candidateProfiles.find(c => c.userId === userId || c.id === userId);
    if (!candidate) {
      return { success: false, status: 404, message: 'Candidate profile not found.' };
    }

    // Extract normalized candidate skills
    const candSkills = (candidate.skills || []).map(s => {
      const name = typeof s === 'string' ? s : s.name;
      return String(name || '').toLowerCase().trim();
    });

    // Approximate years of experience
    let candYears = 3;
    if (candidate.experience && candidate.experience.length > 0) {
      candYears = candidate.experience.reduce((acc, exp) => {
        const start = new Date(exp.startDate || '2022-01').getTime();
        const end = exp.current || exp.endDate === 'Present' ? Date.now() : new Date(exp.endDate || '2023-01').getTime();
        const diff = Math.max(0.5, (end - start) / (365.25 * 24 * 3600 * 1000));
        return acc + diff;
      }, 0);
      candYears = Math.round(candYears * 10) / 10;
    }

    const savedJobIds = this.data.savedJobs && this.data.savedJobs[userId] ? this.data.savedJobs[userId] : [];

    // Filter published jobs only
    const activeJobs = (this.data.jobs || []).filter(j => j.status === 'published' || !j.status);

    const matches = activeJobs.map(job => {
      const jobSkills = (job.skills || []).map(s => String(s).toLowerCase().trim());
      const matchedSkills = [];
      const missingSkills = [];

      jobSkills.forEach(js => {
        const hasSkill = candSkills.some(cs => cs.includes(js) || js.includes(cs));
        if (hasSkill) {
          matchedSkills.push(js);
        } else {
          missingSkills.push(js);
        }
      });

      // 1. Skill Score (50%)
      const skillScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 75;

      // 2. Experience Score (25%)
      let minExp = 2;
      let maxExp = 6;
      if (job.experience) {
        const parts = job.experience.match(/\d+/g);
        if (parts && parts.length >= 2) {
          minExp = parseInt(parts[0], 10);
          maxExp = parseInt(parts[1], 10);
        } else if (parts && parts.length === 1) {
          minExp = parseInt(parts[0], 10);
          maxExp = minExp + 3;
        }
      }

      let expScore = 100;
      if (candYears < minExp) {
        expScore = Math.max(40, 100 - (minExp - candYears) * 20);
      } else if (candYears > maxExp + 3) {
        expScore = 85; // Slightly overqualified
      }

      // 3. Location Score (15%)
      const isRemoteJob = (job.workMode || '').toLowerCase() === 'remote' || (job.location || '').toLowerCase().includes('remote');
      const candWantsRemote = (candidate.preferredModes || []).some(m => m.toLowerCase() === 'remote');
      const locMatch = (candidate.preferredLocations || []).some(l => (job.location || '').toLowerCase().includes(l.toLowerCase().split(',')[0]));
      
      let locScore = 60;
      if (isRemoteJob || (candWantsRemote && isRemoteJob)) {
        locScore = 100;
      } else if (locMatch) {
        locScore = 100;
      } else if ((candidate.preferredLocations || []).length === 0) {
        locScore = 80;
      }

      // 4. Work Mode Score (10%)
      let modeScore = 65;
      const jobMode = (job.workMode || 'Hybrid').toLowerCase();
      if ((candidate.preferredModes || []).some(m => m.toLowerCase() === jobMode)) {
        modeScore = 100;
      } else if (isRemoteJob && candWantsRemote) {
        modeScore = 100;
      }

      // Transparent weighted score calculation
      const overallScore = Math.min(99, Math.max(50, Math.round(
        (skillScore * 0.50) +
        (expScore * 0.25) +
        (locScore * 0.15) +
        (modeScore * 0.10)
      )));

      // Generate explainable breakdown
      const breakdown = {
        skills: {
          score: skillScore,
          matchedCount: matchedSkills.length,
          totalRequired: jobSkills.length,
          matched: matchedSkills,
          missing: missingSkills,
          weight: '50%'
        },
        experience: {
          score: expScore,
          candidateYears: candYears,
          requiredRange: job.experience || `${minExp}-${maxExp} Years`,
          meetsRequirement: candYears >= minExp,
          weight: '25%'
        },
        location: {
          score: locScore,
          jobLocation: job.location,
          isRemote: isRemoteJob,
          weight: '15%'
        },
        workMode: {
          score: modeScore,
          jobWorkMode: job.workMode,
          weight: '10%'
        }
      };

      const reasons = [];
      if (matchedSkills.length > 0) {
        reasons.push(`${matchedSkills.length} of ${jobSkills.length} required skills matched (${matchedSkills.slice(0, 3).join(', ')})`);
      }
      if (candYears >= minExp) {
        reasons.push(`Experience: ${candYears} yrs satisfies requirement (${job.experience || `${minExp}-${maxExp} yrs`})`);
      }
      if (isRemoteJob || locMatch) {
        reasons.push(`Location preference compatible (${job.location})`);
      }

      return {
        job,
        matchScore: overallScore,
        scoringFormula: 'Skills (50%) + Experience (25%) + Location (15%) + Work Mode (10%)',
        breakdown,
        reasons,
        missingSkills,
        matchedSkills,
        isSaved: savedJobIds.includes(job.id)
      };
    });

    // Apply query filters
    let filtered = matches;
    if (filters.workMode && filters.workMode !== 'all') {
      filtered = filtered.filter(m => (m.job.workMode || '').toLowerCase() === filters.workMode.toLowerCase());
    }
    if (filters.minScore) {
      const min = parseInt(filters.minScore, 10);
      filtered = filtered.filter(m => m.matchScore >= min);
    }
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(m => (m.job.location || '').toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.savedOnly === 'true' || filters.savedOnly === true) {
      filtered = filtered.filter(m => m.isSaved);
    }

    // Sort by match score descending
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        headline: candidate.headline,
        skills: candidate.skills,
        yearsOfExperience: candYears
      },
      totalMatches: filtered.length,
      matches: filtered.slice(0, 50)
    };
  }

  getCandidateMatchesForJob(jobId, recruiterUserId, filters = {}) {
    const recruiter = this.data.recruiterProfiles.find(r => r.userId === recruiterUserId);
    if (!recruiter) {
      return { success: false, status: 403, message: 'Only authorized recruiters can access candidate talent matching.' };
    }

    const job = (this.data.jobs || []).find(j => j.id === jobId);
    if (!job) {
      return { success: false, status: 404, message: 'Job opening not found.' };
    }

    // Recruiter authorization check
    const company = (this.data.companies || []).find(c => c.id === recruiter.companyId);
    if (company && job.company.toLowerCase() !== company.name.toLowerCase() && job.companyId !== company.id) {
      return { success: false, status: 403, message: 'You are only authorized to view candidate matches for your own company.' };
    }

    const jobSkills = (job.skills || []).map(s => String(s).toLowerCase().trim());
    let minExp = 2;
    let maxExp = 6;
    if (job.experience) {
      const parts = job.experience.match(/\d+/g);
      if (parts && parts.length >= 2) {
        minExp = parseInt(parts[0], 10);
        maxExp = parseInt(parts[1], 10);
      }
    }

    const shortlisted = (this.data.shortlistedCandidates || []).filter(s => s.recruiterId === recruiterUserId && s.jobId === jobId);
    const shortlistedCandIds = shortlisted.map(s => s.candidateId);

    // Candidates: strictly discoverable candidates only (Respect candidate privacy)
    const discoverableCandidates = (this.data.candidateProfiles || []).filter(c => {
      if (c.privacy && c.privacy.isDiscoverable === false) return false;
      return true;
    });

    const candidateMatches = discoverableCandidates.map(cand => {
      const candSkills = (cand.skills || []).map(s => {
        const name = typeof s === 'string' ? s : s.name;
        return String(name || '').toLowerCase().trim();
      });

      const matchedSkills = [];
      const missingSkills = [];

      jobSkills.forEach(js => {
        const hasSkill = candSkills.some(cs => cs.includes(js) || js.includes(cs));
        if (hasSkill) {
          matchedSkills.push(js);
        } else {
          missingSkills.push(js);
        }
      });

      const skillScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 75;

      let candYears = 3;
      if (cand.experience && cand.experience.length > 0) {
        candYears = cand.experience.reduce((acc, exp) => {
          const start = new Date(exp.startDate || '2022-01').getTime();
          const end = exp.current || exp.endDate === 'Present' ? Date.now() : new Date(exp.endDate || '2023-01').getTime();
          return acc + Math.max(0.5, (end - start) / (365.25 * 24 * 3600 * 1000));
        }, 0);
        candYears = Math.round(candYears * 10) / 10;
      }

      let expScore = 100;
      if (candYears < minExp) {
        expScore = Math.max(40, 100 - (minExp - candYears) * 20);
      } else if (candYears > maxExp + 3) {
        expScore = 85;
      }

      const isRemoteJob = (job.workMode || '').toLowerCase() === 'remote';
      const locMatch = (cand.preferredLocations || []).some(l => (job.location || '').toLowerCase().includes(l.toLowerCase().split(',')[0]));
      const locScore = isRemoteJob || locMatch ? 100 : 65;

      const jobMode = (job.workMode || 'Hybrid').toLowerCase();
      const modeScore = (cand.preferredModes || []).some(m => m.toLowerCase() === jobMode) ? 100 : 70;

      const overallScore = Math.min(99, Math.max(50, Math.round(
        (skillScore * 0.50) +
        (expScore * 0.25) +
        (locScore * 0.15) +
        (modeScore * 0.10)
      )));

      const isShortlisted = shortlistedCandIds.includes(cand.userId || cand.id);

      // Mask sensitive contact details if candidate prefers
      const hideContact = cand.privacy && cand.privacy.hideContactInfo;

      return {
        candidateId: cand.userId || cand.id,
        name: cand.name,
        headline: cand.headline,
        summary: cand.summary,
        avatarUrl: cand.avatarUrl || '',
        experienceYears: candYears,
        skills: cand.skills,
        matchedSkills,
        missingSkills,
        preferredLocations: cand.preferredLocations,
        preferredModes: cand.preferredModes,
        portfolio: cand.projects || [],
        matchScore: overallScore,
        breakdown: {
          skills: { score: skillScore, matched: matchedSkills, missing: missingSkills },
          experience: { score: expScore, candidateYears: candYears, requiredRange: job.experience || `${minExp}-${maxExp} Years` },
          location: { score: locScore, locationMatch: locMatch || isRemoteJob }
        },
        reasons: [
          `${matchedSkills.length} of ${jobSkills.length} required skills matched (${matchedSkills.slice(0, 3).join(', ')})`,
          `Experience: ${candYears} years aligns with ${job.experience || 'job requirement'}`
        ],
        isShortlisted,
        contactProtected: hideContact
      };
    });

    // Apply minScore filter
    let filtered = candidateMatches;
    if (filters.minScore) {
      const min = parseInt(filters.minScore, 10);
      filtered = filtered.filter(c => c.matchScore >= min);
    }
    if (filters.shortlistedOnly === 'true' || filters.shortlistedOnly === true) {
      filtered = filtered.filter(c => c.isShortlisted);
    }

    filtered.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        workMode: job.workMode,
        skills: job.skills,
        experience: job.experience
      },
      totalMatches: filtered.length,
      matches: filtered
    };
  }

  // ==================== MEETING BOOKING & CALENDAR SYSTEM ====================
  getAvailableSlots(date, timezone = 'Asia/Kolkata', purpose = 'General HireConnect enquiry') {
    if (!date) {
      return { available: false, slots: [], reason: 'Date parameter is required.' };
    }

    const targetDate = new Date(date + 'T00:00:00Z');
    const dayOfWeek = targetDate.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { available: false, slots: [], reason: 'HireConnect meetings are scheduled Monday through Friday.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return { available: false, slots: [], reason: 'Past dates are not available for booking.' };
    }

    const standardSlots = [
      '09:00 AM - 09:15 AM',
      '09:30 AM - 09:45 AM',
      '10:00 AM - 10:15 AM',
      '10:30 AM - 10:45 AM',
      '11:00 AM - 11:15 AM',
      '11:30 AM - 11:45 AM',
      '02:00 PM - 02:15 PM',
      '02:30 PM - 02:45 PM',
      '03:00 PM - 03:15 PM',
      '03:30 PM - 03:45 PM',
      '04:00 PM - 04:15 PM',
      '04:30 PM - 04:45 PM'
    ];

    if (!this.data.meetings) this.data.meetings = [];
    const bookedOnDate = this.data.meetings
      .filter(m => m.date === date && m.status === 'confirmed')
      .map(m => m.timeSlot);

    const availableSlots = standardSlots.filter(s => !bookedOnDate.includes(s));

    const team = this.data.teamMembers && this.data.teamMembers.length > 0 ? this.data.teamMembers : generateSeedTeamMembers();
    const host = team.find(t => t.specialties && t.specialties.includes(purpose)) || team[0];

    return {
      available: availableSlots.length > 0,
      date,
      timezone: timezone || 'Asia/Kolkata',
      slots: availableSlots,
      bookedSlots: bookedOnDate,
      assignedHost: {
        id: host.id,
        name: host.name,
        role: host.role,
        email: host.email
      }
    };
  }

  async createMeeting(bookingData) {
    if (!this.data.meetings) this.data.meetings = [];
    const { name, email, phone, company, purpose, date, timeSlot, timezone, format, agenda } = bookingData;

    if (!name || !email || !purpose || !date || !timeSlot) {
      return { success: false, status: 400, message: 'Please provide all required fields (Name, Email, Purpose, Date, and Time Slot).' };
    }

    // Check slot conflict
    const existing = this.data.meetings.find(m => m.date === date && m.timeSlot === timeSlot && m.status === 'confirmed');
    if (existing) {
      return {
        success: false,
        status: 409,
        message: 'This time slot is already booked. Please choose another available slot.'
      };
    }

    const team = this.data.teamMembers && this.data.teamMembers.length > 0 ? this.data.teamMembers : generateSeedTeamMembers();
    const host = team.find(t => t.specialties && t.specialties.includes(purpose)) || team[0];
    const reference = `HC-MEET-${Math.floor(100000 + Math.random() * 900000)}`;

    const meeting = {
      id: `meet-${crypto.randomBytes(6).toString('hex')}`,
      reference,
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      purpose,
      date,
      timeSlot,
      timezone: timezone || 'Asia/Kolkata',
      format: format || 'Video Call (Google Meet)',
      agenda: String(agenda || '').trim(),
      durationMinutes: 30,
      hostId: host.id,
      hostName: host.name,
      hostRole: host.role,
      hostEmail: host.email,
      videoUrl: `https://meet.hireconnect.io/room-${reference.toLowerCase()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.meetings.unshift(meeting);
    this.save();

    // Trigger transactional email notification
    let emailResult = null;
    try {
      const emailService = require('./emailService');
      emailResult = await emailService.sendMeetingConfirmation(meeting);
    } catch (e) {
      console.warn('[DbService] Email confirmation error:', e.message);
    }

    return {
      success: true,
      status: 201,
      message: 'Meeting successfully booked! Confirmation email has been sent.',
      meeting,
      emailDelivery: emailResult
    };
  }

  getMeetings(filters = {}) {
    if (!this.data.meetings) this.data.meetings = [];
    let list = [...this.data.meetings];
    if (filters.status) {
      list = list.filter(m => m.status === filters.status);
    }
    if (filters.email) {
      list = list.filter(m => m.email.toLowerCase() === filters.email.toLowerCase().trim());
    }
    return list;
  }

  cancelMeeting(reference, reason = '') {
    if (!this.data.meetings) this.data.meetings = [];
    const meeting = this.data.meetings.find(m => m.reference === reference);
    if (!meeting) {
      return { success: false, status: 404, message: 'Meeting booking not found.' };
    }
    meeting.status = 'cancelled';
    meeting.cancelReason = reason;
    meeting.updatedAt = new Date().toISOString();
    this.save();
    return { success: true, status: 200, message: 'Meeting successfully cancelled.', meeting };
  }

  rescheduleMeeting(reference, newDate, newSlot) {
    if (!this.data.meetings) this.data.meetings = [];
    const meeting = this.data.meetings.find(m => m.reference === reference);
    if (!meeting) {
      return { success: false, status: 404, message: 'Meeting booking not found.' };
    }

    // Check conflict for new slot
    const conflict = this.data.meetings.find(m => m.reference !== reference && m.date === newDate && m.timeSlot === newSlot && m.status === 'confirmed');
    if (conflict) {
      return { success: false, status: 409, message: 'The requested new time slot is already booked.' };
    }

    meeting.date = newDate;
    meeting.timeSlot = newSlot;
    meeting.status = 'rescheduled';
    meeting.updatedAt = new Date().toISOString();
    this.save();
    return { success: true, status: 200, message: 'Meeting successfully rescheduled.', meeting };
  }
}

const db = new DbService();
module.exports = db;
