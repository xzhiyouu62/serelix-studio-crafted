import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Github, ExternalLink, Calendar, GitBranch, Rocket, Users, Code2, TestTube, Send, Menu, X, Languages } from "lucide-react";
import ytseiungAvatar from '@/assets/ytseiung.jpg';
import kaiyasiAvatar from '@/assets/kaiyasi.jpg';
import xzhiyouuAvatar from '@/assets/xzhiyouu.jpg';
import LoadingScreen from './LoadingScreen';
import { translations, Language } from '@/i18n/translations';

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
  const [language, setLanguage] = useState<Language>(() => {
    // 從 localStorage 讀取或使用預設語言
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // 獲取當前語言的翻譯
  const t = translations[language];

  // 語言切換功能
  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

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
          title: t.contact.toast.rateLimit.title,
          description: t.contact.toast.rateLimit.description,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const apiUrl = 'https://serelix-contact-api.nelson970602.workers.dev';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('lastFormSubmit', now.toString());
        toast({
          title: t.contact.toast.success.title,
          description: t.contact.toast.success.description,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: t.contact.toast.error.title,
        description: t.contact.toast.error.description,
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
            <div className="hidden md:flex space-x-8 items-center">
              {[
                { key: "about", label: t.nav.about },
                { key: "projects", label: t.nav.projects },
                { key: "team", label: t.nav.team },
                { key: "timeline", label: t.nav.timeline },
                { key: "contact", label: t.nav.contact }
              ].map((item, index) => (
                <motion.a
                  key={item.key}
                  href={`#${item.key}`}
                  className="text-muted-foreground hover:text-primary transition-colors relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -2, 
                    transition: { duration: 0.2 }
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
              
              {/* Language Toggle Button */}
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={language === 'en' ? 'Switch to 中文' : 'Switch to English'}
              >
                <Languages size={18} />
                <span className="text-sm font-medium">{language === 'en' ? '中文' : 'EN'}</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button & Language Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent text-foreground"
                whileTap={{ scale: 0.95 }}
              >
                <Languages size={16} />
                <span className="text-xs font-medium">{language === 'en' ? '中' : 'EN'}</span>
              </motion.button>
              
              <motion.button
                className="text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
            </div>
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
                {[
                  { key: "about", label: t.nav.about },
                  { key: "projects", label: t.nav.projects },
                  { key: "team", label: t.nav.team },
                  { key: "timeline", label: t.nav.timeline },
                  { key: "contact", label: t.nav.contact }
                ].map((item, index) => (
                  <motion.a
                    key={item.key}
                    href={`#${item.key}`}
                    onClick={() => scrollToSection(item.key)}
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
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
              key={`hero-title-${language}`}
            >
              {t.hero.title}{" "}
              <motion.span 
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {t.hero.titleHighlight}
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              key={`hero-desc-${language}`}
            >
              {t.hero.description}
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
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full sm:w-48"
                  onClick={() => scrollToSection('projects')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t.hero.viewWork}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-48"
                  onClick={() => scrollToSection('contact')}
                >
                  {t.hero.getInTouch}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t.about.title}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.about.description}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.projects.title}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.projects.subtitle}
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
                        {t.projects.forumkit.title}
                      </CardTitle>
                      <Badge variant="secondary">{t.projects.forumkit.badge}</Badge>
                    </div>
                    <CardDescription className="text-base">
                      {t.projects.forumkit.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        {t.projects.forumkit.details}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {t.projects.forumkit.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
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
                              {t.projects.forumkit.button}
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
                        {t.projects.intraverse.title}
                      </CardTitle>
                      <Badge variant="secondary">{t.projects.intraverse.badge}</Badge>
                    </div>
                    <CardDescription className="text-base">
                      {t.projects.intraverse.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        {t.projects.intraverse.details}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {t.projects.intraverse.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
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
                              {t.projects.intraverse.button}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.team.title}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.team.subtitle}
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
                    <CardDescription>{t.team.members.ytseiung.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t.team.members.ytseiung.bio}
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
                    <CardDescription>{t.team.members.kaiyasi.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t.team.members.kaiyasi.bio}
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
                    <CardDescription>{t.team.members.xzhiyouu.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t.team.members.xzhiyouu.bio}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.timeline.title}</h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.timeline.subtitle}
              </p>
            </AnimatedSection>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {/* 2024 Q1 - Studio Formation */}
                <AnimatedSection delay={0.1}>
                  <div className="flex items-center">
                    {/* 手機版：隱藏左側空白 */}
                    <div className="hidden md:block flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <Users className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q1_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q1_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q1_2024.date}</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    {/* 手機版：顯示在右側 */}
                    <div className="flex-1 pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 md:hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <Users className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q1_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q1_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q1_2024.date}</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q2 - Forumkit Concept */}
                <AnimatedSection delay={0.2}>
                  <div className="flex items-center">
                    <div className="hidden md:block flex-1 pr-8"></div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 text-left pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <Code2 className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q2_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q2_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q2_2024.date}</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q3 - Development Start */}
                <AnimatedSection delay={0.3}>
                  <div className="flex items-center">
                    <div className="hidden md:block flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <GitBranch className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q3_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q3_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q3_2024.date}</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 md:hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <GitBranch className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q3_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q3_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q3_2024.date}</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2024 Q4 - Beta Testing */}
                <AnimatedSection delay={0.4}>
                  <div className="flex items-center">
                    <div className="hidden md:block flex-1 pr-8"></div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                    <div className="flex-1 text-left pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <TestTube className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q4_2024.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q4_2024.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q4_2024.date}</span>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedSection>

                {/* 2025 Q3 - Public Launch */}
                <AnimatedSection delay={0.5}>
                  <div className="flex items-center">
                    <div className="hidden md:block flex-1 text-right pr-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6"
                        whileHover={{ scale: 1.02, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-end mb-3">
                          <Rocket className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q3_2025.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q3_2025.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q3_2025.date}</span>
                      </motion.div>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-6 h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-background rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 pl-8">
                      <motion.div
                        className="bg-card border rounded-lg p-6 md:hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center mb-3">
                          <Rocket className="w-6 h-6 text-primary mr-2" />
                          <h3 className="text-xl font-bold text-foreground">{t.timeline.events.q3_2025.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {t.timeline.events.q3_2025.description}
                        </p>
                        <span className="text-sm text-primary font-semibold">{t.timeline.events.q3_2025.date}</span>
                      </motion.div>
                    </div>
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t.contact.title}</h2>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  {t.contact.subtitle}
                </p>
              </AnimatedSection>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <AnimatedSection delay={0.3}>
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t.contact.title}</CardTitle>
                    <CardDescription>{t.contact.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contact.form.name}</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t.contact.form.namePlaceholder}
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contact.form.email}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t.contact.form.emailPlaceholder}
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t.contact.form.subject}</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder={t.contact.form.subjectPlaceholder}
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t.contact.form.message}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={t.contact.form.messagePlaceholder}
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
                          <>{t.contact.form.submitting}</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t.contact.form.submit}
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
                          <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.info.email}</h3>
                          <a 
                            href="mailto:serelixstudio@gmail.com" 
                            className="text-primary hover:text-primary-glow transition-colors"
                          >
                            {t.contact.info.emailAddress}
                          </a>
                          <p className="text-sm text-muted-foreground mt-2">
                            {language === 'en' ? 'We typically respond within 24-48 hours' : '我們通常會在 24-48 小時內回覆'}
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
                          <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.info.community}</h3>
                          <a 
                            href="https://discord.gg/mQ3fXSb9Eu" 
                            className="text-primary hover:text-primary-glow transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t.contact.info.discord}
                          </a>
                          <p className="text-sm text-muted-foreground mt-2">
                            {language === 'en' ? 'Join our Discord server for instant communication' : '加入我們的 Discord 伺服器進行即時交流'}
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
