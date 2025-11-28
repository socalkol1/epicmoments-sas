'use client';

import { useState } from 'react';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in production, this would send to an API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900">
              Get in Touch
            </h1>
            <p className="mb-8 text-slate-500">
              Have questions or ready to book? Fill out the form and we&apos;ll get
              back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mb-4 text-5xl">✓</div>
                <h3 className="mb-2 text-xl font-semibold text-green-800">
                  Message Sent!
                </h3>
                <p className="text-green-700">
                  Thanks for reaching out. We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select an event type</option>
                    <option value="single">Single Game/Event</option>
                    <option value="tournament">Tournament</option>
                    <option value="season">Season Coverage</option>
                    <option value="team">Team Photos</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Tell us about your event, team, or any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg px-8 py-4 text-base font-semibold text-white transition-colors ${
                    isSubmitting
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Contact Information
              </h2>
              <div className="mb-5">
                <div className="mb-1 text-sm text-slate-500">Email</div>
                <a
                  href="mailto:info@epicmoments.photo"
                  className="text-base text-blue-600 no-underline hover:underline"
                >
                  info@epicmoments.photo
                </a>
              </div>
              <div className="mb-5">
                <div className="mb-1 text-sm text-slate-500">Phone</div>
                <a
                  href="tel:+15551234567"
                  className="text-base text-slate-900 no-underline hover:underline"
                >
                  (555) 123-4567
                </a>
              </div>
              <div>
                <div className="mb-1 text-sm text-slate-500">Hours</div>
                <div className="text-base text-slate-900">
                  Mon-Fri: 9am - 6pm EST
                  <br />
                  Weekends: By appointment
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-8">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Quick Response Guarantee
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                We understand time-sensitive event bookings. That&apos;s why we guarantee
                a response within 24 hours on business days. For urgent inquiries, give
                us a call!
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-900">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 no-underline transition-colors hover:bg-slate-50"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
