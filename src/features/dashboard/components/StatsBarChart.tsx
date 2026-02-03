import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { DashboardStats } from '../DashboardService';

interface StatsBarChartProps {
    stats: DashboardStats;
}

export const StatsBarChart = ({ stats }: StatsBarChartProps) => {
    const data = [
        {
            name: 'Total',
            Colis: stats.totalColis,
            fill: '#6366f1'
        },
        {
            name: 'Livrés',
            Colis: stats.colisLivres,
            fill: '#10b981'
        },
        {
            name: 'En Cours',
            Colis: stats.colisEnCours,
            fill: '#f59e0b'
        },
        {
            name: 'Retournés',
            Colis: stats.colisRetournes,
            fill: '#ef4444'
        }
    ];

    return (
        <div className="glass-card p-6 h-80">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Vue d'ensemble des Colis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="Colis" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
