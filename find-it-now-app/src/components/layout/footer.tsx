'use client';

import { PATHS } from '@/constants/paths';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export const Footer = () => {
  const { navigateToSection } = useScrollToSection();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/#Features', scroll: true, id: 'Features' },
      { label: 'How It Works', href: '/#HowItWorks', scroll: true, id: 'HowItWorks' },
      { label: 'Report Item', href: PATHS.report() },
    ],
    organization: [{ label: 'Register Organization', href: '/service#Home' }],
    support: [
      { label: 'Contact Us', href: 'mailto:support@finditnow.com' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  };

  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 justify-between gap-8 md:grid-cols-2 lg:flex lg:px-6">
          {/* Brand Section */}
          <div className="flex flex-col justify-between lg:col-span-1">
            <div className="mb-20">
              <h2 className="text-4xl leading-9 tracking-tighter">
                <span>With FindItNow,</span>
                <br />
                <span className="font-extrabold">
                  Lost doesn’t mean
                  <br />
                  gone forever.
                </span>
              </h2>
            </div>
            <div>
              <div className="mb-6 flex items-center space-x-2">
                <div className="flex items-center">
                  <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                  <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">FindItNow</h1>
                </div>
              </div>
              {/* Contact Info */}
              <div className="space-y-3 pl-1">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@finditnow.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Vancouver, Canada</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-24">
            {/* Product & Organization Links */}
            <div className="border-primary">
              <div>
                <h3 className="mb-6 text-lg font-semibold text-gray-900">Product</h3>
                <ul className="mb-8 space-y-2">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      {link.scroll === true ? (
                        <a
                          href={link.href}
                          className="hover:text-primary text-gray-500 transition-colors duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToSection(link.id);
                          }}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          className="hover:text-primary text-gray-500 transition-colors duration-300"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-6 text-lg font-semibold text-gray-900">Organization</h3>
                <ul className="pace-y-2">
                  {footerLinks.organization.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="hover:text-primary text-gray-500 transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary text-gray-500 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} FindItNow. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#privacy"
                className="hover:text-primary text-gray-500 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="hover:text-primary text-gray-500 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="hover:text-primary text-gray-500 transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
