import { Badge } from "@/components/ui/badge"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AchievementsProps {
  achievements: string[]
  level: string
}

export function Achievements({ achievements, level }: AchievementsProps) {
  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months as sample labels
    datasets: [
      {
        label: 'Learning Progress',
        data: [60, 65, 70, 80, 85, 90, 95], // Progress values, trending upward
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4, // Smooth the line curve
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set a max value for positive user experience
      },
    },
  };

  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Your Achievements</h3>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{level}</Badge>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {achievements.map((achievement, index) => (
          <Badge key={index} variant="outline">{achievement}</Badge>
        ))}
      </div>
      <div className="h-64"> {/* Chart container */}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}