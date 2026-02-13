'use client';

import { useState } from 'react';

export function ContactForm() {
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

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-green-800">
          Message Sent!
        </h3>
        <p className="text-green-700">
          Thanks for reaching out. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
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
  );
}
