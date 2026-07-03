import { useEffect, useState, useRef } from "react";
import { ref, onChildAdded, off } from "firebase/database";
import { db } from "../firebase";

interface FirebaseReading {
  muscle: string;
  pointPressureThreshold: number;
  pointPressureTolerance: number;
}

interface Props {
  rows: FirebaseReading[]
  onRowsChange: (rows: FirebaseReading[]) => void;
}

function ReadingTable({rows: initialRows, onRowsChange} : Props) {

  const [rows, setRows] = useState<FirebaseReading[]>(initialRows || []);

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  // send rows to parent AFTER state updates
  useEffect(() => {
    onRowsChange(rows);
  }, [rows])

  // Track processed Firebase keys
  const seenKeys = useRef<Set<string>>(new Set())

  useEffect(() => {
    const readingsRef = ref(db, "liveReadings/algometer");

    const listener = onChildAdded(readingsRef, (snapshot) => {
      const key = snapshot.key;

      if(!key || seenKeys.current.has(key)) return;

      seenKeys.current.add(key);

      const newReading = snapshot.val() as FirebaseReading;

      setRows(prev => [...prev, newReading]);

    });

    return () => listener();
  }, []);

  if (rows.length === 0) {
    return (
      <div className="border-2 border-gray-300 w-full text-center py-10 text-gray-500 rounded-lg
                      shadow-sm bg-gray-50">
        <p className="text-center text-lg">Waiting for data...</p>
      </div>
    );
  }

  return (
    <table className="border border-gray-300 w-full border-collapse text-center">
      <thead>
        <tr>
          <th className="border">Muscle (Type)</th>
          <th className="border">Point Pressure Threshold</th>
          <th className="border">Point Pressure Tolerance</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, index) => (
          <tr key={r.muscle + index}>
            <td className="border">{r.muscle}</td>
            <td className="border">{r.pointPressureThreshold} kPa</td>
            <td className="border">{r.pointPressureTolerance} kPa</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReadingTable;