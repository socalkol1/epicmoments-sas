import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | EpicMoments Sports Photography',
  description:
    'Get in touch with EpicMoments Sports Photography. Book your event or ask questions about our services.',
  openGraph: {
    title: 'Contact | EpicMoments Sports Photography',
    description:
      'Get in touch with EpicMoments Sports Photography. Book your event or ask questions about our services.',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
