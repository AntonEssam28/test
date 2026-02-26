import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import { tokenContext } from '../../Context/tokenContext';
import { BaseUrl } from '../../env/env.environment';

export default function ChangePassword() {
  const { userToken } = useContext(tokenContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validatePassword(formData.newPassword);

      if (!validation.length)
        newErrors.newPassword = 'Password must be at least 8 characters';
      else if (!validation.uppercase)
        newErrors.newPassword = 'Must contain uppercase letter';
      else if (!validation.lowercase)
        newErrors.newPassword = 'Must contain lowercase letter';
      else if (!validation.number)
        newErrors.newPassword = 'Must contain number';
      else if (!validation.special)
        newErrors.newPassword = 'Must contain special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async (passwordData) => {
      // ✅ الحل هنا
      const dataToSend = {
        password: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      console.log('Sending data:', dataToSend);

      const { data } = await axios.patch(
        `${BaseUrl}/users/change-password`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || 'Password changed successfully');

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    },

    onError: (err) => {
      console.log('Change password error:', err);
      console.log('Error response:', err?.response?.data);

      const errorMessage =
        err?.response?.data?.message || 'Error changing password';

      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      mutate({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
    }
  };

  return (
    <>
      
        <title>Change Password</title>
      

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}