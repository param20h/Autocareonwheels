import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: March 25, 2026</p>

        <div className="bg-white rounded-card p-8 sm:p-10 shadow-sm border border-gray-100 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the AutoCare platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and customers of the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Service Description</h2>
            <p>AutoCare provides an online platform for booking professional automotive maintenance and repair services. Our services include but are not limited to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>At-home and workshop-based car servicing and maintenance.</li>
              <li>Online appointment booking and scheduling system.</li>
              <li>Mechanic assignment and service tracking.</li>
              <li>Digital invoicing and payment processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. User Accounts</h2>
            <p>To use certain features, you must create an account. You are responsible for:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Providing accurate and complete registration information.</li>
              <li>Maintaining the confidentiality of your password and account credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Notifying us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Bookings & Cancellations</h2>
            <p>When you book a service through AutoCare:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Bookings are confirmed upon successful submission and are subject to mechanic availability.</li>
              <li>You may cancel a booking while it is in <strong>"PENDING"</strong> status at no charge.</li>
              <li>Once a booking is marked as <strong>"CONFIRMED"</strong> or <strong>"IN PROGRESS"</strong>, cancellations are not permitted through the platform. Please contact support for assistance.</li>
              <li>Prices displayed are estimates. Final pricing is confirmed upon service completion and may vary based on additional work identified during inspection.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Payment Terms</h2>
            <p>All payments are processed securely through our third-party payment partners. By using our Service, you agree to pay all charges incurred through your account at the prices in effect when the charges are incurred. AutoCare reserves the right to modify pricing at any time with prior notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Service Warranty</h2>
            <p>AutoCare provides a <strong>30-day warranty</strong> on all services performed through our platform. If you experience any issues directly related to the service performed, contact our support team within 30 days for a complimentary re-inspection or repair. This warranty does not cover:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Pre-existing conditions not addressed in the original service scope.</li>
              <li>Damage caused by accidents, misuse, or third-party modifications.</li>
              <li>Normal wear and tear of vehicle components.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Limitation of Liability</h2>
            <p>AutoCare shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Intellectual Property</h2>
            <p>All content, logos, design elements, and trademarks displayed on the AutoCare platform are the property of AutoCare Professional Services. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Auto City.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">10. Contact</h2>
            <p>For any questions regarding these Terms of Service, please reach out to us at:</p>
            <p className="mt-2 font-semibold text-primary">info@autocareonwheels.com.au · 0427563913</p>
            <p className="text-sm text-gray-400 mt-1">123 AutoCare Lane, Mechanical District, Auto City – 560001</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
