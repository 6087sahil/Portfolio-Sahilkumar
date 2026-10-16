import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Copy, Check, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

const inquiryTypes = [
  'Full-Time Role',
  'Product Design',
  'Design System',
  'General Inquiry',
];

const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedType, setSelectedType] = useState('Full-Time Role');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const email = '6087sahilkumar@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Open mailto client with prefilled details
    const subject = encodeURIComponent(`[${selectedType}] Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hi Sahil,\n\nName: ${formData.name}\nEmail: ${formData.email}\nTopic: ${selectedType}\n\nMessage:\n${formData.message}\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#EDE8DE] text-[#161513] border-t border-[#161513]/10 overflow-hidden py-24 md:py-32"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Section Label */}
        <div className="mb-4">
          <span className="text-[#8E8980] font-mono text-xs uppercase tracking-wider block">
            05 / Get In Touch
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── LEFT COLUMN: Headline & Contact Info (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-serif text-[#161513] text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-tight leading-[1.04] mb-6">
              Let's create something{' '}
              <span className="italic text-[#8F5431] font-serif block sm:inline">
                meaningful.
              </span>
            </h2>

            <p className="text-[#5C5852] font-light text-base sm:text-lg leading-relaxed max-w-xl mb-10">
              Whether you have a full-time design role, a brand new product in need of an end-to-end design system, or just want to discuss craft &mdash; my inbox is always open.
            </p>

            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#161513]/15 shadow-[0_12px_36px_-6px_rgba(110,61,30,0.16),0_4px_16px_-2px_rgba(156,102,68,0.10)] hover:border-[#9c6644]/40 hover:shadow-[0_20px_45px_-6px_rgba(110,61,30,0.24)] transition-all duration-500 max-w-xl mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">
                  Direct Email
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#4FA765] text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4FA765] animate-pulse" />
                  Available Now
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-sm sm:text-base font-semibold text-[#161513] hover:text-[#8F5431] transition-colors break-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#8F5431] flex-shrink-0" />
                  {email}
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#161513]/20 bg-white hover:bg-[#161513] hover:text-white transition-all text-xs font-mono font-semibold text-[#161513] cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#4FA765]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status & Location Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-xs font-mono text-[#5C5852]">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#161513]/10">
                <Clock className="w-4 h-4 text-[#8E8980]" />
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#161513]/10">
                <MapPin className="w-4 h-4 text-[#8E8980]" />
                <span>India &bull; Remote worldwide</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-6 text-xs font-mono font-semibold uppercase tracking-wider text-[#5C5852]">
              <span className="text-[#8E8980]">Connect &bull;</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#8F5431] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#8F5431] transition-colors"
              >
                Dribbble
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#8F5431] transition-colors"
              >
                GitHub
              </a>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Editorial Contact Form (5 cols) ── */}
          <div className="lg:col-span-5 w-full">
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#161513]/15 shadow-[0_16px_40px_-6px_rgba(110,61,30,0.18),0_6px_20px_-2px_rgba(156,102,68,0.10)] hover:border-[#9c6644]/40 hover:shadow-[0_24px_50px_-6px_rgba(110,61,30,0.26)] transition-all duration-500">
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="py-12 flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#EBF7EE] text-[#4FA765] flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-[#161513] mb-2">
                      Message Prepared!
                    </h3>
                    <p className="text-[#5C5852] text-sm leading-relaxed max-w-xs mb-6 font-light">
                      Your email client has been opened with your inquiry. Sahil will review and respond promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-full border border-[#161513]/20 font-mono text-xs uppercase tracking-wider font-semibold text-[#161513] hover:bg-[#161513] hover:text-white transition-colors"
                    >
                      Send Another Note
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980] block mb-2 font-semibold">
                        I am interested in &bull;
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {inquiryTypes.map((type) => {
                          const isSelected = selectedType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedType(type)}
                              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#161513] text-white font-semibold'
                                  : 'bg-white border border-[#161513]/15 text-[#5C5852] hover:border-[#161513]/40'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#161513]/15 text-sm text-[#161513] placeholder:text-[#8E8980]/50 focus:outline-none focus:border-[#161513] focus:ring-1 focus:ring-[#161513] transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#161513]/15 text-sm text-[#161513] placeholder:text-[#8E8980]/50 focus:outline-none focus:border-[#161513] focus:ring-1 focus:ring-[#161513] transition-all"
                      />
                    </div>

                    {/* Message textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#8E8980] font-semibold">
                        Project Overview or Note
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell me about your product, timeline, or what you are looking to build..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#161513]/15 text-sm text-[#161513] placeholder:text-[#8E8980]/50 focus:outline-none focus:border-[#161513] focus:ring-1 focus:ring-[#161513] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="group w-full mt-2 py-3.5 px-6 rounded-full bg-[#161513] text-white hover:bg-[#8F5431] transition-all font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>

                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
