import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Github, ExternalLink, Calendar, GitBranch, Rocket, Users, Code2, TestTube, Send, Menu, X } from "lucide-react";
import ytseiungAvatar from '@/assets/ytseiung.jpg';
import kaiyasiAvatar from '@/assets/kaiyasi.jpg';
import xzhiyouuAvatar from '@/assets/xzhiyouu.jpg';
import LoadingScreen from './LoadingScreen';

// Animation component for scroll-triggered animations
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SerelixStudio = () => {
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simple client-side rate limiting
      const lastSubmit = localStorage.getItem('lastFormSubmit');
      const now = Date.now();
      if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
        toast({
          title: "Please wait",
          description: "You can only submit once per minute. Please try again later.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQwNjY2ODkzOTk4NzI1OTQxMy9oMXRseUlmSThveVczRlRVdzlLbGh3VHBTX2RsTTZvbWZwQzV3M3pYc0dXT3d1cTVWTXc3OGxUWXUzMXdUZlBiX0hTZQ==');
      
      const discordMessage = {
        content: 'New Contact Form Submission:',
        embeds: [{
          title: 'New Contact Message!!!!!',
          color: 3447003,
          fields: [
            { name: 'Name', value: formData.name, inline: true },
            { name: 'Email', value: formData.email, inline: true },
            { name: 'Subject', value: formData.subject, inline: false },
            { name: 'Message', value: formData.message, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        localStorage.setItem('lastFormSubmit', now.toString());
        toast({
          title: "Message Sent!",
          description: "We'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    setMobileMenuOpen(false); // 關閉選單
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      {!showContent && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div className={`min-h-screen bg-background ${!showContent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
      {/* Navigation */}
      <motion.nav 
        className="fixed w-full top-0 z-50 bg-background/90 backdrop-blur-enhanced border-b border-border"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="text-xl font-bold text-foreground cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToTop}
            >
              Serelix Studio
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["About", "Projects", "Team", "Timeline", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary transition-colors relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -2, 
                    transition: { duration: 0.2 }
                  }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                {["About", "Projects", "Team", "Timeline", "Contact"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Building Modern,{" "}
              <motion.span 
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Impactful Applications
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Serelix Studio is a project-based development studio focused on creating modern applications 
              that connect communities and enhance digital experiences.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="hero" 
                  size="lg" 
                  className=""
                  onClick={() => scrollToSection('projects')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Our Work
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className=""
                  onClick={() => scrollToSection('contact')}
                >
                  Get In Touch
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Serelix Studio</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are a dedicated team of developers passionate about creating innovative solutions for modern challenges. 
                Our focus lies in building applications that foster community engagement, streamline campus life, and 
                enhance digital interactions through thoughtful design and robust development practices.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedSection delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Projects</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Innovative applications designed to connect communities and enhance digital experiences
              </p>
            </AnimatedSection>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Forumkit */}
            <AnimatedSection delay={0.1}>
              <motion.div
                whileHover={{ scale: 1.03, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="transition-all duration-300 group h-full border">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                        Forumkit
                      </CardTitle>
                      <Badge variant="secondary">Forum Platform</Badge>
                    </div>
                    <CardDescription className="text-base">
                      A modernized anonymous forum platform designed specifically for schools and campuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Forumkit provides a safe, anonymous space for students to discuss topics, 
                        share experiences, and connect with their campus community through modern, 
                        intuitive forum functionality.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Anonymous</Badge>
                        <Badge variant="outline">Campus-focused</Badge>
                        <Badge variant="outline">Community</Badge>
                      </div>
                      <div className="pt-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            asChild
                          >
                            <a 
                              href="https://forum.serelix.xyz" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Forum
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>

            {/* Intraverse */}
            <AnimatedSection delay={0.3}>
              <motion.div
                whileHover={{ scale: 1.03, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="transition-all duration-300 group h-full border">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                        Intraverse
                      </CardTitle>
                      <Badge variant="secondary">Campus App</Badge>
                    </div>
                    <CardDescription className="text-base">
                      A comprehensive campus service application designed to connect students with essential tools and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Intraverse simplifies campus life by uniting essential services, tools, and information in one intuitive app for modern students.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Student Services</Badge>
                        <Badge variant="outline">Campus Tools</Badge>
                        <Badge variant="outline">Integration</Badge>
                      </div>
                      <div className="pt-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            disabled
                          >
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Coming Soon
                            </span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedSection delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Team</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the talented individuals behind Serelix Studio's innovative projects
              </p>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* ytseiung */}
            <AnimatedSection delay={0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="transition-all duration-300 text-center h-full border">
                  <CardHeader>
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={ytseiungAvatar} 
                        alt="ytseiung profile" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <CardTitle className="text-xl text-foreground">ytseiung</CardTitle>
                    <CardDescription>CEO, Co-Founder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Leads the strategic vision and direction of Serelix Studio, driving innovation and fostering partnerships to build impactful applications.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>

            {/* kaiyasi */}
            <AnimatedSection delay={0.3}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="transition-all duration-300 text-center h-full border">
                  <CardHeader>
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={kaiyasiAvatar} 
                        alt="kaiyasi profile" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <CardTitle className="text-xl text-foreground">kaiyasi</CardTitle>
                    <CardDescription>Technology Director, Co-Founder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Oversees technical architecture and development strategies, ensuring the highest standards in product quality and innovation.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>

            {/* xzhiyouu */}
            <AnimatedSection delay={0.5}>
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="transition-all duration-300 text-center h-full border">
                  <CardHeader>
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={xzhiyouuAvatar} 
                        alt="xzhiyouu profile" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <CardTitle className="text-xl text-foreground">xzhiyouu</CardTitle>
                    <CardDescription>Chief Engineer, Co-Founder</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Leads engineering excellence and implementation, bringing technical expertise and innovative solutions to all our projects.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Development Timeline Section */}
      <section id="timeline" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedSection delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Development Timeline</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our journey of building innovative applications and growing as a development studio
              </p>
            </AnimatedSection>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {/* 2024 Q1 - Studio Formation */}
                <AnimatedSection delay={0.1}>
                  <div className="flex items-center">
                    <div className="flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 shadow-card-blue"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <Users className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">Studio Formation</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Serelix Studio was founded with the vision of creating modern applications that connect communities.
                        </p>
                        <span className="text-sm text-primary font-semibold">Q1 2024</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 pl-8"></div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q2 - Forumkit Concept */}
                <AnimatedSection delay={0.2}>
                  <div className="flex items-center">
                    <div className="flex-1 pr-8"></div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 text-left pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 shadow-card-blue"
                        whileHover={{ scale: 1.02, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <Code2 className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">Forumkit Concept</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Initial concept and design phase for the anonymous forum platform targeting campus communities.
                        </p>
                        <span className="text-sm text-primary font-semibold">Q2 2024</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q3 - Development Start */}
                <AnimatedSection delay={0.3}>
                  <div className="flex items-center">
                    <div className="flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 shadow-card-blue"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <GitBranch className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">Development Kickoff</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Active development phase begins for both Forumkit and Intraverse projects with full team collaboration.
                        </p>
                        <span className="text-sm text-primary font-semibold">Q3 2024</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 pl-8"></div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q4 - Beta Testing */}
                <AnimatedSection delay={0.4}>
                  <div className="flex items-center">
                    <div className="flex-1 pr-8"></div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 text-left pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 shadow-card-blue"
                        whileHover={{ scale: 1.02, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <TestTube className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">Internal Testing</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Extensive internal testing and refinement of core features, user interface improvements, and security implementations.
                        </p>
                        <span className="text-sm text-primary font-semibold">Q4 2024</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2025 Q3 - Public Launch */}
                <AnimatedSection delay={0.5}>
                  <div className="flex items-center">
                    <div className="flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <Rocket className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">Forumkit Launch</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Official public launch of Forumkit anonymous platform, opening services to university and campus communities.
                        </p>
                        <span className="text-sm text-primary font-semibold">September 2025</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-6 h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-background rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 pl-8"></div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AnimatedSection delay={0}>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Get In Touch</h2>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  Ready to collaborate or learn more about our projects? We'd love to hear from you.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <AnimatedSection delay={0.3}>
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>Fill out the form and we'll get back to you soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Message subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="What would you like to tell us..."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          rows={5}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Contact Info */}
              <AnimatedSection delay={0.4}>
                <div className="flex flex-col h-full space-y-6">
                  <Card className="transition-all duration-300 border flex-1">
                    <CardContent className="p-6 h-full flex items-center">
                      <div className="flex items-start w-full">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                          <a 
                            href="mailto:serelixstudio@gmail.com" 
                            className="text-primary hover:text-primary-glow transition-colors"
                          >
                            serelixstudio@gmail.com
                          </a>
                          <p className="text-sm text-muted-foreground mt-2">
                            We typically respond within 24-48 hours
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 border flex-1">
                    <CardContent className="p-6 h-full flex items-center">
                      <div className="flex items-start w-full">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MessageCircle className="w-6 h-6 text-primary mr-4 mt-1" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Discord</h3>
                          <a 
                            href="https://discord.gg/prF9KwUhGQ" 
                            className="text-primary hover:text-primary-glow transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join our Discord
                          </a>
                          <p className="text-sm text-muted-foreground mt-2">
                            Join our community for instant communication
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <AnimatedSection delay={0}>
        <footer className="py-8 bg-section-bg border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              © 2024 Serelix Studio. Building the future, one project at a time.
            </motion.p>
          </div>
        </footer>
      </AnimatedSection>
      </div>
    </>
  );
};

export default SerelixStudio;
