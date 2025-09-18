import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Github, ExternalLink } from "lucide-react";
import kaiyasiAvatar from '@/assets/kaiyasi-avatar.jpg';
import ytseiungAvatar from '@/assets/ytseiung-avatar.jpg';
import xzhiyouuAvatar from '@/assets/xzhiyouu-avatar.jpg';

const SerelixStudio = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-foreground">Serelix Studio</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
              <a href="#team" className="text-muted-foreground hover:text-foreground transition-colors">Team</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-text-hero mb-6 leading-tight">
              Building Modern,{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Impactful Applications
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Serelix Studio is a project-based development studio focused on creating modern applications 
              that connect communities and enhance digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Our Work
              </Button>
              <Button variant="outline" size="lg">
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Serelix Studio</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are a dedicated team of developers passionate about creating innovative solutions for modern challenges. 
              Our focus lies in building applications that foster community engagement, streamline campus life, and 
              enhance digital interactions through thoughtful design and robust development practices.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Innovative applications designed to connect communities and enhance digital experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Forumkit */}
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 group">
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
                </div>
              </CardContent>
            </Card>

            {/* Intraverse */}
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                    Intraverse
                  </CardTitle>
                  <Badge variant="secondary">Campus App</Badge>
                </div>
                <CardDescription className="text-base">
                  A comprehensive campus service application connecting students with essential tools and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Intraverse streamlines campus life by providing students with access to essential services, 
                    tools, and information in one unified, user-friendly application.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Student Services</Badge>
                    <Badge variant="outline">Campus Tools</Badge>
                    <Badge variant="outline">Integration</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the talented individuals behind Serelix Studio's innovative projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* kaiyasi */}
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={kaiyasiAvatar} 
                    alt="kaiyasi profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-foreground">kaiyasi</CardTitle>
                <CardDescription>Technical Team Member</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Responsible for Forumkit and Intraverse development, bringing innovative solutions to campus communication.
                </p>
              </CardContent>
            </Card>

            {/* ytseiung */}
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={ytseiungAvatar} 
                    alt="ytseiung profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-foreground">ytseiung</CardTitle>
                <CardDescription>Technical Lead & Studio Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Leads Intraverse development, manages studio operations, and drives other innovative project initiatives.
                </p>
              </CardContent>
            </Card>

            {/* xzhiyouu */}
            <Card className="shadow-card hover:shadow-elegant transition-all duration-300 text-center">
              <CardHeader>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={xzhiyouuAvatar} 
                    alt="xzhiyouu profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl text-foreground">xzhiyouu</CardTitle>
                <CardDescription>Technical Team Member</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contributes to Intraverse and other project development, focusing on user experience and technical excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Get In Touch</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Ready to collaborate or learn more about our projects? We'd love to hear from you.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                  <a 
                    href="mailto:serelixstudio@gmail.com" 
                    className="text-primary hover:text-primary-glow transition-colors"
                  >
                    serelixstudio@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Discord</h3>
                  <a 
                    href="https://discord.gg/SerelixStudio" 
                    className="text-primary hover:text-primary-glow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    discord/SerelixStudio
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-section-bg border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Serelix Studio. Building the future, one project at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SerelixStudio;