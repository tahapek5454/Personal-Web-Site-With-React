export type Locale = 'tr' | 'en'

export interface ExperienceEntry {
    id: number
    title: string
    company: string
    period: string
    logo: string
    description: string
    skills: string[]
}

export interface Dict {
    htmlLang: string
    ogLocale: string
    meta: {
        title: string
        description: string
        jobTitle: string
        schemaDescription: string
        keywords: string[]
    }
    ids: { about: string; experience: string; skills: string; projects: string }
    nav: {
        about: string
        experience: string
        skills: string
        projects: string
        blog: string
        contact: string
        menu: string
        skip: string
        homeLabel: string
        switchLanguage: string
    }
    header: {
        greeting: string
        role: string
        bio: string[]
        viewProjects: string
        getInTouch: string
        cv: string
        linkedinLabel: string
        githubLabel: string
        instagramLabel: string
        photoAlt: string
    }
    about: {
        title: string
        cardTitle: string
        paragraphs: string[]
        stats: { value: string; label: string }[]
        expertiseTitle: string
        expertise: { icon: string; title: string; description: string }[]
        quote: string
    }
    experience: {
        title: string
        subtitle: string
        items: ExperienceEntry[]
    }
    abilities: {
        title: string
        items: { title: string; description: string }[]
        photoAlt: string
    }
    ai: {
        title: string
        intro: string
        portraitAlt: string
        gptAlt: string
        claudeAlt: string
        logosLabel: string
        topics: { title: string; description: string }[]
    }
    projects: {
        title: string
        subtitle: string
        featured: string
        viewOnGithub: string
        viewDetails: string
        moreTitle: string
        moreText: string
        visitGithub: string
        githubLabel: (name: string) => string
    }
    projectPage: {
        home: string
        projects: string
        back: string
        technologies: string
        source: string
        otherProjects: string
        githubCta: string
    }
    footer: {
        quickLinks: string
        links: string
        role: string
        location: string
        rights: string
        cv: string
        contact: string
    }
    blog: {
        title: string
        subtitle: string
        metaTitle: string
        metaDescription: string
        allTopics: string
        topicsLabel: string
        tagsLabel: string
        searchLabel: string
        searchPlaceholder: string
        searchLoading: string
        noResults: string
        /** `{n}` is replaced with the result count. */
        resultsCount: string
        clearFilters: string
        /** `{n}` is replaced with minutes. */
        readingTime: string
        latestTitle: string
        latestSubtitle: string
        viewAll: string
        emptyTitle: string
        emptyText: string
        paginationLabel: string
        prev: string
        next: string
        pageTitle: (page: number) => string
        tocTitle: string
        updatedOn: string
        backToBlog: string
        topic: string
        rss: string
        topicTitle: (topic: string) => string
        topicDescription: (topic: string) => string
        breadcrumb: string
    }
    notFound: { title: string; text: string; home: string }
    mail: { subject: string; body: string }
}

const sharedSkills = ['.NET', 'Nuxt.js', 'Next.js', 'AI Integration', 'Vue', 'MSSQL', 'PostgreSQL', 'Kubernetes', 'Docker']

