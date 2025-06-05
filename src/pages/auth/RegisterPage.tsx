import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Divider, message } from 'antd';
import { Mail, Lock, Lightbulb, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading } = useAuth();
  const [form] = Form.useForm();
  const [registering, setRegistering] = useState(false);

  const onFinish = async (values: { email: string; password: string; fullName: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setRegistering(true);
    
    try {
      const success = await register(values.email, values.password, values.fullName);
      
      if (success) {
        message.success('Registration successful!');
        navigate('/events');
      } else {
        message.error('Email already exists');
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      
      if (success) {
        message.success('Login successful!');
        navigate('/events');
      }
    } catch (error) {
      message.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white p-3 rounded-full shadow-sm mb-4">
            <Lightbulb className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Teko Innovation</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card 
          className="w-full shadow-md hover:shadow-lg transition-shadow duration-300"
          bordered={false}
        >
          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input 
                prefix={<User size={16} className="mr-2 text-gray-400" />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<Mail size={16} className="mr-2 text-gray-400" />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<Lock size={16} className="mr-2 text-gray-400" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} className="mr-2 text-gray-400" />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={registering}
                className="bg-primary-500 hover:bg-primary-600"
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or continue with</Divider>

          <Button 
            block 
            size="large" 
            onClick={handleGoogleLogin} 
            className="flex items-center justify-center"
            loading={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="mr-2" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Login here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;