import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FraudTrendChart from '@/components/dashboard/FraudTrendChart';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fraud Detection Dashboard</h1>
      
      {/* Stats row with proper gap */}
      <div className="mb-6">
        <DashboardStats />
      </div>
      
      {/* Chart and transactions with fixed heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[500px] flex flex-col">
          <FraudTrendChart />
        </div>
        <div className="h-[500px] flex flex-col">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}