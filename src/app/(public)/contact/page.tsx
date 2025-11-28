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

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500 as const,
    color: '#374151',
    marginBottom: '8px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
          }}
        >
          {/* Contact Form */}
          <div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '16px',
              }}
            >
              Get in Touch
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                marginBottom: '32px',
              }}
            >
              Have questions or ready to book? Fill out the form and we&apos;ll get
              back to you within 24 hours.
            </p>

            {submitted ? (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#166534',
                    marginBottom: '8px',
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: '#15803d' }}>
                  Thanks for reaching out. We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Your name"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="your@email.com"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select an event type</option>
                    <option value="single">Single Game/Event</option>
                    <option value="tournament">Tournament</option>
                    <option value="season">Season Coverage</option>
                    <option value="team">Team Photos</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    placeholder="Tell us about your event, team, or any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    backgroundColor: isSubmitting ? '#94a3b8' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <div
              style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px',
                }}
              >
                Contact Information
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '4px',
                  }}
                >
                  Email
                </div>
                <a
                  href="mailto:info@epicmoments.photo"
                  style={{
                    fontSize: '16px',
                    color: '#2563eb',
                    textDecoration: 'none',
                  }}
                >
                  info@epicmoments.photo
                </a>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '4px',
                  }}
                >
                  Phone
                </div>
                <a
                  href="tel:+15551234567"
                  style={{
                    fontSize: '16px',
                    color: '#0f172a',
                    textDecoration: 'none',
                  }}
                >
                  (555) 123-4567
                </a>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '4px',
                  }}
                >
                  Hours
                </div>
                <div style={{ fontSize: '16px', color: '#0f172a' }}>
                  Mon-Fri: 9am - 6pm EST
                  <br />
                  Weekends: By appointment
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#0f172a',
                padding: '32px',
                borderRadius: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '16px',
                }}
              >
                Quick Response Guarantee
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                }}
              >
                We understand time-sensitive event bookings. That&apos;s why we guarantee
                a response within 24 hours on business days. For urgent inquiries, give
                us a call!
              </p>
            </div>

            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '12px',
                }}
              >
                Follow Us
              </h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#475569',
                      textDecoration: 'none',
                      border: '1px solid #e2e8f0',
                    }}
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
