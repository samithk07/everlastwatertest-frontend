import React from 'react';
import { FaTimes, FaWrench, FaCalendar, FaImage, FaMapMarker } from 'react-icons/fa';
import { MdOutlineWaterDrop } from "react-icons/md";
import { format } from 'date-fns';

const CustomerDetails = ({ customer, onClose, onAddService }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#EEEEEE] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#222831]">Customer Details</h2>
          <button
            onClick={onClose}
            className="text-[#393E46] hover:text-[#222831] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm text-[#393E46]">Customer Name</label>
              <p className="font-semibold text-lg text-[#222831]">{customer.customerName}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm text-[#393E46]">Mobile Number</label>
              <p className="font-semibold text-lg text-[#222831]">{customer.mobile}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-[#393E46]">Address</label>
              <p className="font-semibold flex items-start space-x-2">
                <FaMapMarker className="text-[#00ADB5] mt-1" />
                <span>{customer.place}</span>
              </p>
            </div>
          </div>

          {/* Water Test Results */}
          <div className="bg-[#EEEEEE] p-4 rounded-lg">
            <h3 className="font-semibold text-[#222831] mb-3 flex items-center">
              <MdOutlineWaterDrop className="text-[#00ADB5] mr-2" />
              Water Test Results
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#393E46]">Water Source</label>
                <p className="font-medium">{customer.waterSource}</p>
              </div>
              <div>
                <label className="text-xs text-[#393E46]">TDS Value</label>
                <p className="font-medium">{customer.tds} ppm</p>
              </div>
              <div>
                <label className="text-xs text-[#393E46]">Iron Content</label>
                <p className="font-medium">{customer.ironPPM} ppm</p>
              </div>
              <div>
                <label className="text-xs text-[#393E46]">Pipeline Type</label>
                <p className="font-medium">{customer.pipelineType}</p>
              </div>
            </div>
            {customer.remarks && (
              <div className="mt-3 pt-3 border-t border-[#00ADB5] border-opacity-30">
                <label className="text-xs text-[#393E46]">Remarks</label>
                <p className="text-sm">{customer.remarks}</p>
              </div>
            )}
          </div>

          {/* Filter Information */}
          {customer.filterInstalled && (
            <div className="border-2 border-[#00ADB5] border-opacity-30 p-4 rounded-lg">
              <h3 className="font-semibold text-[#00ADB5] mb-3">Filter Installation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#393E46]">Installation Date</label>
                  <p className="font-medium flex items-center">
                    <FaCalendar className="text-[#00ADB5] mr-2" />
                    {format(new Date(customer.installationDate), 'dd MMM yyyy')}
                  </p>
                </div>
                {customer.filterImage && (
                  <div>
                    <label className="text-xs text-[#393E46]">Filter Image</label>
                    <a
                      href={customer.filterImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ADB5] hover:underline flex items-center"
                    >
                      <FaImage className="mr-2" />
                      View Image
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Service Information */}
          {customer.filterInstalled && (
            <div className="bg-[#222831] bg-opacity-5 p-4 rounded-lg">
              <h3 className="font-semibold text-[#222831] mb-3">Service Status</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#393E46]">Free Services Included:</span>
                <span className="font-bold text-[#00ADB5]">{customer.freeServicesTotal}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#393E46]">Services Completed:</span>
                <span className="font-bold">{customer.servicesDone}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#393E46]">Remaining Services:</span>
                <span className="font-bold text-[#00ADB5]">
                  {customer.freeServicesTotal - customer.servicesDone}
                </span>
              </div>

              {customer.serviceHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#00ADB5] border-opacity-30">
                  <label className="text-sm font-semibold text-[#222831] mb-2 block">
                    <FaHistory className="inline mr-2 text-[#00ADB5]" />
                    Service History
                  </label>
                  <div className="space-y-2">
                    {customer.serviceHistory.map((date, index) => (
                      <div key={index} className="text-sm flex items-center">
                        <span className="w-6 h-6 bg-[#00ADB5] bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        {format(new Date(date), 'dd MMM yyyy')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customer.servicesDone < customer.freeServicesTotal && (
                <button
                  onClick={() => {
                    onAddService(customer);
                    onClose();
                  }}
                  className="w-full mt-4 bg-[#00ADB5] text-white px-4 py-3 rounded-lg font-semibold
                           hover:bg-[#00969e] transition-colors flex items-center justify-center space-x-2"
                >
                  <FaWrench />
                  <span>Add Service</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;