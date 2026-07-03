import React, { useEffect, useState, useRef } from "react";
import { ref, onChildAdded } from "firebase/database";
import { db } from "../firebase";

interface FirebaseReading {
  muscle: string;
  pointPressureThreshold: number;
  pointPressureTolerance: number;
}

interface Props {
  rows: FirebaseReading[]
  // onRowsChange: (rows: FirebaseReading[]) => void;
  onRowsChange: React.Dispatch<React.SetStateAction<FirebaseReading[]>>;
  sessionActive: boolean;
}

function ReadingTable({
  rows, 
  onRowsChange,
  sessionActive
} : Props) {

  // const [rows, setRows] = useState<FirebaseReading[]>(initialRows || []);

  // useEffect(() => {
  //   setRows(initialRows || []);
  // }, [initialRows]);

  // send rows to parent AFTER state updates
  // useEffect(() => {
  //   onRowsChange(rows);
  // }, [rows])

  // Track processed Firebase keys
  const seenKeys = useRef<Set<string>>(new Set())

  useEffect(() => {

    if (!sessionActive) {
      return;
    }

    const readingsRef = ref(db, "AlgometerReadings/Demo_Algometer_001/Readings");

    const listener = onChildAdded(readingsRef, (snapshot) => {

      const key = snapshot.key;

      if(!key || seenKeys.current.has(key)) return;

      seenKeys.current.add(key);

      const newReading = snapshot.val() as FirebaseReading;

      onRowsChange(prev => [...prev, newReading]);

    });

    return () => {
      listener();
    }
  }, [sessionActive, onRowsChange]);

  // To clear seen keys
  useEffect(() => {
    
    if(!sessionActive) {
      seenKeys.current.clear();
    }

  }, [sessionActive]);


  if (rows.length === 0) {
    return (
      <div className="border-2 border-gray-300 w-full text-center py-10 text-gray-500 rounded-lg
                      shadow-sm bg-gray-50">
        <p className="text-center text-lg">Waiting for data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
      <table className="w-full text-center ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-center text-base font-semibold border">Muscle (Type)</th>
            <th className="px-5 py-3 text-center text-base font-semibold border">Point Pressure Threshold</th>
            <th className="px-5 py-3 text-center text-base font-semibold border">Point Pressure Tolerance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {rows.map((r, index) => (
            <tr key={r.muscle + index}>
              <td className="border py-1.5 ">{r.muscle}</td>
              <td className="border py-1.5 ">{r.pointPressureThreshold} kPa</td>
              <td className="border py-1.5 ">{r.pointPressureTolerance} kPa</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadingTable;