import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="privacyPolicyPage">
      <section className="privacyCard">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> October 2025
        </p>

        <h2>1. Data We Collect</h2>
        <p>
          When you contact us through our website, we may collect the following
          personal information:
        </p>
        <ul>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Your Message or Inquiry</li>
        </ul>
        <p>
          This data is collected solely for the purpose of responding to your
          inquiries, comments, or requests.
        </p>

        <h2>2. Lawful Use of Data</h2>
        <p>
          We collect and process your data lawfully, fairly, and transparently,
          in compliance with applicable data protection regulations. Your data
          will not be used for marketing or shared with third parties without
          your consent.
        </p>

        <h2>3. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> your personal data
          </li>
          <li>
            <strong>Rectify</strong> incorrect or outdated information
          </li>
          <li>
            <strong>Erase</strong> your data from our records
          </li>
        </ul>
        <p>
          To exercise these rights, please contact us via the <strong>unsubscribe</strong> option
          or through the form available on our Portfolio homepage.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain personal data for a maximum period of <strong>2 years</strong> from the
          date of submission unless:
        </p>
        <ul>
          <li>You request erasure earlier, or</li>
          <li>
            You explicitly request that we retain your information for a longer
            period.
          </li>
        </ul>
        <p>
          To request extended data retention, please fill out the form on our
          Portfolio page.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We take appropriate measures to protect your personal data against
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this policy or your data, please reach
          out via our Contact Us page.
        </p>

        <div className="privacyActions">
          <a
            className="downloadButton"
            href="/DPIA-Shopping-List.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View DPIA (PDF)
          </a>
          <Link className="backHomeLink" to="/home">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
