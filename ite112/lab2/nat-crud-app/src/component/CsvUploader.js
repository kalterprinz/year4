import React, { useState } from 'react';
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import "./CsvUploader.css";

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 11 && index > 0) { // Skip header row
          data.push({
            respondent: columns[0].trim(),
            age: Number(columns[1].trim()),
            sex: columns[2].trim(),
            ethnic: columns[3].trim(),
            academic_performance: Number(columns[4].trim()),
            academic_descrption: columns[5].trim(),
            iq: columns[6].trim(),
            type_school: columns[7].trim(),
            socio_economic_status: columns[8].trim(),
            study_habit: columns[9].trim(),
            nat_result: Number(columns[10].trim()),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'natData'), item);
        });

        await Promise.all(batch);
        window.location.reload();
      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-uploader">
      <div className='form extender'>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className="rawr" onClick={handleFileUpload}>Upload CSV</button>
    </div>
    </div>
  );
}

export default CsvUploader;