import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/settingsStore";

const AdminSettings = () => {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsStore();
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    membershipFee: 0,
    membershipDuration: 0,
    maxBorrowLimit: 0,
    borrowDurationDays: 0,
    lateFeePerDay: 0,
    payPerBorrowEnabled: false,
    notifyBeforeDays: 0,
    notificationsEnabled: false
  });

  // Fetch settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync settings from store into local form
  useEffect(() => {
    if (settings) {
      setForm({
        bankName: settings.bankName || "",
        accountNumber: settings.accountNumber || "",
        accountHolder: settings.accountHolder || "",
        membershipFee: settings.membershipFee || 0,
        membershipDuration: settings.membershipDuration || 0,
        maxBorrowLimit: settings.maxBorrowLimit || 0,
        borrowDurationDays: settings.borrowDurationDays || 0,
        lateFeePerDay: settings.lateFeePerDay || 0,
        payPerBorrowEnabled: settings.payPerBorrowEnabled || false,
        notifyBeforeDays: settings.notifyBeforeDays || 0,
        notificationsEnabled: settings.notificationsEnabled || false
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await updateSettings(form, token);
      setToast({ show: true, message: "Settings updated successfully!", type: "success" });
      fetchSettings();
    } catch (err) {
      setToast({ show: true, message: "Failed to update settings.", type: "error" });
    }
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#5c4033] mb-6">
        Library Settings
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-[#5c4033] bg-[#f8f5f2] border ${toast.type === "success" ? "border-green-600" : "border-red-600"}`}>
          {toast.message}
        </div>
      )}
      {settings && (
        <>
          {/* Current raw settings preview */}
            <div className="mb-6 p-6 rounded-lg shadow bg-white border max-w-2xl">
              <h2 className="font-semibold mb-4 text-[#5c4033]">Current Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Bank Name:</span> {settings.bankName}</div>
                <div><span className="font-medium">Account Number:</span> {settings.accountNumber}</div>
                <div><span className="font-medium">Account Holder:</span> {settings.accountHolder}</div>
                <div><span className="font-medium">Membership Fee:</span> {settings.membershipFee}</div>
                <div><span className="font-medium">Membership Duration:</span> {settings.membershipDuration}</div>
                <div><span className="font-medium">Max Borrow Limit:</span> {settings.maxBorrowLimit}</div>
                <div><span className="font-medium">Borrow Duration (days):</span> {settings.borrowDurationDays}</div>
                <div><span className="font-medium">Late Fee Per Day:</span> {settings.lateFeePerDay}</div>
                <div><span className="font-medium">Pay Per Borrow Enabled:</span> {settings.payPerBorrowEnabled ? "Yes" : "No"}</div>
                <div><span className="font-medium">Notify Before Days:</span> {settings.notifyBeforeDays}</div>
                <div><span className="font-medium">Notifications Enabled:</span> {settings.notificationsEnabled ? "Yes" : "No"}</div>
              </div>
            </div>

          {/* Editable settings form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-2xl bg-white shadow-md p-6 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Bank Name:</label>
                <input type="text" name="bankName" value={form.bankName} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mb-1">Account Number:</label>
                <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mb-1">Account Holder:</label>
                <input type="text" name="accountHolder" value={form.accountHolder} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mb-1">Membership Fee:</label>
                <input type="number" name="membershipFee" value={form.membershipFee} onChange={handleChange} className="w-full border p-2 rounded" min="0" />
              </div>
              <div>
                <label className="block font-medium mb-1">Membership Duration:</label>
                <input type="number" name="membershipDuration" value={form.membershipDuration} onChange={handleChange} className="w-full border p-2 rounded" min="0" />
              </div>
              <div>
                <label className="block font-medium mb-1">Max Borrow Limit:</label>
                <input type="number" name="maxBorrowLimit" value={form.maxBorrowLimit} onChange={handleChange} className="w-full border p-2 rounded" min="0" />
              </div>
              <div>
                <label className="block font-medium mb-1">Borrow Duration (days):</label>
                <input type="number" name="borrowDurationDays" value={form.borrowDurationDays} onChange={handleChange} className="w-full border p-2 rounded" min="1" />
              </div>
              <div>
                <label className="block font-medium mb-1">Late Fee Per Day:</label>
                <input type="number" name="lateFeePerDay" value={form.lateFeePerDay} onChange={handleChange} className="w-full border p-2 rounded" min="0" />
              </div>
              <div className="flex items-center mt-2">
                <label className="font-medium">Pay Per Borrow Enabled:</label>
                <input type="checkbox" name="payPerBorrowEnabled" checked={form.payPerBorrowEnabled} onChange={handleChange} className="ml-3" />
              </div>
              <div>
                <label className="block font-medium mb-1">Notify Before Days:</label>
                <input type="number" name="notifyBeforeDays" value={form.notifyBeforeDays} onChange={handleChange} className="w-full border p-2 rounded" min="0" />
              </div>
              <div className="flex items-center mt-2">
                <label className="font-medium">Notifications Enabled:</label>
                <input type="checkbox" name="notificationsEnabled" checked={form.notificationsEnabled} onChange={handleChange} className="ml-3" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5c4033] hover:bg-[#4a3329] text-white px-4 py-2 rounded-lg transition mt-4"
            >
              Update Settings
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminSettings;
