import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import FraudTrendChart from '@/components/dashboard/FraudTrendChart'
export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fraud Detection Dashboard</h1>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FraudTrendChart />
        <RecentTransactions />
      </div>
    </div>
  )
}