import DashboardHeader from '../dashboard/DashboardHeader.jsx';
import Footer from '../common/Footer.jsx';
import AIHelper from '../common/AIHelper.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-secondary text-white">
      <DashboardHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <Footer />
      <AIHelper />
    </div>
  );
};

export default Layout;
