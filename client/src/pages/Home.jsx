import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight,
    Layers,
    Globe,
    BarChart3,
    Zap,
    Shield,
    Palette,
    Github,
    Instagram,
    Mail,
    ChevronRight,
} from 'lucide-react';

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge fade-in-up">
                        <span className="badge-dot" />
                        Open Platform for Developers
                    </div>

                    <h1 className="hero-title">
                        Build Your <br />
                        <span className="gradient-text">Professional Portfolio</span>
                    </h1>

                    <p className="hero-description">
                        Create a stunning portfolio in minutes. Showcase your projects, share your
                        unique URL with the world, and stand out from the crowd. This is where your
                        work gets the recognition it deserves.
                    </p>

                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started Free
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                    <ChevronRight size={18} />
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="stat-number">10K+</div>
                            <div className="stat-text">Portfolios Created</div>
                        </div>
                        <div className="hero-stat">
                            <div className="stat-number">50K+</div>
                            <div className="stat-text">Projects Showcased</div>
                        </div>
                        <div className="hero-stat">
                            <div className="stat-number">100%</div>
                            <div className="stat-text">Free to Use</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="section-header">
                    <h2>Everything You Need</h2>
                    <p>
                        Powerful features designed to help you build and manage your online presence
                        effortlessly.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card fade-in-up delay-1">
                        <div className="feature-icon">
                            <Globe size={22} />
                        </div>
                        <h3>Custom URL</h3>
                        <p>
                            Get your own unique URL. Share foliox.com/yourusername and let the
                            world discover your work instantly.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-2">
                        <div className="feature-icon">
                            <Layers size={22} />
                        </div>
                        <h3>Project Showcase</h3>
                        <p>
                            Display your projects with descriptions, tech stacks, live demos,
                            and GitHub links. Make every project count.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-3">
                        <div className="feature-icon">
                            <BarChart3 size={22} />
                        </div>
                        <h3>Profile Analytics</h3>
                        <p>
                            Track who is viewing your portfolio. Get insights on your profile
                            visibility to measure your impact.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-4">
                        <div className="feature-icon">
                            <Zap size={22} />
                        </div>
                        <h3>Instant Setup</h3>
                        <p>
                            No complex configurations. Sign up, add your projects, and your
                            portfolio is live in under 5 minutes.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-5">
                        <div className="feature-icon">
                            <Shield size={22} />
                        </div>
                        <h3>Secure by Default</h3>
                        <p>
                            Your data is protected with industry-standard encryption and
                            authentication. Focus on building, not worrying.
                        </p>
                    </div>

                    <div className="feature-card fade-in-up delay-1">
                        <div className="feature-icon">
                            <Palette size={22} />
                        </div>
                        <h3>Modern Design</h3>
                        <p>
                            A sleek, dark-themed portfolio that looks professional on every
                            device, making a lasting first impression.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Three simple steps to launch your professional portfolio.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Create Your Account</h3>
                        <p>
                            Sign up with your email and choose a unique username. This becomes
                            your portfolio URL.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Add Your Projects</h3>
                        <p>
                            Use the intuitive dashboard to add projects, descriptions, tech
                            stacks, and links to your work.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Share With The World</h3>
                        <p>
                            Your portfolio is live. Share your unique URL on social media,
                            resumes, and job applications.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to Build Your Portfolio?</h2>
                    <p>
                        Join thousands of developers who trust FolioX to showcase their work.
                        It is completely free, no credit card required.
                    </p>
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-primary btn-lg">
                            Open Dashboard
                            <ArrowRight size={18} />
                        </Link>
                    ) : (
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Create Your Portfolio Now
                            <ArrowRight size={18} />
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer with Creator Credits */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-creator">
                        <div className="footer-creator-title">Creator</div>
                        <div className="footer-links">
                            <a
                                href="https://github.com/jeet1511"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                <Github size={16} />
                                Github: jeet1511
                            </a>
                            <a
                                href="https://instagram.com/_echo.del.alma_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                <Instagram size={16} />
                                Instagram: _echo.del.alma_
                            </a>
                            <a
                                href="mailto:jeetmondal1685@gmail.com"
                                className="footer-link"
                            >
                                <Mail size={16} />
                                Jeet
                            </a>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        FolioX. Built with precision and purpose.
                    </div>
                </div>
            </footer>
        </div>
    );
}
