import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Dashboard() {

  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then(res => res.json())
      .then(data => {
        setPatients(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Calculate statistics
  const totalPatients = patients.length;
  const todayAppointments = patients.filter(p => {
    const today = new Date();
    return p.nextCheckupDate && new Date(p.nextCheckupDate).toLocaleDateString("en-GB") === today.toLocaleDateString("en-GB");
  }).length;

  const upcomingWeek = patients.filter(p => {
    if (!p.nextCheckupDate) return false;
    const checkupDate = new Date(p.nextCheckupDate);
    const today = new Date();
    let remainDays = Math.abs(checkupDate.getTime() - today.getTime()) / (1000*60*60*24) ;
    // const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return checkupDate >= today && (remainDays < 7 && remainDays>0)   
  }).length;

  // getWeeklyPatients
  const getWeeklyVisits = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // initialize counts
    const counts = {
      Sun: 0, Mon: 0, Tue: 0, Wed: 0,
      Thu: 0, Fri: 0, Sat: 0
    };

    patients.forEach((p) => {
      if (!p.lastVisitDate) return;

      const date = new Date(p.lastVisitDate);
      const day = days[date.getDay()];

      counts[day]++;
    });

    return days.map(day => ({
      day,
      patients: counts[day]
    }));
  };

  // Pain threshold trends
  // const weeklyTrends = [
  //   { day: 'Mon', avgPain: 4.2, patients: 8 },
  //   { day: 'Tue', avgPain: 3.8, patients: 12 },
  //   { day: 'Wed', avgPain: 4.5, patients: 10 },
  //   { day: 'Thu', avgPain: 3.9, patients: 15 },
  //   { day: 'Fri', avgPain: 4.1, patients: 11 },
  //   { day: 'Sat', avgPain: 3.5, patients: 6 },
  //   { day: 'Sun', avgPain: 3.2, patients: 4 },
  // ];
  const weeklyTrends = getWeeklyVisits();

  // Patient distribution by pain level
  const painDistribution = [
    { name: 'Low (0-3)', value: 12, color: '#10b981' },
    { name: 'Moderate (3-6)', value: 25, color: '#f59e0b' },
    { name: 'High (6-10)', value: 8, color: '#ef4444' },
  ];

  // Recent measurements
  const recentMeasurements = [
    { date: '2025-02-02', forehead: 28, cheek: 26, chin: 30, masseter: 24 },
    { date: '2025-02-01', forehead: 30, cheek: 28, chin: 32, masseter: 26 },
    { date: '2025-01-30', forehead: 27, cheek: 25, chin: 29, masseter: 23 },
    { date: '2025-01-29', forehead: 31, cheek: 29, chin: 33, masseter: 27 },
    { date: '2025-01-28', forehead: 29, cheek: 27, chin: 31, masseter: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Dashboard Overview</h2>
        {/* <p className="text-gray-600 mt-1">Real-time analytics and patient statistics</p> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="px-2 py-2 rounded-lg text-sm font-medium">Total Patients</p>
              <p className="text-center text-sm font-medium">{totalPatients}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="px-2 py-2 rounded-lg text-sm font-medium">Today's Appointments</p>
              <p className="text-gray-900 mt-2">{todayAppointments}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="px-2 py-2 rounded-lg text-sm font-medium">Upcoming (7 days)</p>
              <p className="text-gray-900 mt-2">{upcomingWeek}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="px-2 py-2 rounded-lg text-sm font-medium">Avg Pain Threshold</p>
              <p className="text-gray-900 mt-2">28.5 N/cm²</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Patient Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 mb-4">Weekly Patient Visits</h3>
          {weeklyTrends.length === 0 ? (
            <p className='text-gray-500'>No visit data available</p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value} patients`, "Visits"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend
                    formatter={(value) => (
                      <span style={{ color: '#3b82f6' }}>{value}</span>
                    )}
                />
                <Bar dataKey="patients" name="Patients" animationDuration={800}>
                  {weeklyTrends.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.patients > 10 ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pain Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 mb-4">Pain Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={painDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {painDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Measurements Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-gray-900 mb-4">Recent Algometer Measurements (N/cm²)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentMeasurements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="forehead" stroke="#3b82f6" name="Forehead" />
              <Line type="monotone" dataKey="cheek" stroke="#10b981" name="Cheek" />
              <Line type="monotone" dataKey="chin" stroke="#f59e0b" name="Chin" />
              <Line type="monotone" dataKey="masseter" stroke="#ef4444" name="Masseter" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}