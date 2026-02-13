import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ContactForm } from '@/components/features/ContactForm';

export default function ContactPage() {
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

            <ContactForm />
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
