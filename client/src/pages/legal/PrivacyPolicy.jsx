import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: March 25, 2026</p>

        <div className="bg-white rounded-card p-8 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Information We Collect</h2>
            <p>When you use AutoCare, we collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and vehicle details when you create an account or book a service.</li>
              <li><strong>Service Data:</strong> Booking history, service preferences, vehicle make/model, and location addresses.</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through our third-party payment partners. We do not store your full card details on our servers.</li>
              <li><strong>Communications:</strong> Messages, reviews, and feedback you send to us through the contact form or customer support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Process and manage your service bookings and appointment scheduling.</li>
              <li>Communicate with you about your bookings, service updates, and promotional offers.</li>
              <li>Assign qualified mechanics based on your location and service requirements.</li>
              <li>Improve our services, develop new features, and enhance your overall experience.</li>
              <li>Ensure the safety and security of our platform and prevent fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Data Sharing & Disclosure</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong>Service Providers:</strong> Mechanics assigned to your booking receive your name, address, and vehicle details necessary to perform the service.</li>
              <li><strong>Payment Processors:</strong> Secure third-party processors handle all financial transactions.</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal proceedings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure password hashing (bcrypt), and JWT-based authentication tokens. While we strive to protect your data, no method of electronic transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Access, update, or delete your personal information through your Profile settings.</li>
              <li>Opt out of promotional communications at any time.</li>
              <li>Request a copy of the data we hold about you.</li>
              <li>Withdraw consent for data processing where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Cookies & Tracking</h2>
            <p>We use essential cookies and local storage to maintain your authentication session and preferences. We do not use third-party advertising trackers. Google OAuth integration is subject to Google's own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p className="mt-2 font-semibold text-primary">support@autocare.com · +91 98765 43210</p>
            <p className="text-sm text-gray-400 mt-1">123 AutoCare Lane, Mechanical District, Auto City – 560001</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
