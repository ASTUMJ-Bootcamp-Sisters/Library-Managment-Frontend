import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    approveMembership,
    deleteMembership,
    getAllMemberships,
    getMembershipStatus,
    rejectMembership,
    requestEmailOtp,
    requestMembership,
    verifyEmailOtp
} from '../api/membershipApi';

const useMembershipStore = create(
  devtools(
    (set) => ({
      membership: null,
      memberships: [],
      loading: false,
      error: null,
      emailVerificationStatus: {
        isRequested: false,
        isVerified: false,
        loading: false,
        error: null
      },

      // Request membership
      requestMembership: async (formData) => {
        set({ loading: true, error: null });
        try {
          const response = await requestMembership(formData);
          set({ 
            membership: response.membership,
            loading: false 
          });
          return response;
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Failed to submit membership request' 
          });
          throw error;
        }
      },

      // Get user's membership status
      getMembershipStatus: async () => {
        set({ loading: true, error: null });
        try {
          const response = await getMembershipStatus();
          set({ 
            membership: response.membership,
            loading: false 
          });
          return response.membership;
        } catch (error) {
          // If 404, it means user has no membership
          if (error.status === 404) {
            set({ membership: null, loading: false });
            return null;
          }
          set({ 
            loading: false, 
            error: error.message || 'Failed to get membership status' 
          });
          throw error;
        }
      },

      // Admin: Get all memberships
      getAllMemberships: async () => {
        set({ loading: true, error: null });
        try {
          const response = await getAllMemberships();
          set({ 
            memberships: response.memberships,
            loading: false 
          });
          return response.memberships;
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Failed to fetch memberships' 
          });
          throw error;
        }
      },

      // Admin: Approve membership
      approveMembership: async (membershipId, expiryMonths) => {
        set({ loading: true, error: null });
        try {
          const response = await approveMembership(membershipId, expiryMonths);
          set(state => ({
            memberships: state.memberships.map(m => 
              m._id === membershipId ? response.membership : m
            ),
            loading: false
          }));
          return response;
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Failed to approve membership' 
          });
          throw error;
        }
      },

      // Admin: Reject membership
      rejectMembership: async (membershipId, reason) => {
        set({ loading: true, error: null });
        try {
          const response = await rejectMembership(membershipId, reason);
          set(state => ({
            memberships: state.memberships.map(m => 
              m._id === membershipId ? response.membership : m
            ),
            loading: false
          }));
          return response;
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Failed to reject membership' 
          });
          throw error;
        }
      },

      // Admin: Delete membership
      deleteMembership: async (membershipId) => {
        set({ loading: true, error: null });
        try {
          await deleteMembership(membershipId);
          set(state => ({
            memberships: state.memberships.filter(m => m._id !== membershipId),
            loading: false
          }));
          return { success: true };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message || 'Failed to delete membership' 
          });
          throw error;
        }
      },

      // Email verification functions
      requestEmailOtp: async () => {
        set(state => ({
          emailVerificationStatus: {
            ...state.emailVerificationStatus,
            loading: true,
            error: null
          }
        }));
        
        try {
          const response = await requestEmailOtp();
          set(state => ({
            emailVerificationStatus: {
              ...state.emailVerificationStatus,
              isRequested: true,
              loading: false
            }
          }));
          return response;
        } catch (error) {
          set(state => ({
            emailVerificationStatus: {
              ...state.emailVerificationStatus,
              loading: false,
              error: error.message || 'Failed to request OTP'
            }
          }));
          throw error;
        }
      },

      verifyEmailOtp: async (otp) => {
        set(state => ({
          emailVerificationStatus: {
            ...state.emailVerificationStatus,
            loading: true,
            error: null
          }
        }));
        
        try {
          const response = await verifyEmailOtp(otp);
          set(state => ({
            emailVerificationStatus: {
              ...state.emailVerificationStatus,
              isVerified: true,
              loading: false
            }
          }));
          return response;
        } catch (error) {
          set(state => ({
            emailVerificationStatus: {
              ...state.emailVerificationStatus,
              loading: false,
              error: error.message || 'Failed to verify OTP'
            }
          }));
          throw error;
        }
      },

      clearErrors: () => set({ error: null }),
    }),
    { name: 'membership-store' }
  )
);

export default useMembershipStore;
