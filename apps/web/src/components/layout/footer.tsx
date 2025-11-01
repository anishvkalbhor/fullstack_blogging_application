'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Feather, Mail, Heart, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerSections = {
  content: {
    title: 'Content',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Categories', href: '/categories' },
      { label: 'Dashboard', href: '/dashboard' },
    ]
  }
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/anishvkalbhor', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/anishvkalbhor', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/in/anishvkalbhor', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:anishkalbhor2020@gmail.com', label: 'Email' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-t border-border/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      {/* Back to Top Button - Upper Right Corner */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={scrollToTop}
          variant="outline"
          size="sm"
          className="group bg-background/50 backdrop-blur-sm hover:bg-primary/10 border-border hover:border-primary/50 shadow-lg cursor-pointer"
        >
          <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="relative container max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-linear-to-br from-primary to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Feather className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-linear-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  DevPress
                </span>
              </Link>
              
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Your space to write, learn, and grow - share tutorials, insights, and innovations in tech and beyond.
              </p>
            </div>
            
            {/* Links Sections */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.entries(footerSections).map(([key, section]) => (
                <div key={key} className="space-y-4">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-primary duration-200 text-sm hover:translate-x-1 inline-block transition-transform"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Social Links Section */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-end">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                  Connect
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2 rounded-lg bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:scale-110"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border/60 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} DevPress.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>for everyone</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}