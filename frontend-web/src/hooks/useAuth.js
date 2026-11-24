import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, updateAgentProfile } from '@/store/slices/authSlice';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // 1. Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    }
  });

  // 2. Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        ...payload,
        type: payload.type || 'EMAIL_VERIFICATION'
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.user && data?.data?.tokens?.accessToken) {
        dispatch(
          setCredentials({
            user: data.data.user,
            accessToken: data.data.tokens.accessToken
          })
        );
      }
    }
  });

  // 3. Resend OTP Mutation
  const resendOtpMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
        ...payload,
        type: payload.type || 'EMAIL_VERIFICATION'
      });
      return response.data;
    }
  });

  // 4. Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.user && data?.data?.tokens?.accessToken) {
        dispatch(
          setCredentials({
            user: data.data.user,
            accessToken: data.data.tokens.accessToken
          })
        );
      }
    }
  });

  // 5. Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      return response.data;
    }
  });

  // 6. Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
      return response.data;
    }
  });

  // 7. Agent Profile Query (for checking and resuming onboarding)
  const agentProfileQuery = useQuery({
    queryKey: ['agent-profile'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.AGENT.PROFILE);
      return response.data?.data?.profile;
    },
    enabled: false
  });

  // 8. Agent Step 2: Professional Info Mutation
  const updateProfessionalInfoMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(API_ENDPOINTS.AGENT.PROFESSIONAL_INFO, data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.profile) {
        dispatch(updateAgentProfile(data.data.profile));
        queryClient.invalidateQueries({ queryKey: ['agent-profile'] });
      }
    }
  });

  // 9. Agent Step 3: Document Upload Mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.AGENT.DOCUMENTS, payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data?.profile) {
        dispatch(updateAgentProfile(data.data.profile));
        queryClient.invalidateQueries({ queryKey: ['agent-profile'] });
      }
    }
  });

  return {
    registerMutation,
    verifyOtpMutation,
    resendOtpMutation,
    loginMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    agentProfileQuery,
    updateProfessionalInfoMutation,
    uploadDocumentMutation
  };
};
