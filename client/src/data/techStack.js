// GitHub-style tech stack data with categories, colors, and icons
// Each tech has: name, color (bg), textColor, category

const techStack = {
    Languages: [
        { name: 'JavaScript', color: '#F7DF1E', textColor: '#000' },
        { name: 'TypeScript', color: '#3178C6', textColor: '#fff' },
        { name: 'Python', color: '#3776AB', textColor: '#fff' },
        { name: 'Java', color: '#ED8B00', textColor: '#fff' },
        { name: 'C', color: '#A8B9CC', textColor: '#000' },
        { name: 'C++', color: '#00599C', textColor: '#fff' },
        { name: 'C#', color: '#239120', textColor: '#fff' },
        { name: 'Go', color: '#00ADD8', textColor: '#fff' },
        { name: 'Rust', color: '#DEA584', textColor: '#000' },
        { name: 'Ruby', color: '#CC342D', textColor: '#fff' },
        { name: 'PHP', color: '#777BB4', textColor: '#fff' },
        { name: 'Swift', color: '#FA7343', textColor: '#fff' },
        { name: 'Kotlin', color: '#7F52FF', textColor: '#fff' },
        { name: 'Dart', color: '#0175C2', textColor: '#fff' },
        { name: 'Scala', color: '#DC322F', textColor: '#fff' },
        { name: 'R', color: '#276DC3', textColor: '#fff' },
        { name: 'Lua', color: '#2C2D72', textColor: '#fff' },
        { name: 'Perl', color: '#39457E', textColor: '#fff' },
        { name: 'Haskell', color: '#5D4F85', textColor: '#fff' },
        { name: 'Elixir', color: '#4B275F', textColor: '#fff' },
        { name: 'Clojure', color: '#5881D8', textColor: '#fff' },
        { name: 'Shell', color: '#89E051', textColor: '#000' },
        { name: 'PowerShell', color: '#5391FE', textColor: '#fff' },
        { name: 'SQL', color: '#E38C00', textColor: '#fff' },
        { name: 'HTML5', color: '#E34F26', textColor: '#fff' },
        { name: 'CSS3', color: '#1572B6', textColor: '#fff' },
        { name: 'Sass', color: '#CC6699', textColor: '#fff' },
        { name: 'Solidity', color: '#363636', textColor: '#fff' },
    ],
    Frameworks: [
        { name: 'React', color: '#61DAFB', textColor: '#000' },
        { name: 'Next.js', color: '#000000', textColor: '#fff' },
        { name: 'Vue.js', color: '#4FC08D', textColor: '#fff' },
        { name: 'Nuxt.js', color: '#00DC82', textColor: '#000' },
        { name: 'Angular', color: '#DD0031', textColor: '#fff' },
        { name: 'Svelte', color: '#FF3E00', textColor: '#fff' },
        { name: 'Node.js', color: '#339933', textColor: '#fff' },
        { name: 'Express', color: '#000000', textColor: '#fff' },
        { name: 'Django', color: '#092E20', textColor: '#fff' },
        { name: 'Flask', color: '#000000', textColor: '#fff' },
        { name: 'FastAPI', color: '#009688', textColor: '#fff' },
        { name: 'Spring Boot', color: '#6DB33F', textColor: '#fff' },
        { name: 'Ruby on Rails', color: '#CC0000', textColor: '#fff' },
        { name: 'Laravel', color: '#FF2D20', textColor: '#fff' },
        { name: 'ASP.NET', color: '#512BD4', textColor: '#fff' },
        { name: '.NET', color: '#512BD4', textColor: '#fff' },
        { name: 'Flutter', color: '#02569B', textColor: '#fff' },
        { name: 'React Native', color: '#61DAFB', textColor: '#000' },
        { name: 'Electron', color: '#47848F', textColor: '#fff' },
        { name: 'Tailwind CSS', color: '#06B6D4', textColor: '#fff' },
        { name: 'Bootstrap', color: '#7952B3', textColor: '#fff' },
        { name: 'Material UI', color: '#007FFF', textColor: '#fff' },
        { name: 'jQuery', color: '#0769AD', textColor: '#fff' },
        { name: 'Gatsby', color: '#663399', textColor: '#fff' },
        { name: 'Remix', color: '#000000', textColor: '#fff' },
        { name: 'Astro', color: '#FF5D01', textColor: '#fff' },
        { name: 'Vite', color: '#646CFF', textColor: '#fff' },
        { name: 'Webpack', color: '#8DD6F9', textColor: '#000' },
    ],
    Databases: [
        { name: 'MongoDB', color: '#47A248', textColor: '#fff' },
        { name: 'PostgreSQL', color: '#4169E1', textColor: '#fff' },
        { name: 'MySQL', color: '#4479A1', textColor: '#fff' },
        { name: 'SQLite', color: '#003B57', textColor: '#fff' },
        { name: 'Redis', color: '#DC382D', textColor: '#fff' },
        { name: 'Firebase', color: '#FFCA28', textColor: '#000' },
        { name: 'Supabase', color: '#3ECF8E', textColor: '#000' },
        { name: 'DynamoDB', color: '#4053D6', textColor: '#fff' },
        { name: 'Cassandra', color: '#1287B1', textColor: '#fff' },
        { name: 'Neo4j', color: '#008CC1', textColor: '#fff' },
        { name: 'Prisma', color: '#2D3748', textColor: '#fff' },
        { name: 'Mongoose', color: '#880000', textColor: '#fff' },
    ],
    'Cloud & DevOps': [
        { name: 'AWS', color: '#FF9900', textColor: '#000' },
        { name: 'Google Cloud', color: '#4285F4', textColor: '#fff' },
        { name: 'Azure', color: '#0078D4', textColor: '#fff' },
        { name: 'Vercel', color: '#000000', textColor: '#fff' },
        { name: 'Netlify', color: '#00C7B7', textColor: '#000' },
        { name: 'Heroku', color: '#430098', textColor: '#fff' },
        { name: 'DigitalOcean', color: '#0080FF', textColor: '#fff' },
        { name: 'Docker', color: '#2496ED', textColor: '#fff' },
        { name: 'Kubernetes', color: '#326CE5', textColor: '#fff' },
        { name: 'Nginx', color: '#009639', textColor: '#fff' },
        { name: 'Linux', color: '#FCC624', textColor: '#000' },
        { name: 'GitHub Actions', color: '#2088FF', textColor: '#fff' },
        { name: 'Jenkins', color: '#D24939', textColor: '#fff' },
        { name: 'Terraform', color: '#7B42BC', textColor: '#fff' },
        { name: 'Cloudflare', color: '#F38020', textColor: '#fff' },
        { name: 'Render', color: '#46E3B7', textColor: '#000' },
        { name: 'Railway', color: '#0B0D0E', textColor: '#fff' },
    ],
    Tools: [
        { name: 'Git', color: '#F05032', textColor: '#fff' },
        { name: 'GitHub', color: '#181717', textColor: '#fff' },
        { name: 'GitLab', color: '#FC6D26', textColor: '#fff' },
        { name: 'VS Code', color: '#007ACC', textColor: '#fff' },
        { name: 'Figma', color: '#F24E1E', textColor: '#fff' },
        { name: 'Postman', color: '#FF6C37', textColor: '#fff' },
        { name: 'Jira', color: '#0052CC', textColor: '#fff' },
        { name: 'Notion', color: '#000000', textColor: '#fff' },
        { name: 'Slack', color: '#4A154B', textColor: '#fff' },
        { name: 'npm', color: '#CB3837', textColor: '#fff' },
        { name: 'Yarn', color: '#2C8EBB', textColor: '#fff' },
        { name: 'pnpm', color: '#F69220', textColor: '#fff' },
        { name: 'ESLint', color: '#4B32C3', textColor: '#fff' },
        { name: 'Prettier', color: '#F7B93E', textColor: '#000' },
        { name: 'Jest', color: '#C21325', textColor: '#fff' },
        { name: 'Cypress', color: '#17202C', textColor: '#fff' },
        { name: 'Storybook', color: '#FF4785', textColor: '#fff' },
        { name: 'GraphQL', color: '#E10098', textColor: '#fff' },
        { name: 'REST API', color: '#009688', textColor: '#fff' },
        { name: 'Socket.io', color: '#010101', textColor: '#fff' },
        { name: 'Stripe', color: '#635BFF', textColor: '#fff' },
    ],
    'AI & Data': [
        { name: 'TensorFlow', color: '#FF6F00', textColor: '#fff' },
        { name: 'PyTorch', color: '#EE4C2C', textColor: '#fff' },
        { name: 'OpenAI', color: '#412991', textColor: '#fff' },
        { name: 'LangChain', color: '#1C3C3C', textColor: '#fff' },
        { name: 'Pandas', color: '#150458', textColor: '#fff' },
        { name: 'NumPy', color: '#013243', textColor: '#fff' },
        { name: 'Scikit-learn', color: '#F7931E', textColor: '#000' },
        { name: 'Jupyter', color: '#F37626', textColor: '#fff' },
        { name: 'Hugging Face', color: '#FFD21E', textColor: '#000' },
        { name: 'OpenCV', color: '#5C3EE8', textColor: '#fff' },
    ],
};

// Flat lookup map for quick access by tech name
export const techLookup = {};
Object.entries(techStack).forEach(([category, techs]) => {
    techs.forEach((tech) => {
        techLookup[tech.name.toLowerCase()] = { ...tech, category };
    });
});

export const getTechInfo = (name) => {
    const info = techLookup[name.toLowerCase()];
    if (info) return info;
    // Default style for custom/unknown techs
    return {
        name,
        color: 'rgba(108, 92, 231, 0.15)',
        textColor: '#a29bfe',
        category: 'Other',
    };
};

export const categories = Object.keys(techStack);

export default techStack;