export const dictionaries: Record<Locale, Dict> = {
    tr: {
        htmlLang: 'tr',
        ogLocale: 'tr_TR',
        meta: {
            title: 'Taha Pek - Software Developer',
            description:
                'Full Stack Developer Taha Pek. .NET, Nuxt.js, Next.js, Vue.js ile modern web uygulamaları geliştiriyorum. Portfolio, projeler ve iletişim.',
            jobTitle: 'Specialist Software Developer',
            schemaDescription:
                'Full Stack Software Developer: .NET, Nuxt.js, React, Next.js ve Vue.js ile web uygulamaları ve yapay zeka destekli sistemler geliştiriyor.',
            keywords: [
                'Taha Pek', 'Software Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
                '.NET Developer', 'React Developer', 'Next.js Developer', 'Vue.js Developer', 'Nuxt.js Developer',
                'C# Developer', 'TypeScript Developer', 'Kocaeli Üniversitesi', 'Bilgisayar Mühendisliği', 'Portfolio', 'CV',
            ],
        },
        ids: { about: 'hakkimda', experience: 'tecrubeler', skills: 'kabiliyetler', projects: 'projeler' },
        nav: {
            about: 'HAKKIMDA',
            experience: 'TECRÜBELERİM',
            skills: 'KABİLİYETLERİM',
            projects: 'PROJELER',
            blog: 'BLOG',
            contact: 'İLETİŞİM',
            menu: 'Menü',
            skip: 'Ana içeriğe geç',
            homeLabel: 'Taha Pek ana sayfa',
            switchLanguage: 'Siteyi İngilizce görüntüle',
        },
        header: {
            greeting: 'Merhaba, Ben Taha Pek',
            role: 'Specialist Software Developer',
            bio: [
                "09.08.2002 Sakarya' da doğdum.",
                'Kocaeli Üniversitesi Bilgisayar Mühendisliği mezunuyum.',
                'Aktif olarak Doğuş Teknoloji şirketinde Specialist Software Developer olarak görev almaktayım.',
            ],
            viewProjects: 'Projelerimi İncele',
            getInTouch: 'İletişime Geç',
            cv: 'CV’yi Görüntüle',
            linkedinLabel: 'LinkedIn profilimi ziyaret edin',
            githubLabel: 'GitHub profilimi ziyaret edin',
            instagramLabel: 'Instagram profilimi ziyaret edin',
            photoAlt: 'Taha Pek portre fotoğrafı',
        },
        about: {
            title: 'Hakkımda',
            cardTitle: 'Full Stack Developer',
            paragraphs: [
                'Dinamik ve sonuç odaklı bir yazılım geliştirici olarak, hem backend hem de frontend alanlarında deneyime sahibim.',
                'Projelerimi bulut tabanlı ortamlara başarıyla entegre ederken, Kubernetes gibi containerization teknolojilerini etkin bir şekilde kullanıyorum.',
                'Yapay zeka alanında da aktif çalışmalar yürütüyor; LangChain ve LangGraph gibi modern frameworkleri kullanarak karmaşık LLM orkestrasyon mimarileri tasarlıyorum.',
                'DevOps prensiplerine olan ilgim sayesinde, geliştirme ve operasyon ekipleri arasında köprü kurarak, hızlı ve güvenilir teslimatlar gerçekleştiriyorum.',
            ],
            stats: [
                { value: '3+', label: 'Yıl Deneyim' },
                { value: '60+', label: 'Tamamlanan Proje' },
                { value: '15+', label: 'Teknoloji Stack' },
                { value: '24/7', label: 'Öğrenme Tutkusu' },
            ],
            expertiseTitle: 'Uzmanlık Alanlarım',
            expertise: [
                { icon: '💻', title: 'Full Stack Development', description: 'Backend ve frontend alanlarında kapsamlı deneyim' },
                { icon: '🤖', title: 'AI & LLM Orchestration', description: 'LangChain ve LangGraph ile akıllı agent sistemleri ve LLM orkestrasyon mimarileri' },
                { icon: '☁️', title: 'Cloud & DevOps', description: 'Kubernetes, CI/CD ve bulut tabanlı çözümler' },
                { icon: '🚀', title: 'Agile & Team Leadership', description: 'Ekip çalışması ve esnek geliştirme metodolojileri' },
                { icon: '🎯', title: 'Problem Solving', description: 'Karmaşık problemler için yenilikçi çözümler' },
            ],
            quote:
                'Agile prensiplerini benimseyerek, ekip çalışmasını ve esnekliği ön planda tutuyor, sürekli öğrenmeye ve yenilikçi çözümler geliştirmeye olan tutkumla, karmaşık problemleri çözmek için etkili yaklaşımlar geliştiriyorum.',
        },
        experience: {
            title: 'Tecrübelerim',
            subtitle: 'Eğitimden profesyonel kariyere uzanan yolculuğumda edindiğim deneyimler',
            items: [
                { id: 5, title: 'Specialist Software Developer', company: 'Doğuş Teknoloji', period: 'Nis 2026 - Devam Ediyor', logo: '/logos/dt-logo.svg', description: 'Profesyonel yazılım geliştirme projelerinde aktif rol alıyorum.', skills: sharedSkills },
                { id: 4, title: 'Software Developer', company: 'Doğuş Teknoloji', period: 'Şub 2024 - Nis 2026', logo: '/logos/dt-logo.svg', description: 'Profesyonel yazılım geliştirme projelerinde aktif rol alıyorum.', skills: sharedSkills },
                { id: 3, title: 'Software Developer Intern', company: 'Doğuş Teknoloji', period: 'Tem 2023 - Şub 2024', logo: '/logos/dt-logo.svg', description: 'Backend ve frontend geliştirme süreçlerinde kapsamlı deneyim edindim.', skills: sharedSkills },
                { id: 2, title: 'Software Developer Intern', company: 'Nacsoft', period: 'Kas 2022 - Ara 2022', logo: '/logos/nacsoft.png', description: 'Backend ve frontend geliştirme süreçlerinde kapsamlı deneyim edindim.', skills: ['.Net', 'ASP.NET Core', 'C#', 'SQL Server', 'Entity Framework', 'HTML', 'CSS', 'JavaScript'] },
                { id: 1, title: 'Bilgisayar Mühendisliği', company: 'Kocaeli Üniversitesi', period: 'Eyl 2020 - Haz 2024', logo: '/logos/kou.svg', description: 'Yazılım geliştirme, algoritma ve veri yapıları konularında derinlemesine eğitim aldım.', skills: ['Algoritma', 'Veri Yapıları', 'Yazılım Mühendisliği', 'Yapay zeka', 'Makine Öğrenimi'] },
            ],
        },
        abilities: {
            title: 'Kabiliyetlerim',
            photoAlt: 'Taha Pek çalışırken',
            items: [
                { title: 'Yazılım Geliştirme', description: 'Modern web teknolojileri ile performanslı uygulamalar geliştiriyorum. Next.js, Nuxt.js, .NET Core ve WebAPI uzmanım.' },
                { title: 'Yazılım Mimarisi', description: 'SOLID, Clean Code, Clean Architecture ve Microservice yaklaşımları ile tasarım patterns uygularım.' },
                { title: 'Yapay Zeka', description: 'LangChain ve LangGraph frameworkleri ile karmaşık LLM orkestrasyon mimarileri geliştiriyorum. Büyük dil modellerini iş süreçlerine entegre eden akıllı agent sistemleri ve çok adımlı akışlar tasarlıyorum.' },
                { title: 'Problem Çözme', description: 'Karmaşık problemleri analiz ederek etkili çözümler üretiyorum. Algoritma tasarımı ve optimizasyon konularında deneyimliyim.' },
                { title: 'Takım Çalışması', description: 'Güçlü iletişim becerileri ile ekip halinde projeler yürütüyorum. Agile (Scrum) metodolojileri ve OOP ile etkili çalışırım.' },
                { title: 'Sürekli Öğrenme', description: 'Teknolojideki gelişmeleri takip ediyor, kendimi sürekli geliştiriyorum. Yeni teknolojiler öğrenme konusunda hevesliyim.' },
            ],
        },
        ai: {
            title: 'Yapay Zekâ ile Üretim',
            intro: 'Yapay zekâ ile çalışan sistemler ve agent akışları tasarlıyorum. LangChain ve LangGraph ile çok adımlı süreçler kuruyor; araç kullanımı ve MCP entegrasyonlarıyla bu akışları uygulamalara bağlıyorum. Agent Harness yaklaşımlarını ve Claude Code, OpenCode, Codex gibi kodlama ajanlarını; skills ve plugins ile geliştirme süreçlerime uyarlıyorum.',
            portraitAlt: 'Taha Pek’in portresi',
            gptAlt: 'OpenAI GPT logosu',
            claudeAlt: 'Anthropic Claude logosu',
            logosLabel: 'Yapay zekâ araçları',
            topics: [
                { title: 'Agent sistemleri', description: 'LangChain ve LangGraph ile araç kullanan, çok adımlı akışlar.' },
                { title: 'Entegrasyon ve çalışma ortamı', description: 'MCP, Agent Harness ve uygulama araçları.' },
                { title: 'AI destekli geliştirme', description: 'Claude Code, OpenCode ve Codex; skills ve plugins ile özelleştirilmiş iş akışları.' },
            ],
        },
        projects: {
            title: 'Kişisel Projelerim',
            subtitle: 'Geliştirdiğim projeleri keşfedin. Her biri farklı teknolojiler ve yaklaşımlar kullanılarak oluşturulmuştur.',
            featured: 'Öne Çıkan Proje',
            viewOnGithub: 'GitHub’da Görüntüle',
            viewDetails: 'Proje Detayı',
            moreTitle: 'Daha Fazla Proje',
            moreText: 'GitHub profilimde daha fazla proje ve açık kaynak katkılarımı keşfedebilirsiniz.',
            visitGithub: 'GitHub Profilimi Ziyaret Et',
            githubLabel: (name) => `${name} GitHub deposu`,
        },
        projectPage: {
            home: 'Ana Sayfa',
            projects: 'Projeler',
            back: 'Tüm projelere dön',
            technologies: 'Teknolojiler',
            source: 'Kaynak Kod',
            otherProjects: 'Diğer Projeler',
            githubCta: 'GitHub’da Görüntüle',
        },
        footer: {
            quickLinks: 'Hızlı Linkler',
            links: 'Bağlantılar',
            role: 'Software Developer',
            location: 'Sakarya, Türkiye',
            rights: 'Tüm hakları saklıdır.',
            cv: 'CV’yi Görüntüle',
            contact: 'İletişim',
        },
        blog: {
            title: 'Blog',
            subtitle: 'Yazılım, yapay zeka ajanları ve mimari üzerine notlar.',
            metaTitle: 'Blog',
            metaDescription: 'Taha Pek blog: .NET, yapay zeka ajanları, LangChain ve modern web geliştirme üzerine teknik yazılar.',
            allTopics: 'Tümü',
            topicsLabel: 'Konular',
            tagsLabel: 'Etiketler',
            searchLabel: 'Yazılarda ara',
            searchPlaceholder: 'Yazılarda ara…',
            searchLoading: 'Yükleniyor…',
            noResults: 'Eşleşen yazı bulunamadı.',
            resultsCount: '{n} yazı bulundu',
            clearFilters: 'Filtreleri temizle',
            readingTime: '{n} dk okuma',
            latestTitle: 'Son Yazılar',
            latestSubtitle: 'Blogdaki en yeni teknik yazılar.',
            viewAll: 'Tüm yazılar',
            emptyTitle: 'Henüz yazı yok',
            emptyText: 'Yakında yeni yazılar eklenecek.',
            paginationLabel: 'Sayfalama',
            prev: 'Önceki',
            next: 'Sonraki',
            pageTitle: (page) => `Sayfa ${page}`,
            tocTitle: 'İçindekiler',
            updatedOn: 'Güncellendi',
            backToBlog: 'Tüm yazılara dön',
            topic: 'Konu',
            rss: 'RSS',
            topicTitle: (topic) => `${topic} yazıları`,
            topicDescription: (topic) => `${topic} konusundaki tüm blog yazıları.`,
            breadcrumb: 'Blog',
        },
        notFound: { title: 'Oops! Sayfa Bulunamadı', text: 'Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir.', home: 'Ana Sayfaya Dön' },
        mail: { subject: 'İletişim - Kişisel Web Sitesi', body: 'Merhaba Taha,' },
    },
    en: {
        htmlLang: 'en',
        ogLocale: 'en_US',
        meta: {
            title: 'Taha Pek - Software Developer',
            description:
                'Full Stack Developer Taha Pek builds modern web applications with .NET, Nuxt.js, Next.js and Vue.js. Portfolio, projects and contact.',
            jobTitle: 'Specialist Software Developer',
            schemaDescription:
                'Full Stack Software Developer building web applications and AI-powered systems with .NET, Nuxt.js, React, Next.js and Vue.js.',
            keywords: [
                'Taha Pek', 'Software Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
                '.NET Developer', 'React Developer', 'Next.js Developer', 'Vue.js Developer', 'Nuxt.js Developer',
                'C# Developer', 'TypeScript Developer', 'Computer Engineering', 'Portfolio', 'Resume',
            ],
        },
        ids: { about: 'about', experience: 'experience', skills: 'skills', projects: 'projects' },
        nav: {
            about: 'ABOUT',
            experience: 'EXPERIENCE',
            skills: 'SKILLS',
            projects: 'PROJECTS',
            blog: 'BLOG',
            contact: 'CONTACT',
            menu: 'Menu',
            skip: 'Skip to main content',
            homeLabel: 'Taha Pek home page',
            switchLanguage: 'View the site in Turkish',
        },
        header: {
            greeting: "Hi, I'm Taha Pek",
            role: 'Specialist Software Developer',
            bio: [
                'Born on 9 August 2002 in Sakarya, Türkiye.',
                'Graduate of Kocaeli University, Computer Engineering.',
                'I currently work as a Specialist Software Developer at Doğuş Teknoloji.',
            ],
            viewProjects: 'View My Projects',
            getInTouch: 'Get in Touch',
            cv: 'View Resume',
            linkedinLabel: 'Visit my LinkedIn profile',
            githubLabel: 'Visit my GitHub profile',
            instagramLabel: 'Visit my Instagram profile',
            photoAlt: 'Portrait of Taha Pek',
        },
        about: {
            title: 'About Me',
            cardTitle: 'Full Stack Developer',
            paragraphs: [
                'I am a dynamic, results-driven software developer with experience in both backend and frontend development.',
                'I integrate my projects into cloud-based environments and make effective use of containerization technologies such as Kubernetes.',
                'I also work actively in artificial intelligence, designing complex LLM orchestration architectures with modern frameworks such as LangChain and LangGraph.',
                'Thanks to my interest in DevOps principles, I bridge development and operations teams to deliver fast and reliable releases.',
            ],
            stats: [
                { value: '3+', label: 'Years of Experience' },
                { value: '60+', label: 'Completed Projects' },
                { value: '15+', label: 'Technology Stack' },
                { value: '24/7', label: 'Passion for Learning' },
            ],
            expertiseTitle: 'Areas of Expertise',
            expertise: [
                { icon: '💻', title: 'Full Stack Development', description: 'Broad experience across backend and frontend' },
                { icon: '🤖', title: 'AI & LLM Orchestration', description: 'Intelligent agent systems and LLM orchestration architectures with LangChain and LangGraph' },
                { icon: '☁️', title: 'Cloud & DevOps', description: 'Kubernetes, CI/CD and cloud-based solutions' },
                { icon: '🚀', title: 'Agile & Team Leadership', description: 'Teamwork and flexible development methodologies' },
                { icon: '🎯', title: 'Problem Solving', description: 'Innovative solutions to complex problems' },
            ],
            quote:
                'Embracing Agile principles, I put teamwork and flexibility first, and with a constant passion for learning and building innovative solutions, I develop effective approaches to complex problems.',
        },
        experience: {
            title: 'Experience',
            subtitle: 'The experience I gained on my journey from education to a professional career',
            items: [
                { id: 5, title: 'Specialist Software Developer', company: 'Doğuş Teknoloji', period: 'Apr 2026 - Present', logo: '/logos/dt-logo.svg', description: 'I take an active role in professional software development projects.', skills: sharedSkills },
                { id: 4, title: 'Software Developer', company: 'Doğuş Teknoloji', period: 'Feb 2024 - Apr 2026', logo: '/logos/dt-logo.svg', description: 'I took an active role in professional software development projects.', skills: sharedSkills },
                { id: 3, title: 'Software Developer Intern', company: 'Doğuş Teknoloji', period: 'Jul 2023 - Feb 2024', logo: '/logos/dt-logo.svg', description: 'I gained broad experience in backend and frontend development processes.', skills: sharedSkills },
                { id: 2, title: 'Software Developer Intern', company: 'Nacsoft', period: 'Nov 2022 - Dec 2022', logo: '/logos/nacsoft.png', description: 'I gained broad experience in backend and frontend development processes.', skills: ['.Net', 'ASP.NET Core', 'C#', 'SQL Server', 'Entity Framework', 'HTML', 'CSS', 'JavaScript'] },
                { id: 1, title: 'Computer Engineering', company: 'Kocaeli University', period: 'Sep 2020 - Jun 2024', logo: '/logos/kou.svg', description: 'I studied software development, algorithms and data structures in depth.', skills: ['Algorithms', 'Data Structures', 'Software Engineering', 'Artificial Intelligence', 'Machine Learning'] },
            ],
        },
        abilities: {
            title: 'Skills',
            photoAlt: 'Taha Pek at work',
            items: [
                { title: 'Software Development', description: 'I build high-performance applications with modern web technologies. I specialize in Next.js, Nuxt.js, .NET Core and Web APIs.' },
                { title: 'Software Architecture', description: 'I apply design patterns with SOLID, Clean Code, Clean Architecture and microservice approaches.' },
                { title: 'Artificial Intelligence', description: 'I build complex LLM orchestration architectures with LangChain and LangGraph, designing intelligent agent systems and multi-step flows that integrate large language models into business processes.' },
                { title: 'Problem Solving', description: 'I analyze complex problems and produce effective solutions. I am experienced in algorithm design and optimization.' },
                { title: 'Teamwork', description: 'I run projects in teams with strong communication skills, working effectively with Agile (Scrum) methodologies and OOP.' },
                { title: 'Continuous Learning', description: 'I follow developments in technology and keep improving myself. I am eager to learn new technologies.' },
            ],
        },
        ai: {
            title: 'Building with AI',
            intro: 'I design AI-powered systems and agent workflows. With LangChain and LangGraph, I build multi-step processes and connect them to applications through tool use and MCP integrations. I apply Agent Harness approaches and adapt coding agents such as Claude Code, OpenCode, and Codex to my development workflow with skills and plugins.',
            portraitAlt: 'Portrait of Taha Pek',
            gptAlt: 'OpenAI GPT logo',
            claudeAlt: 'Anthropic Claude logo',
            logosLabel: 'AI tools',
            topics: [
                { title: 'Agent systems', description: 'Tool-using, multi-step workflows with LangChain and LangGraph.' },
                { title: 'Integrations and runtime', description: 'MCP, Agent Harness, and application tools.' },
                { title: 'AI-assisted development', description: 'Claude Code, OpenCode, and Codex, with tailored workflows using skills and plugins.' },
            ],
        },
        projects: {
            title: 'Personal Projects',
            subtitle: 'Explore the projects I have built. Each one uses different technologies and approaches.',
            featured: 'Featured Project',
            viewOnGithub: 'View on GitHub',
            viewDetails: 'Project Details',
            moreTitle: 'More Projects',
            moreText: 'You can find more projects and my open source contributions on my GitHub profile.',
            visitGithub: 'Visit My GitHub Profile',
            githubLabel: (name) => `${name} GitHub repository`,
        },
        projectPage: {
            home: 'Home',
            projects: 'Projects',
            back: 'Back to all projects',
            technologies: 'Technologies',
            source: 'Source Code',
            otherProjects: 'Other Projects',
            githubCta: 'View on GitHub',
        },
        footer: {
            quickLinks: 'Quick Links',
            links: 'Links',
            role: 'Software Developer',
            location: 'Sakarya, Türkiye',
            rights: 'All rights reserved.',
            cv: 'View Resume',
            contact: 'Contact',
        },
        blog: {
            title: 'Blog',
            subtitle: 'Notes on software, AI agents and architecture.',
            metaTitle: 'Blog',
            metaDescription: 'Taha Pek blog: technical articles on .NET, AI agents, LangChain and modern web development.',
            allTopics: 'All',
            topicsLabel: 'Topics',
            tagsLabel: 'Tags',
            searchLabel: 'Search posts',
            searchPlaceholder: 'Search posts…',
            searchLoading: 'Loading…',
            noResults: 'No matching posts found.',
            resultsCount: '{n} posts found',
            clearFilters: 'Clear filters',
            readingTime: '{n} min read',
            latestTitle: 'Latest Posts',
            latestSubtitle: 'The newest technical articles from the blog.',
            viewAll: 'All posts',
            emptyTitle: 'No posts yet',
            emptyText: 'New posts are coming soon.',
            paginationLabel: 'Pagination',
            prev: 'Previous',
            next: 'Next',
            pageTitle: (page) => `Page ${page}`,
            tocTitle: 'Table of contents',
            updatedOn: 'Updated',
            backToBlog: 'Back to all posts',
            topic: 'Topic',
            rss: 'RSS',
            topicTitle: (topic) => `${topic} posts`,
            topicDescription: (topic) => `All blog posts about ${topic}.`,
            breadcrumb: 'Blog',
        },
        notFound: { title: 'Oops! Page Not Found', text: 'The page you are looking for does not exist, has moved or was deleted.', home: 'Back to Home' },
        mail: { subject: 'Contact - Personal Website', body: 'Hi Taha,' },
    },
}

export function getDict(lang: Locale): Dict {
    return dictionaries[lang]
}
