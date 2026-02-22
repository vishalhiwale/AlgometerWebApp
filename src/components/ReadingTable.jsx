// import { useEffect, useState } from "react";
// import { ref, onValue, off, remove} from "firebase/database";
// import { db } from "../firebase";

// function ReadingTable() {
//   const [reading, setReading] = useState(null);
//     const[rows, setRows] = useState([]);

//   useEffect(() => {
//     const readingsRef = ref(db, "readings");

//     onValue(readingsRef, (snapshot) => {
//       if (!snapshot.exists()) {
//         console.warn("No data at /readings");
//         return;
//       }

      
//       const data = snapshot.val();

//        setRows((prevRows) => [...prevRows, data]);

//        remove(readingsRef);
       
//       console.log("DATA:", data);
//       setReading(data);
//     });

//     return () => off(readingsRef);
//   }, []);

//   if (!reading) return(
//     <div className="border-2 border-gray-400 w-full text-center py-10 text-gray-500 rounded-md">
//       <p className="text-center text-2xl">Waiting for data...</p>
//     </div>

//   )

//   return (
//     <table border="1">
//       <thead className="w-full py-1 text-center border-gray-300 rounded-md">
//         <tr>
//           <th>Muscle (Type)</th>
//           <th>Point Pressure Threshold</th>
//           <th>Point Pressure Tolerance</th>
//         </tr>
//       </thead>
//         <tbody>
//         {rows.map((r, index) => (
//             <tr key={index}>
//             <td>{r.muscle}</td>
//             <td>{r.pointPressureThreshold} kPa</td>
//             <td>{r.pointPressureTolerance} kPa</td>
//             </tr>
//         ))}
//         </tbody>
//     </table>
//   );
// }

// export default ReadingTable;


import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase";

function ReadingTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const readingsRef = ref(db, "readings");

    const unsubscribe = onValue(readingsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRows([]);
        return;
      }

      const data = snapshot.val();

      // Convert object → array
      const rowsArray = Object.values(data);

      setRows(rowsArray);
    });

    return () => off(readingsRef);
  }, []);

  if (rows.length === 0) {
    return (
      <div className="border-2 border-gray-400 w-full text-center py-10 text-gray-500 rounded-md">
        <p className="text-center text-2xl">Waiting for data...</p>
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
          <tr key={index}>
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
