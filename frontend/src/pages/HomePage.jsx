import { Link, useNavigate } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import Navbar from '../components/Navbar'

const stats = [
  { value: '25+', label: 'Practical Modules', icon: '📚' },
  { value: '12+', label: 'Live Projects', icon: '💻' },
  { value: '1:1', label: 'Mentor Support', icon: '🎯' },
  { value: '100%', label: 'Career Focused', icon: '🚀' },
]

const courses = [
  {
    icon: '⚛️',
    name: 'React Frontend Development',
    level: 'Beginner to Advanced',
    desc: 'Learn components, hooks, routing, API calls, forms, Redux basics, and build modern UI projects.',
    topics: ['React Hooks', 'API Integration', 'Projects'],
  },
  {
    icon: '☕',
    name: 'Java Spring Boot Backend',
    level: 'Job Ready Track',
    desc: 'Master REST APIs, Spring Security, JWT, MySQL, JPA, role-based access, and deployment basics.',
    topics: ['REST API', 'JWT Auth', 'MySQL'],
  },
  {
    icon: '🐍',
    name: 'Python + AI Projects',
    level: 'Modern AI Skills',
    desc: 'Build FastAPI apps, AI chatbots, automation tools, and learn NumPy, pandas, and API integration.',
    topics: ['FastAPI', 'Chatbot', 'Pandas'],
  },
  {
    icon: '🧩',
    name: 'DSA & Interview Prep',
    level: 'Placement Focused',
    desc: 'Practice arrays, strings, maps, recursion, sorting, searching, and important interview patterns.',
    topics: ['DSA Patterns', 'Aptitude', 'Mock Q&A'],
  },
  {
    icon: '🌐',
    name: 'Full Stack Development',
    level: 'Complete Path',
    desc: 'Build complete applications using React, Spring Boot, MySQL, JWT authentication, Docker, and AWS.',
    topics: ['Frontend', 'Backend', 'Deployment'],
  },
  {
    icon: '☁️',
    name: 'DevOps & Cloud Basics',
    level: 'Deployment Ready',
    desc: 'Learn GitHub, Docker, Docker Compose, EC2 deployment, environment variables, and production basics.',
    topics: ['GitHub', 'Docker', 'AWS EC2'],
  },
]

const learningSteps = [
  {
    title: 'Choose your course',
    desc: 'Pick Java, React, Python, Full Stack, DSA, or cloud tracks based on your goal.',
  },
  {
    title: 'Learn with practical projects',
    desc: 'Build real applications instead of only reading theory.',
  },
  {
    title: 'Get mentor guidance',
    desc: 'Clear doubts, improve code, and understand industry-style project flow.',
  },
  {
    title: 'Build portfolio & confidence',
    desc: 'Complete projects, prepare for interviews, and showcase your verified skills.',
  },
]

const features = [
  {
    icon: '🧑‍🏫',
    title: 'Beginner Friendly Teaching',
    desc: 'Every topic is explained from basic level with examples, diagrams, and real project use cases.',
  },
  {
    icon: '🛠️',
    title: 'Project Based Learning',
    desc: 'Students learn by creating apps like Todo, Auth System, Chatbot, Certificate System, and APIs.',
  },
  {
    icon: '📄',
    title: 'Verified Certificates',
    desc: 'After course completion, students can receive a verified certificate with serial number.',
  },
  {
    icon: '💼',
    title: 'Career Preparation',
    desc: 'Interview questions, resume projects, GitHub guidance, deployment, and practical coding confidence.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <Navbar />

      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_60%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="container-pro grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-gold-400">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              Satya Tech Academy
            </div>

            <h1 className="font-cinzel text-4xl font-extrabold leading-tight text-[#fefce8] sm:text-5xl lg:text-7xl">
              Learn Coding From Basic To
              <span className="text-gradient-gold block">Job Ready Level.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Satya Tech Academy helps students learn Java, Spring Boot, React,
              Python, DSA, AI projects, Docker, and deployment with practical
              guidance and real project-based learning.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/register')} className="btn-primary">
                Enroll as Student
              </button>

              <a href="#courses" className="btn-secondary">
                Explore Courses
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>✅ Live project practice</span>
              <span>✅ Doubt support</span>
              <span>✅ Verified certificate</span>
            </div>
          </div>

          <div className="card-pro p-6">
            <div className="rounded-3xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-indigo-500/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[3px] text-gold-400">
                Student Learning Path
              </p>

              <div className="mt-6 space-y-4">
                {learningSteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl bg-black/20 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm font-extrabold text-black">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-slate-100">{step.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pro pb-16">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-black/20 p-5 text-center">
              <div className="text-3xl">{stat.icon}</div>
              <div className="mt-2 font-cinzel text-2xl font-extrabold text-gold-400">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="courses" className="container-pro py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
            Our Courses
          </p>
          <h2 className="mt-3 font-cinzel text-3xl font-extrabold text-[#fefce8] sm:text-4xl">
            Learn Skills That Students Actually Need
          </h2>
          <p className="mt-4 text-slate-400">
            Choose a focused course and start building projects that improve your
            confidence, portfolio, and interview preparation.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.name}
              className="card-pro flex flex-col p-6 transition hover:-translate-y-1 hover:border-gold-500/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-4xl">{course.icon}</div>
                <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-400">
                  {course.level}
                </span>
              </div>

              <h3 className="mt-5 font-cinzel text-lg font-bold text-white">
                {course.name}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                {course.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {course.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <Link to="/register" className="mt-5 inline-block text-sm font-bold text-gold-400">
                Enroll now →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16">
        <div className="container-pro">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
              Why Students Choose STA
            </p>
            <h2 className="mt-3 font-cinzel text-3xl font-extrabold text-[#fefce8]">
              Simple teaching, strong projects, and career direction.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="card-pro p-6">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-5 font-cinzel text-base font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pro py-16">
        <div className="grid items-center gap-8 rounded-3xl border border-gold-500/20 bg-gold-500/[0.06] p-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] text-gold-400">
              Start Learning Today
            </p>
            <h2 className="mt-3 font-cinzel text-3xl font-extrabold text-[#fefce8]">
              Build your coding career with practical guidance.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              Register as a student, choose your course, and begin your learning
              journey with Satya Tech Academy.
            </p>
          </div>

          <button onClick={() => navigate('/register')} className="btn-primary whitespace-nowrap">
            Join Academy
          </button>
        </div>
      </section>

      <footer className="container-pro py-10 text-center text-sm text-slate-500">
        © 2026 Satya Tech Academy. Learn · Build · Grow · Succeed.
      </footer>

      <Chatbot />
    </div>
  )
}
