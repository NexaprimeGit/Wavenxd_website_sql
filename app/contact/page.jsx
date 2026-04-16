'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        alert('Failed to submit contact form');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="contact-hero">
        <span className="contact-badge">Contact Us</span>
        <h1>
          Get in Touch with <span>WaveNxD</span>
        </h1>
        <p>
          Precision ultrasonic spray solutions built for demanding industrial
          applications.
        </p>
      </section>

      {/* MAIN */}
      <section className="contact-container">
        {/* LEFT FORM */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <p className="form-subtext">
            Fill out the form and our team will get back to you shortly.
          </p>

          {success && (
            <p className="success-text">Message sent successfully!</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Atharv Apugade"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Your Email</label>
              <input
                type="email"
                placeholder="wavenxd@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Company (Optional)</label>
              <input
                type="text"
                name="company"
                placeholder="WaveNxD"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* RIGHT – CLEAN INFO PANEL */}
        {/* RIGHT – INFO CARD */}
        <div className="contact-info">
          <div className="info-card">
            <h3 className="info-title">WaveNxD Technologies</h3>

            <p className="info-desc">
              We design and manufacture ultrasonic spray systems for industries
              where precision, repeatability, and reliability are critical.
            </p>

            <div className="info-divider" />

            <div className="info-item">
              <span>📍 Location</span>
              <p>Kolhapur, Maharashtra, India</p>
            </div>

            <div className="info-item">
              <span>📞 Phone</span>
              <p>+91 98220 29999</p>
            </div>

            <div className="info-item">
              <span>✉️ Email</span>
              <p>info@wavenxd.com</p>
            </div>

            <div className="info-divider" />

            <p className="info-note">
              Serving Medical, Electronics, Energy, and Automotive industries.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
