import React, { useEffect, useState, useRef } from "react";
import { ref, onChildAdded } from "firebase/database";
import { db } from "../firebase";
import { Trash2Icon } from "lucide-react";

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

  // Function to delete Record from table
  const deleteRecord = (indexToDelete?:number) => {
    try{

      if(confirm("Are you sure you want to delete this record?")){
  
        onRowsChange((prevRows) => prevRows.filter((_, index) => index !== indexToDelete));
        alert("Record Deleted");

      }

    } catch (error){

      console.error(error);

    }
  };

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
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 text-center text-base font-semibold">Muscle (Type)</th>
            <th className="px-5 py-3 text-center text-base font-semibold">Point Pressure Threshold</th>
            <th className="px-5 py-3 text-center text-base font-semibold">Point Pressure Tolerance</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
          {rows.map((r, index) => (
            <tr key={r.muscle + index} className="">
              <td className=" py-1.5 ">{r.muscle}</td>
              <td className=" py-1.5 ">{r.pointPressureThreshold} kPa</td>
              <td className=" py-1.5 ">{r.pointPressureTolerance} kPa</td>
              <td className=" hover:bg-gray-200">
                <button 
                  className="flex ml-2 mr-1 items-center text-red-500"
                  onClick={ () => deleteRecord(index) }
                >
                  <Trash2Icon className="w-5 h-5"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadingTable;