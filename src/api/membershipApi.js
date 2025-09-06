import api from './axios';

// Request a new membership
export const requestMembership = async (formData) => {
  try {
    const response = await api.post('/membership/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit membership request' };
  }
};

// Get current user's membership status
export const getMembershipStatus = async () => {
  try {
    const response = await api.get('/membership/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch membership status' };
  }
};

// Admin: Get all memberships
export const getAllMemberships = async () => {
  try {
    const response = await api.get('/membership/admin/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch memberships' };
  }
};

// Admin: Approve a membership
export const approveMembership = async (membershipId, expiryMonths = 1) => {
  try {
    const response = await api.put(`/membership/admin/approve/${membershipId}`, { expiryMonths });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve membership' };
  }
};

// Admin: Reject a membership
export const rejectMembership = async (membershipId, reason) => {
  try {
    const response = await api.put(`/membership/admin/reject/${membershipId}`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject membership' };
  }
};

// Admin: Delete a membership
export const deleteMembership = async (membershipId) => {
  try {
    const response = await api.delete(`/membership/admin/delete/${membershipId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete membership' };
  }
};

// Request email verification OTP
export const requestEmailOtp = async () => {
  try {
    const response = await api.post('/auth/request-email-otp');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request OTP' };
  }
};

// Verify email with OTP
export const verifyEmailOtp = async (otp) => {
  try {
    const response = await api.post('/auth/verify-email-otp', { otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify OTP' };
  }
};
