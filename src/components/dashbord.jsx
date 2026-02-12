import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaFilter, FaWrench, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';
import SearchBar from './searchbar';
import CustomerDetails from './customerdetails';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    filterInstalled: 'all',
    place: '',
    date: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/watertests`);
      setCustomers(response.data);
      setFilteredCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => 
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tds.includes(searchTerm) ||
      customer.ironPPM.includes(searchTerm)
    );
    
    setFilteredCustomers(filtered);
  };

  const handleClearSearch = () => {
    setFilteredCustomers(customers);
  };

  const handleAddService = async (customer) => {
    if (customer.servicesDone >= customer.freeServicesTotal) {
      toast.error('No free services remaining!');
      return;
    }

    try {
      const updatedCustomer = {
        ...customer,
        servicesDone: customer.servicesDone + 1,
        serviceHistory: [...customer.serviceHistory, new Date().toISOString().split('T')[0]]
      };

      await axios.patch(`${API_URL}/watertests/${customer.id}`, {
        servicesDone: updatedCustomer.servicesDone,
        serviceHistory: updatedCustomer.serviceHistory
      });

      toast.success(`Service added for ${customer.customerName}! 🛠️`);
      
      // Refresh data
      fetchCustomers();
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(updatedCustomer);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const applyFilters = () => {
    let filtered = [...customers];

    if (filters.filterInstalled !== 'all') {
      filtered = filtered.filter(c => 
        c.filterInstalled.toString() === filters.filterInstalled
      );
    }

    if (filters.place) {
      filtered = filtered.filter(c => 
        c.place.toLowerCase().includes(filters.place.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(c => 
        c.createdAt.split('T')[0] === filters.date
      );
    }

    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, customers]);

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="card">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>

      {/* Filters Section */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-[#00ADB5]" />
          <h3 className="text-lg font-semibold text-[#222831]">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.filterInstalled}
            onChange={(e) => setFilters({...filters, filterInstalled: e.target.value})}
            className="input-field"
          >
            <option value="all">All Installations</option>
            <option value="true">Filter Installed</option>
            <option value="false">Filter Not Installed</option>
          </select>

          <input
            type="text"
            placeholder="Filter by place"
            value={filters.place}
            onChange={(e) => setFilters({...filters, place: e.target.value})}
            className="input-field"
          />

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
            className="input-field"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-xl font-bold text-[#222831] mb-6">
          📋 Customer Records
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ADB5]"></div>
          </div>
        ) : (
          <div className="min-w-full">
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="bg-[#EEEEEE] rounded-lg p-4 cursor-pointer hover:bg-[#e5e5e5] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[#222831]">{customer.customerName}</h4>
                      <p className="text-sm text-[#393E46]">{customer.mobile}</p>
                    </div>
                    <span className={`badge ${customer.filterInstalled ? 'badge-success' : 'badge-warning'}`}>
                      {customer.filterInstalled ? '✓ Filter' : '✗ No Filter'}
                    </span>
                  </div>
                  <p className="text-sm text-[#393E46]">{customer.place}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm">
                      <span className="font-semibold">TDS:</span> {customer.tds} ppm
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Iron:</span> {customer.ironPPM} ppm
                    </div>
                  </div>
                  {customer.filterInstalled && (
                    <div className="mt-3 pt-3 border-t border-[#00ADB5] border-opacity-30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Services: {customer.servicesDone}/{customer.freeServicesTotal}</span>
                        <span className="text-sm font-semibold text-[#00ADB5]">
                          Remaining: {customer.freeServicesTotal - customer.servicesDone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View - Table */}
            <table className="hidden md:table min-w-full">
              <thead className="bg-[#222831] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Place</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">TDS</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Iron</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Filter</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Services</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Remaining</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="hover:bg-[#EEEEEE] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{customer.customerName}</td>
                    <td className="px-6 py-4 text-sm">{customer.mobile}</td>
                    <td className="px-6 py-4 text-sm">{customer.place}</td>
                    <td className="px-6 py-4 text-sm">{customer.tds} ppm</td>
                    <td className="px-6 py-4 text-sm">{customer.ironPPM} ppm</td>
                    <td className="px-6 py-4 text-sm">
                      {customer.filterInstalled ? (
                        <span className="badge badge-success">
                          <FaCheck className="inline mr-1" /> Yes
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <FaTimes className="inline mr-1" /> No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer.servicesDone}/{customer.freeServicesTotal}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-bold text-[#00ADB5]">
                        {customer.freeServicesTotal - customer.servicesDone}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer.filterInstalled && customer.servicesDone < customer.freeServicesTotal && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddService(customer);
                          }}
                          className="bg-[#00ADB5] text-white px-3 py-1 rounded-lg text-xs font-semibold
                                   hover:bg-[#00969e] transition-colors flex items-center space-x-1"
                        >
                          <FaWrench />
                          <span>Add Service</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-[#393E46]">
                No customers found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onAddService={handleAddService}
        />
      )}
    </div>
  );
};

export default Dashboard;