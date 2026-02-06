import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';

interface StatsProps {
    isLoading?: boolean;
    stats: {
        totalColis?: number;
        enCours?: number;
        livres?: number;
        retournes?: number;
        // Backend returns a Map, keys might be "TOTAL", "LIVRE", "EN_COURS", etc. 
        // We will map them in the parent component or service.
        [key: string]: number | undefined;
    };
}

export const DashboardStatsGrid = ({ stats, isLoading }: StatsProps) => {
    const cards = [
        {
            label: 'Total Colis',
            value: stats['TOTAL'] || stats.totalColis || 0,
            icon: Package,
            color: 'bg-primary-500',
            gradient: 'from-primary-500/20 to-primary-500/5'
        },
        {
            label: 'En Cours',
            value: stats['EN_COURS'] || stats.colisEnCours || 0,
            icon: Truck,
            color: 'bg-blue-500',
            gradient: 'from-blue-500/20 to-blue-500/5'
        },
        {
            label: 'Livrés',
            value: stats['LIVRE'] || stats.colisLivres || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            gradient: 'from-green-500/20 to-green-500/5'
        },
        {
            label: 'Retournés',
            value: stats['RETOURNE'] || stats.colisRetournes || 0,
            icon: AlertCircle,
            color: 'bg-red-500',
            gradient: 'from-red-500/20 to-red-500/5'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className={`glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <card.icon size={64} />
                    </div>

                    <div className="relative z-10 flex flex-col">
                        <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 shadow-lg shadow-black/20 text-white`}>
                            <card.icon size={24} />
                        </div>
                        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{card.label}</span>
                        {isLoading ? (
                            <Skeleton className="h-9 w-16 mt-1" />
                        ) : (
                            <span className="text-3xl font-bold text-slate-900 mt-1">{card.value}</span>
                        )}

                        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl`} />
                    </div>
                </div>
            ))}
        </div>
    );
};
