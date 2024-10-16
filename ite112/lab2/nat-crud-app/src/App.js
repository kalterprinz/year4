import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import AddNatData from "./component/AddNatData";
import NatDataList from "./component/NatDataList";
import CsvUploader from "./component/CsvUploader";
import "./App.css"; 

function App() {
  return (
    <div className="app-container">
      <header>
      <img src="/phflag.png" alt="Philippine Flag" className="app-icon" />
        <h1>National Achievement Test Data</h1>
      </header>
      <Router>
      <div className="app"> 
      <Sidebar />
      <div className="content">
      <Routes>
            <Route path="/data" element={<NatDataList />} />
            <Route path="/input" element={
                <div>
                  <section className="add-data-section">
                    <AddNatData />
                  </section>
                  
                  <section className="csv-upload-section">
                    <CsvUploader />
                  </section>
                </div>
              } /> 
        </Routes>
        </div>
        </div>
        </Router>
    </div>
  );
}

export default App;
