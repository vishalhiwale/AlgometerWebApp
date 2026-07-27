import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import api from "../services/api";

export function Dashboard() {

  const [patients, setPatients] = useState<any[]>([]);
  const [readings, setReadings] = useState<any[]>([]);
  const [pieChartType, setPieChartType] = useState("status");

  useEffect(() => {

    const fetchPatients = async () => {

      try {

        const response = await api.get("/patients");

        if(Array.isArray(response.data)){
          setPatients(response.data)
        }
        else{
          setPatients([]);
        }

      } catch (error) {
        
        console.error(error);
        setPatients([]);

      };

    }

    fetchPatients();
    
  }, []);

  useEffect(() => {

    const fetchReadings = async () => {

      try {

        const readings = await api.get("/readings/readings");

        if(Array.isArray(readings.data)){
          setReadings(readings.data);
        }
        else{
          setReadings([]);
        }
        // console.log("fetched readings:", readings.data);
      } catch (error) {
        
        console.error(error);
        setReadings([]);

      };

    }

    fetchReadings();
    
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

  const weeklyTrends = getWeeklyVisits();

  // Recent measurements
  const recentMeasurements = [
    { date: '2025-02-02', forehead: 28, cheek: 26, chin: 30, masseter: 24 },
    { date: '2025-02-01', forehead: 30, cheek: 28, chin: 32, masseter: 26 },
    { date: '2025-01-30', forehead: 27, cheek: 25, chin: 29, masseter: 23 },
    { date: '2025-01-29', forehead: 31, cheek: 29, chin: 33, masseter: 27 },
    { date: '2025-01-28', forehead: 29, cheek: 27, chin: 31, masseter: 25 },
  ];

  // Stats Cards
  type StatCard = {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  };

  const stats: StatCard[] = [
    {
      label: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "blue",
    },
    {
      label: "Today's Appointments",
      value: todayAppointments,
      icon: Calendar,
      color: "green",
    },
    {
      label: "Upcoming (7 days)",
      value: upcomingWeek,
      icon: TrendingUp,
      color: "orange",
    },
    {
      label: "Avg Pain Threshold",
      value: "28.5 N/cm²",
      icon: Activity,
      color: "purple",
    },
  ];
  
  type PieStat = {
    label: string;
    value: number;
    color: string;
  }

  // To get Stauts count (Saved readings, Committed readings)
  const getStatusStats = (): PieStat[] => {

    const statusCount: Record<string, number> = {};

    readings.forEach(reading => {

      const status = reading.status || "Unknown";

      statusCount[status] = (statusCount[status] || 0) + 1;

    });

    const colors = {
      saved: "#FFBF00",
      committed: "#10b981"
    }

    // console.log("status count:", statusCount);
    return Object.entries(statusCount).map(([label, value]) => ({
      label,
      value,
      color: colors[label as keyof typeof colors] || "#9ca3af",
    }));

  };

  // To get Gender count (Male, Female, Other, Unknown)
  const getGenderStats = (): PieStat[] => {

    const genderCount: Record<string, number> = {};

    patients.forEach(patient => {

      const gender = patient.gender || "Unknown";

      genderCount[gender] = (genderCount[gender] || 0) + 1;

    });

    const colors = {
      Male: "#3b82f6",
      Female: "#e375ac",
      Other: "#8b5cf6",
      Unknown: "#9ca3af"
    };

    // console.log("gender count", genderCount);

    return Object.entries(genderCount).map(([label, value]) => ({
      label,
      value,
      color: colors[label as keyof typeof colors] || "#9ca3af",
    }));

  };

  // To get Muscle Disctribution count (Forehead, Cheek, Chin, Masseter, Unknown)
  const getMuscleStats = (): PieStat[] => {

    const muscleCount: Record<string, number> = {};

    readings.forEach(reading => {

      reading.readings.forEach((muscle: any) => {
        muscleCount[muscle.muscleName] = (muscleCount[muscle.muscleName] || 0) + 1;
      });

    });

    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#9ca3af",
      "#8b5cf6",
      "#06b6d4",
      "#ec4899"
    ]

    // console.log("muscle count", muscleCount);

    return Object.entries(muscleCount).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length] || "#9ca3af",
    }));

  };


  const getSeverityStats = (): PieStat[] => {

    const severityCount: Record<string, number> = {};

    readings.forEach(reading => {

      reading.readings.forEach((muscle: any) => {
        if (muscle.threshold < 150)
          severityCount["Severe"] = (severityCount["Severe"] || 0) + 1;

        else if (muscle.threshold < 250)
          severityCount["Moderate"] = (severityCount["Moderate"] || 0) + 1;

        else if (muscle.threshold < 300)
          severityCount["Mild"] = (severityCount["Mild"] || 0) + 1;

        else
          severityCount["Normal"] = (severityCount["Normal"] || 0) + 1;
      });

    });

    const colors = {
      Severe: "#ef4444",
      Moderate: "#f59e0b",
      Mild: "#10b981",
      Normal: "#3b82f6"
    };

    return Object.entries(severityCount).map(([label, value]) => ({
      label,
      value,
      color: colors[label as keyof typeof colors] || "#9ca3af",
    }));

  };
    // const pieStats: PieStat[] = [
  //   { label: "Saved Readings", value: 3, color: '#FFBF00' },
  //   { label: "Committed Readings", value: 10, color: "#10b981" }
  //   // { label: "Saved Readings", value: savedReadings.length, color: '#FFBF00' },
  //   // { label: "Committed Readings", value: committedReadings.length, color: "#10b981" }
  // ];

  // const pieStats: PieStat[] = getStatusStats();
  const pieStats: PieStat[] = useMemo(() => {
    switch (pieChartType) {
      case "status":
        return getStatusStats();

      case "gender":
        return getGenderStats();

      case "severity":
        // Implement getSeverityStats() if needed
        return getSeverityStats();
      
      case "muscle":
        // Implement getMuscleStats() if needed
        return getMuscleStats();

      default:
        // default return getStatusStats();
        return getStatusStats();
    }
  }, [pieChartType, readings]);
  
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="space-y-6 ml-3">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Dashboard Overview</h2>
        {/* <p className="text-gray-600 mt-1">Real-time analytics and patient statistics</p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="px-2 py-2 rounded-lg text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-center text-sm font-medium">
                    {stat.value}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Patient Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Weekly Patient Visits</h3>
          {weeklyTrends.length === 0 ? (
            <div className='no-data-placeholder'>
              <p className='text-gray-500 text-center py-30'>No visit data available</p>
            </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={weeklyTrends}
                margin={{ top: 10, right: 0, left: -40, bottom: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                <XAxis
                  dataKey={"day"}
                  tick={false}
                  // tick={{ fontSize: 12 }}
                />
                <YAxis
                  // dataKey={"null"}
                  tick={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value} patients`, "Visits"]}
                  labelFormatter={(label) => `Day : ${label}`}
                  wrapperStyle={{ width: 140, height: 60 }} 
                  contentStyle={{ 
                    fontSize: '14px',
                    textAlign: 'left',
                    textSizeAdjust : '10px sans-serif',
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc',
                    fontFamily: 'sans-serif' 
                  }}
                  itemStyle={{ color: '#333', fontWeight: 'bold' }}
                />
                {/* <Legend
                    formatter={(value) => (
                      <span style={{ color: '#3b82f6' }}>{value}</span>
                    )}
                /> */}
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
          <div className='flex justify-between items-center mb-4'>
            <h3 className="text-gray-900 text-lg font-semibold">
              {pieChartType === "status" && "Reading Status Distribution"}
              {pieChartType === "gender" && "Gender Distribution"}
              {pieChartType === "severity" && "Pain Severity Distribution"}
              {pieChartType === "muscle" && "Muscle Distribution"}
            </h3>

            <select
              value={pieChartType}
              onChange={(e) => setPieChartType(e.target.value)}
              className="border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="status">Reading Status</option>
              <option value="gender">Gender</option>
              <option value="severity">Pain Severity</option>
              <option value="muscle">Muscle Distribution</option>
            </select>
          </div> 

          <ResponsiveContainer width="100%" height={300}>
            {pieStats.length === 0 ? (
              <div className='no-data-placeholder'>
                <p className='text-gray-500 text-center py-30'>No {pieChartType} data available</p>
              </div>
            ) : (
              <PieChart>
                <Tooltip 
                  formatter={(value: number) => [value, ""]} 
                  separator="" 
                  wrapperStyle={{ width: 50, height: 60 }}                  
                  contentStyle={{ 
                    // width: '50px',
                    fontSize: '14px',
                    textAlign: 'center',
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc',
                    fontFamily: 'sans-serif' 
                  }}
                  itemStyle={{ color: '#333', fontWeight: 'bold' }}
                />
                <Pie
                  data={pieStats.filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, value ,}) => `${label}`}
                  fontWeight={'500'}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="label"
                >
                  {pieStats.filter((item) => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Recent Measurements Trend */}
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Recent Algometer Measurements (N/cm²)</h3>
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
        </div> */}
      </div>
    </div>
  );
}