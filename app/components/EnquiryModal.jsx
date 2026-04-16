'use client';

import { useState } from 'react';
import Image from 'next/image';

/* ---------- Small reusable wrapper for input + info tooltip ---------- */
function FieldWithInfo({ info, children }) {
  return (
    <div className="relative group">
      {children}

      {/* Info Icon */}
      <span className="info-icon absolute top-2 right-2 cursor-pointer text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full">
        i
      </span>

      {/* Tooltip */}
      <div className="absolute z-20 top-0 right-6 -translate-y-full mb-2 hidden group-hover:block">
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-xs">
          {info}
        </div>
      </div>
    </div>
  );
}

export default function EnquiryModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    organizationName: '',
    organizationWebsite: '',
    gstNumber: '',
    address: '',
    organizationType: '',
    poNumber: '',
    spocName: '',
    spocEmail: '',
    spocPhone: '',

    purpose: '',
    nozzleFrequency: '',
    nozzleTip: '',
    flowRate: '',
    viscosity: '',
    solvent: '',
    solute: '',
    solutionPercentage: '',
    suspendedParticles: '',
    particleSize: '',
    applicationNature: '',
    substrateType: '',
    operatingTemperature: '',
    storageTemperature: '',
    airShaping: '',

    avgParticleSize: '',
    particleYield: '',
    coatingThickness: '',
    coatingUniformity: '',
    coatAdherence: '',

    supportRequired: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setMessage('✅ Enquiry submitted successfully!');
      setTimeout(() => onClose(), 1500);
    } catch {
      setMessage('❌ Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="WaveNxD" width={140} height={50} />
            <h2 className="text-lg font-semibold text-green-700">
              Micro Spray Application Evaluation Form
            </h2>
          </div>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm">
          {/* GENERAL INFO */}
          <h3 className="font-semibold text-green-600">General Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWithInfo info="Registered legal name of your organization">
              <input
                name="organizationName"
                onChange={handleChange}
                placeholder="Organization Name"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Official website URL (if available)">
              <input
                name="organizationWebsite"
                onChange={handleChange}
                placeholder="Organization Website"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="GST Identification Number (if applicable)">
              <input
                name="gstNumber"
                onChange={handleChange}
                placeholder="GST No."
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Complete registered address">
              <input
                name="address"
                onChange={handleChange}
                placeholder="Address"
                className="input"
              />
            </FieldWithInfo>

            <select
              name="organizationType"
              onChange={handleChange}
              className="input"
            >
              <option value="">Organization Type</option>
              <option>OEM</option>
              <option>Dealer</option>
              <option>Direct Consumer</option>
              <option>Resellers</option>
              <option>Education</option>
              <option>Research</option>
              <option>Other</option>
            </select>

            <FieldWithInfo info="Purchase order or quotation reference number">
              <input
                name="poNumber"
                onChange={handleChange}
                placeholder="PO / Quotation No."
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Primary contact person for this enquiry">
              <input
                name="spocName"
                onChange={handleChange}
                placeholder="Name of SPoC"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Official email ID of contact person">
              <input
                name="spocEmail"
                onChange={handleChange}
                placeholder="Email of SPoC"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Mobile or landline number with country code">
              <input
                name="spocPhone"
                onChange={handleChange}
                placeholder="Phone No. of SPoC"
                className="input"
              />
            </FieldWithInfo>
          </div>

          {/* APPLICATION INFO */}
          <h3 className="font-semibold text-green-600">
            Application Specific Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <select name="purpose" onChange={handleChange} className="input">
              <option value="">Purpose</option>
              <option>Research</option>
              <option>Production</option>
              <option>Testing</option>
              <option>Characterizing</option>
            </select>

            <select
              name="nozzleFrequency"
              onChange={handleChange}
              className="input"
            >
              <option value="">Nozzle Frequency</option>
              <option>20–60 KHz</option>
              <option>80–120 KHz</option>
              <option>140–180 KHz</option>
            </select>

            <select name="nozzleTip" onChange={handleChange} className="input">
              <option value="">Nozzle Tip</option>
              <option>Conical</option>
              <option>Flat</option>
              <option>Torch</option>
            </select>

            <FieldWithInfo info="Liquid flow rate required during operation">
              <input
                name="flowRate"
                onChange={handleChange}
                placeholder="Flow Rate (ml/min)"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Viscosity of solution at operating temperature">
              <input
                name="viscosity"
                onChange={handleChange}
                placeholder="Viscosity (Cps)"
                className="input"
              />
            </FieldWithInfo>

            <select name="solvent" onChange={handleChange} className="input">
              <option value="">Solvent</option>
              <option>Water</option>
              <option>Alcohol</option>
              <option>Acetone</option>
              <option>Dimethylacetamide</option>
              <option>Other</option>
            </select>

            <FieldWithInfo info="Material dissolved in the solvent">
              <input
                name="solute"
                onChange={handleChange}
                placeholder="Solute"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Weight or volume percentage of solute">
              <input
                name="solutionPercentage"
                onChange={handleChange}
                placeholder="Solution Percentage"
                className="input"
              />
            </FieldWithInfo>

            <select
              name="suspendedParticles"
              onChange={handleChange}
              className="input"
            >
              <option value="">Suspended Particles</option>
              <option>Yes</option>
              <option>No</option>
            </select>

            <FieldWithInfo info="Droplet or particle size if known">
              <input
                name="particleSize"
                onChange={handleChange}
                placeholder="Droplet Size (if any)"
                className="input"
              />
            </FieldWithInfo>

            <select
              name="applicationNature"
              onChange={handleChange}
              className="input"
            >
              <option value="">Nature of Application</option>
              <option>Coating</option>
              <option>Vacuum Coating</option>
              <option>Spray Dryer</option>
              <option>Other</option>
            </select>

            <FieldWithInfo info="Material on which coating/spray is applied">
              <input
                name="substrateType"
                onChange={handleChange}
                placeholder="Substrate Type"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Operating temperature range during process">
              <input
                name="operatingTemperature"
                onChange={handleChange}
                placeholder="Min / Max Operating Temperature"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Safe storage temperature of nozzle">
              <input
                name="storageTemperature"
                onChange={handleChange}
                placeholder="Nozzle Storage Temperature"
                className="input"
              />
            </FieldWithInfo>

            <select name="airShaping" onChange={handleChange} className="input">
              <option value="">Air Shaping Required?</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {/* OUTCOME */}
          <h3 className="font-semibold text-green-600">Desired Outcome</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FieldWithInfo info="Expected average droplet size">
              <input
                name="avgParticleSize"
                onChange={handleChange}
                placeholder="Average Droplet Size"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Expected output yield of droplets">
              <input
                name="particleYield"
                onChange={handleChange}
                placeholder="Droplet Yield"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Required coating thickness in microns">
              <input
                name="coatingThickness"
                onChange={handleChange}
                placeholder="Coating Thickness"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Uniformity requirement across surface">
              <input
                name="coatingUniformity"
                onChange={handleChange}
                placeholder="Coating Uniformity"
                className="input"
              />
            </FieldWithInfo>

            <FieldWithInfo info="Expected adhesion strength of coating">
              <input
                name="coatAdherence"
                onChange={handleChange}
                placeholder="Coat Adherence"
                className="input"
              />
            </FieldWithInfo>
          </div>

          <FieldWithInfo info="Mention any technical or commercial support needed">
            <textarea
              name="supportRequired"
              onChange={handleChange}
              placeholder="Any support required before procurement?"
              className="input h-24"
            />
          </FieldWithInfo>

          {message && <p className="text-center font-medium">{message}</p>}

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
