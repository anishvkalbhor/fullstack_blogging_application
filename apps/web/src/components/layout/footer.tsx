'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Feather } from 'lucide-react';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8 md:gap-12">
        
        {/* --- Top Section: Logo + Navigation --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Feather className="h-5 w-5 text-primary transition-transform group-hover:-rotate-6" />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              DevPress
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- Divider --- */}
        <div className="border-t border-border/60" />

        {/* --- Bottom Section: Socials + Copyright --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-right">
            © {new Date().getFullYear()} <span className="font-semibold">DevPress</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
