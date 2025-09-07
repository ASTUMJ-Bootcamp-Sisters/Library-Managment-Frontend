import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/settingsStore";

const StudentRulesFloating = ({ icon }) => {
  const { settings, fetchSettings } = useSettingsStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <>
      {/* Icon Button for Navbar */}
      <button
        className="bg-gradient-to-r from-[#5c4033] to-[#7b5e57] text-white rounded-full p-2 shadow border-2 border-[#e6d5c3] hover:from-[#7b5e57] hover:to-[#5c4033] transition-all duration-200"
        onClick={() => setOpen(true)}
        aria-label="Show Library Rules & Info"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {icon ? icon : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] rounded-2xl shadow-lg max-w-lg w-full p-6 sm:p-8 overflow-y-auto max-h-[80vh] relative">
            <button
              className="absolute top-4 right-4 text-[#5c4033] font-bold text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-[#e6d5c3]"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-extrabold text-[#4a2c1a] mb-4 text-center font-serif">Library Rules & Account Info</h2>
            {settings ? (
              <div className="space-y-4 text-[#5c4033]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div><span className="font-medium">Bank Name:</span> {settings.bankName}</div>
                  <div><span className="font-medium">Account Number:</span> {settings.accountNumber}</div>
                  <div><span className="font-medium">Account Holder:</span> {settings.accountHolder}</div>
                  <div><span className="font-medium">Membership Fee:</span> {settings.membershipFee}</div>
                  <div><span className="font-medium">Membership Duration:</span> {settings.membershipDuration} months</div>
                  <div><span className="font-medium">Max Borrow Limit:</span> {settings.maxBorrowLimit}</div>
                  <div><span className="font-medium">Borrow Duration (days):</span> {settings.borrowDurationDays}</div>
                  <div><span className="font-medium">Late Fee Per Day:</span> {settings.lateFeePerDay}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border">
                  <h3 className="font-semibold mb-2 text-[#5c4033]">Library Rules</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Members can borrow books up to the max limit.</li>
                    <li>Users (non-members) pay per book; members do not.</li>
                    <li>When users borrow, both ID card and payment image must be uploaded.</li>
                    <li>Membership requests require email verification.</li>
                    <li>Late returns incur a daily fee.</li>
                    <li>Borrow duration must be respected.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading info...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentRulesFloating;
