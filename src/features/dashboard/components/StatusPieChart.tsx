import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DashboardStats } from '../DashboardService';

interface StatusChartProps {
    stats: DashboardStats;
}

export const StatusPieChart = ({ stats }: StatusChartProps) => {
    const data = [
        { name: 'Livrés', value: stats.colisLivres, color: '#10b981' },
        { name: 'En Cours', value: stats.colisEnCours, color: '#f59e0b' },
        { name: 'Retournés', value: stats.colisRetournes, color: '#ef4444' }
    ].filter(item => item.value > 0);

    const COLORS = data.map(d => d.color);

    return (
        <div className="glass-card p-6 h-80">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Répartition par Statut</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
