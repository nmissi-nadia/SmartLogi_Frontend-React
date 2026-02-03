import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../DashboardService';

interface TrendChartProps {
    stats: DashboardStats;
}

export const DeliveryTrendChart = ({ stats }: TrendChartProps) => {
    // Mock data for trend - in production, this would come from an API endpoint
    const generateTrendData = () => {
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const baseValue = Math.floor(stats.totalColis / 7);

        return days.map((day) => ({
            name: day,
            livraisons: Math.floor(baseValue + Math.random() * baseValue * 0.5),
            enCours: Math.floor(baseValue * 0.3 + Math.random() * baseValue * 0.2)
        }));
    };

    const data = generateTrendData();

    return (
        <div className="glass-card p-6 h-80">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tendance des Livraisons (7 derniers jours)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorLivraisons" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorEnCours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
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
                    <Area
                        type="monotone"
                        dataKey="livraisons"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorLivraisons)"
                        name="Livrés"
                    />
                    <Area
                        type="monotone"
                        dataKey="enCours"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorEnCours)"
                        name="En Cours"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
