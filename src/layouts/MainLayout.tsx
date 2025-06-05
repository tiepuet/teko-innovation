import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button, Drawer } from 'antd';
import { MenuIcon, User, LogOut, Home, Calendar, Users, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: '/events', label: 'Events', icon: <Calendar size={18} /> },
    { key: '/my-teams', label: 'My Teams', icon: <Users size={18} /> },
    { key: '/my-ideas', label: 'My Ideas', icon: <Lightbulb size={18} /> },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ key: '/admin', label: 'Admin Dashboard', icon: <Home size={18} /> });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<User size={16} />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogOut size={16} />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      {/* Desktop Header */}
      <Header className="bg-white shadow-sm px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <Lightbulb className="text-primary-500" size={24} />
            <span className="ml-2 text-xl font-bold text-gray-800">Teko Innovation</span>
          </Link>
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              className="border-none"
              items={menuItems.map(item => ({
                key: item.key,
                label: <Link to={item.key}>{item.label}</Link>,
                icon: item.icon,
              }))}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <Button 
              type="text" 
              icon={<MenuIcon />} 
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
          <Dropdown overlay={userMenu} trigger={['click']} arrow>
            <div className="flex items-center cursor-pointer">
              <Avatar 
                size="default" 
                className="bg-primary-500"
                icon={<User size={18} />}
              />
              <span className="ml-2 hidden md:inline">{user?.full_name}</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Mobile Menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            label: <Link to={item.key} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>,
            icon: item.icon,
          }))}
        />
      </Drawer>

      {/* Main Content */}
      <Content className="p-6 md:p-8">
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer className="text-center text-gray-500">
        Teko Innovation ©{new Date().getFullYear()} - Empowering Innovation
      </Footer>
    </Layout>
  );
};

export default MainLayout;