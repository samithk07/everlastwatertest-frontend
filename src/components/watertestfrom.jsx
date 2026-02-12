import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCamera, FaCalendar, FaCheck, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const WaterTestForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    place: '',
    waterSource: 'Borewell',
    tds: '',
    ironPPM: '',
    pipelineType: 'Motor to Tank',
    remarks: '',
    filterInstalled: false,
    filterImage: '',
    installationDate: '',
  });

  const [showFilterFields, setShowFilterFields] = useState(false);

  const waterSources = ['Borewell', 'Open Well', 'Corporation', 'Other'];
  const pipelineTypes = ['PVC', 'UPVC'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'filterInstalled') {
      setShowFilterFields(checked);
      if (!checked) {
        setFormData(prev => ({
          ...prev,
          filterImage: '',
          installationDate: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newEntry = {
        ...formData,
        id: Date.now().toString(),
        freeServicesTotal: formData.filterInstalled ? 3 : 0,
        servicesDone: 0,
        serviceHistory: [],
        createdAt: new Date().toISOString()
      };

      // Save to JSON Server
      const response = await axios.post(`${API_URL}/watertests`, newEntry);
      
      // Send WhatsApp notification
      await axios.post(`${API_URL}/send-whatsapp`, {
        customerName: formData.customerName,
        mobile: formData.mobile,
        place: formData.place,
        waterSource: formData.waterSource,
        tds: formData.tds,
        ironPPM: formData.ironPPM,
        pipelineType: formData.pipelineType
      });

      toast.success('Water test entry added successfully! 📊');
      toast.success('WhatsApp notification sent to admin! 📱');

      // Clear form
      setFormData({
        customerName: '',
        mobile: '',
        place: '',
        waterSource: 'Borewell',
        tds: '',
        ironPPM: '',
        pipelineType: 'Motor to Tank',
        remarks: '',
        filterInstalled: false,
        filterImage: '',
        installationDate: '',
      });
      setShowFilterFields(false);
      
      if (onFormSubmit) onFormSubmit();
      
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save entry. Please try again.');
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#222831] mb-6 pb-4 border-b-2 border-[#00ADB5] border-opacity-30">
        📝 New Water Test Entry
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Customer Name <span className="text-[#00ADB5]">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter customer name"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Mobile Number <span className="text-[#00ADB5]">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter 10-digit mobile"
              pattern="[0-9]{10}"
            />
          </div>

          {/* Place/Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Place / Address <span className="text-[#00ADB5]">*</span>
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter address"
            />
          </div>

          {/* Water Source */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Water Source <span className="text-[#00ADB5]">*</span>
            </label>
            <select
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              className="input-field"
            >
              {waterSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* TDS Value */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              TDS Value (ppm) <span className="text-[#00ADB5]">*</span>
            </label>
            <input
              type="number"
              name="tds"
              value={formData.tds}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter TDS value"
            />
          </div>

          {/* Iron Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Iron Content (ppm) <span className="text-[#00ADB5]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="ironPPM"
              value={formData.ironPPM}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter iron content"
            />
          </div>

          {/* Pipeline Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Pipeline Type <span className="text-[#00ADB5]">*</span>
            </label>
            <select
              name="pipelineType"
              value={formData.pipelineType}
              onChange={handleChange}
              className="input-field"
            >
              {pipelineTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#393E46]">
              Remarks
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="input-field"
              placeholder="Any remarks (optional)"
            />
          </div>
        </div>

        {/* Filter Installed Checkbox */}
        <div className="flex items-center space-x-3 p-4 bg-[#EEEEEE] rounded-lg">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="filterInstalled"
              checked={formData.filterInstalled}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00ADB5] peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ADB5]"></div>
            <span className="ml-3 text-sm font-semibold text-[#393E46]">
              Filter Installed?
            </span>
          </label>
        </div>

        {/* Filter Additional Fields */}
        {showFilterFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#00ADB5] bg-opacity-5 rounded-lg border-2 border-[#00ADB5] border-opacity-20">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#393E46]">
                <FaCamera className="inline mr-2 text-[#00ADB5]" />
                Filter Image URL
              </label>
              <input
                type="url"
                name="filterImage"
                value={formData.filterImage}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter image URL"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#393E46]">
                <FaCalendar className="inline mr-2 text-[#00ADB5]" />
                Installation Date
              </label>
              <input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2 bg-[#222831] bg-opacity-5 p-4 rounded-lg">
              <p className="text-sm text-[#222831]">
                🎉 <span className="font-bold text-[#00ADB5]">3 Free Services</span> included with filter installation!
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <FaCheck />
            <span>Save Water Test Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaterTestForm;