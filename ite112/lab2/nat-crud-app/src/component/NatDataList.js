import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import Plot from 'react-plotly.js';
import "./NatDataList.css";

const NatDataList = () => {
  const [natData, setNatData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    respondent: "",
    age: "",
    sex: "",
    ethnic: "",
    academic_performance: "",
    academic_descrption: "",
    iq: "",
    type_school: "",
    socio_economic_status: "",
    study_habit: "",
    nat_result: "",
  });

  const [filterText, setFilterText] = useState("");
  const [filterEthnic, setFilterEthnic] = useState("");
  const [filterHabit, setFilterHabit] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterIq, setFilterIq] = useState("");
  const [filterEconomic, setFilterEconomic] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      const natDataCollection = collection(db, "natData");
      const natSnapshot = await getDocs(natDataCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNatData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const natDocRef = doc(db, "natData", id);
    try {
      await deleteDoc(natDocRef);
      setNatData(natData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      respondent: data.respondent,
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academic_performance: data.academic_performance,
      academic_descrption: data.academic_descrption,
      iq: data.iq,
      type_school: data.type_school,
      socio_economic_status: data.socio_economic_status,
      study_habit: data.study_habit,
      nat_result: data.nat_result,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const natDocRef = doc(db, "natData", editingId);
    try {
      await updateDoc(natDocRef, {
        respondent: editForm.respondent,
        age: Number(editForm.age),
        sex: editForm.sex,
        ethnic: editForm.ethnic,
        academic_performance: Number(editForm.academic_performance),
        academic_descrption: editForm.academic_descrption,
        iq: Number(editForm.iq),
        type_school: editForm.type_school,
        socio_economic_status: editForm.socio_economic_status,
        study_habit: editForm.study_habit,
        nat_result: Number(editForm.nat_result),
      });
      setNatData(
        natData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const filteredData = natData.filter((data) => {
    const filterTextLower = filterText.toLowerCase();
    const matchesText =
      data.respondent?.toLowerCase().includes(filterTextLower) ||
      data.age?.toString().includes(filterText) ||
      data.sex?.toLowerCase().includes(filterTextLower) ||
      data.ethnic?.toLowerCase().includes(filterTextLower) ||
      data.academic_performance?.toString().includes(filterText) ||
      data.academic_descrption?.toLowerCase().includes(filterTextLower) ||
      data.iq?.toString().includes(filterText) ||
      data.type_school?.toLowerCase().includes(filterTextLower) ||
      data.socio_economic_status?.toLowerCase().includes(filterTextLower) ||
      data.study_habit?.toLowerCase().includes(filterTextLower) ||
      data.nat_result?.toString().includes(filterText);
    const matchesEthnic = filterEthnic === "" || data.ethnic === filterEthnic;
    const matchesSex = filterSex === "" || data.sex === filterSex;
    const matchesIq = filterIq === "" || data.iq === filterIq;
    const matchesEconomic = filterEconomic === "" || data.socio_economic_status === filterEconomic;
    const matchesHabit = filterHabit === "" || data.study_habit === filterHabit;
    return matchesText && matchesEthnic && matchesSex && matchesIq && matchesEconomic && matchesHabit;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const processTreemapData = () => {
    const schoolTypes = [...new Set(natData.map((data) => data.type_school))];
    const allGenders = ["Male", "Female"];
    const allSocioStatuses = [
      ...new Set(natData.map((data) => data.socio_economic_status)),
    ];
  
    let labels = [];
    let parents = [];
    let values = [];
  
    // Root nodes: School types
    schoolTypes.forEach((school) => {
      labels.push(school);
      parents.push(""); // Root nodes have no parents
      values.push(0); // Set initial value (not used for intermediate nodes)
  
      // Intermediate nodes: Genders
      allGenders.forEach((sex) => {
        labels.push(`${school} - ${sex}`); // Make labels unique
        parents.push(school);
        values.push(0); // No values for intermediate nodes
  
        // Leaf nodes: Socio-economic status
        const filteredBySex = natData.filter(
          (data) => data.type_school === school && data.sex === sex
        );
  
        allSocioStatuses.forEach((status) => {
          labels.push(`${school} - ${sex} - ${status}`); // Unique leaf labels
          parents.push(`${school} - ${sex}`);
  
          const count = filteredBySex.filter(
            (data) => data.socio_economic_status === status
          ).length;
  
          values.push(count); // Value for leaf node
        });
      });
    });
  
    console.log("Treemap Data:", { labels, parents, values });
    return { labels, parents, values };
  };

  const treemapData = processTreemapData();
    console.log("Labels Length:", treemapData.labels.length);
    console.log("Parents Length:", treemapData.parents.length);
    console.log("Values Length:", treemapData.values.length);

    const processMarimekkoData = () => {
        const schoolTypes = [...new Set(natData.map((data) => data.type_school))];
        const genders = ["Male", "Female"];
        const socioeconomicStatuses = [
          ...new Set(natData.map((data) => data.socio_economic_status)),
        ];
      
        // Data containers
        let x = []; // Categories (school types)
        let y = []; // Heights (proportions)
        let widths = []; // Bar widths (proportions)
        let colors = []; // Colors for statuses
        let hoverTexts = [];
      
        // Calculate proportions
        schoolTypes.forEach((school) => {
          const schoolData = natData.filter((data) => data.type_school === school);
          const totalStudentsInSchool = schoolData.length;
      
          genders.forEach((gender) => {
            const genderData = schoolData.filter((data) => data.sex === gender);
            const totalStudentsByGender = genderData.length;
      
            socioeconomicStatuses.forEach((status, index) => {
              const count = genderData.filter(
                (data) => data.socio_economic_status === status
              ).length;
      
              // Calculate proportions for height and width
              const height = count / totalStudentsByGender;
              const width = totalStudentsByGender / totalStudentsInSchool;
      
              // Store data
              x.push(`${school} - ${gender}`); // X-axis category
              y.push(height); // Y-axis height (proportion)
              widths.push(width); // Width for each segment
              colors.push(index); // Assign color by status index
      
              // Hover text with detailed info
              hoverTexts.push(
                `${school}<br>${gender}<br>${status}: ${count} students`
              );
            });
          });
        });
      
        return { x, y, widths, colors, hoverTexts };
      };
      
      const marimekkoData = processMarimekkoData();

      const [pieChartVariable, setPieChartVariable] = useState("age"); // Default variable for pie chart

      const getPieChartData = () => {
        const counts = natData.reduce((acc, curr) => {
          const key = curr[pieChartVariable] || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
      
        return {
          labels: Object.keys(counts),
          values: Object.values(counts),
        };
      };

      const [boxPlotGroupBy, setBoxPlotGroupBy] = useState("sex"); // Default: Group by 'sex'

      const getBoxPlotData = () => {
        const groups = natData.reduce((acc, curr) => {
          const key = curr[boxPlotGroupBy] || "Unknown";
          if (!acc[key]) acc[key] = [];
          acc[key].push(curr.nat_result); // Assuming 'nat_result' is the field for NAT scores
          return acc;
        }, {});
      
        return Object.entries(groups).map(([key, values]) => ({
          y: values,
          type: "box",
          name: key,
          boxpoints: "all", // Show individual points
          jitter: 0.5,
          marker: { color: "rgba(93, 164, 214, 0.5)" },
        }));
      };
      
      const processGroupedBarData = () => {
        const schoolTypes = [...new Set(natData.map((data) => data.type_school))];
      
        let groupedData = {};
      
        // Initialize the data structure for the averages
        schoolTypes.forEach((school) => {
          groupedData[school] = {
            Male: [],
            Female: [],
          };
        });
      
        // Populate the grouped data with NAT results
        natData.forEach((data) => {
          if (groupedData[data.type_school]) {
            groupedData[data.type_school][data.sex].push(data.nat_result);
          }
        });
      
        // Calculate average NAT result for each gender and school type
        const averages = schoolTypes.map((school) => {
          return {
            school: school,
            maleAvg:
              groupedData[school].Male.reduce((a, b) => a + b, 0) /
              (groupedData[school].Male.length || 1),
            femaleAvg:
              groupedData[school].Female.reduce((a, b) => a + b, 0) /
              (groupedData[school].Female.length || 1),
          };
        });
      
        // Extract the data needed for the chart
        const schoolLabels = averages.map((item) => item.school);
        const maleAverages = averages.map((item) => item.maleAvg);
        const femaleAverages = averages.map((item) => item.femaleAvg);
      
        return { schoolLabels, maleAverages, femaleAverages };
      };

      const groupedBarData = processGroupedBarData();

      const getScatterPlotData = () => {
        const academicPerformance = natData.map((data) => data.academic_performance);
        const natResults = natData.map((data) => data.nat_result);
    
        return { academicPerformance, natResults };
      };
    
      const scatterPlotData = getScatterPlotData();

  return (
    <div className="nat-data-list">

      {/* Filter inputs */}
      <div className="filter-section">
        <input
            className="filter-input"
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

    <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)} className="filter-dropdown">
          <option value="">All Sex</option>
          {[...new Set(natData.map((data) => data.sex))].map((sex) => (
            <option key={sex} value={sex}>
              {sex}
            </option>
          ))}
        </select>
        <select value={filterEthnic} onChange={(e) => setFilterEthnic(e.target.value)} className="filter-dropdown"> 
          <option value="">All Ethnicities</option>
          {[...new Set(natData.map((data) => data.ethnic))].map((ethnic) => (
            <option key={ethnic} value={ethnic}>
              {ethnic}
            </option>
          ))}
        </select>
        <select value={filterIq} onChange={(e) => setFilterIq(e.target.value)} className="filter-dropdown">
          <option value="">All IQ</option>
          {[...new Set(natData.map((data) => data.iq))].map((iq) => (
            <option key={iq} value={iq}>
              {iq}
            </option>
          ))}
        </select>
        <select value={filterEconomic} onChange={(e) => setFilterEconomic(e.target.value)} className="filter-dropdown">
          <option value="">All Socio-Economic Status</option>
          {[...new Set(natData.map((data) => data.socio_economic_status))].map((socio_economic_status) => (
            <option key={socio_economic_status} value={socio_economic_status}>
              {socio_economic_status}
            </option>
          ))}
        </select>
        <select value={filterHabit} onChange={(e) => setFilterHabit(e.target.value)} className="filter-dropdown">
          <option value="">All Study Habit</option>
          {[...new Set(natData.map((data) => data.study_habit))].map((study_habit) => (
            <option key={study_habit} value={study_habit}>
              {study_habit}
            </option>
          ))}
        </select>
      </div>

      {editingId ? (
        /* Edit form section */
        <div className="modal">
          <form className="edit-form" onSubmit={handleUpdate}>
            <h3>Edit Data</h3>
            <label>
            Respondent:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.respondent}
                onChange={(e) =>
                    setEditForm({ ...editForm, respondent: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Age:
            <div className="input-container">
                <input
                className="inputs"
                type="number"
                value={editForm.age}
                onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Sex:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.sex}
                onChange={(e) =>
                    setEditForm({ ...editForm, sex: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Ethnic:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.ethnic}
                onChange={(e) =>
                    setEditForm({ ...editForm, ethnic: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Academic Performance:
            <div className="input-container">
                <input
                className="inputs"
                type="number"
                value={editForm.academic_performance}
                onChange={(e) =>
                    setEditForm({ ...editForm, academic_performance: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Academic Description:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.academic_descrption}
                onChange={(e) =>
                    setEditForm({ ...editForm, academic_descrption: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            IQ:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.iq}
                onChange={(e) =>
                    setEditForm({ ...editForm, iq: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Type of School:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.type_school}
                onChange={(e) =>
                    setEditForm({ ...editForm, type_school: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Socio-Economic Status:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.socio_economic_status}
                onChange={(e) =>
                    setEditForm({ ...editForm, socio_economic_status: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            Study Habit:
            <div className="input-container">
                <input
                className="inputs"
                type="text"
                value={editForm.study_habit}
                onChange={(e) =>
                    setEditForm({ ...editForm, study_habit: e.target.value })
                }
                required
                />
            </div>
            </label>

            <label>
            NAT Result:
            <div className="input-container">
                <input
                className="inputs"
                type="number"
                value={editForm.nat_result}
                onChange={(e) =>
                    setEditForm({ ...editForm, nat_result: e.target.value })
                }
                required
                />
            </div>
            </label>


            <div className="button-group rar">
              <button type="submit" className="rawr">
                Update Data
              </button>
              <button
                type="button"
                className="nooo"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Respondent</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Ethnic</th>
                <th>Academic Performance</th>
                <th>Academic Description</th>
                <th>IQ</th>
                <th>Type of School</th>
                <th>Socio-Economic Status</th>
                <th>Study Habit</th>
                <th>NAT Results</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((data) => (
                <tr key={data.id}>
                  <td>{data.respondent}</td>
                  <td>{data.age}</td>
                  <td>{data.sex}</td>
                  <td>{data.ethnic}</td>
                  <td>{data.academic_performance}</td>
                  <td>{data.academic_descrption}</td>
                  <td>{data.iq}</td>
                  <td>{data.type_school}</td>
                  <td>{data.socio_economic_status}</td>
                  <td>{data.study_habit}</td>
                  <td>{data.nat_result}</td>
                  <td className="action-buttons extr">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(data)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(data.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="btn"
                    >
                    Previous
                    </button>
                    <span>
                    Page {currentPage} of {totalPages}
                    </span>
                    <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="btn"
                    >
                    Next
                </button>
            </div>
            
<div className="chart-container">
    <div className="chart-item-tree">
    <Plot
        data={[
            {
            type: "treemap",
            labels: treemapData.labels,
            parents: treemapData.parents,
            values: treemapData.values,
            textinfo: "label+value",
            hoverinfo: "label+value+percent parent",
            },
        ]}
        layout={{
            title: {
            text: "Treemap of Students",
            x: 0.5, // Center the title horizontally
            y: 0.95, // Push the title closer to the top
            xanchor: "center",
            yanchor: "top",
            },
            width: 650,
            height: 900,
            autosize: false, // Allow fine control over size
            margin: {
            l: 0, // Left margin
            r: 50, // Right margin
            t: 50, // Top margin (space for the title)
            b: 50, // Bottom margin
            },
            xaxis: {
            fixedrange: true, // Prevent zooming horizontally
            },
            yaxis: {
            fixedrange: true, // Prevent zooming vertically
            },
        }}
        config={{ displayModeBar: false }} // Hide Plotly's toolbar if not needed
        style={{ margin: "20px auto", display: "block" }} // Center the plot horizontally
        />
    </div>
    <div className="chart-item-neko">
    <Plot
        data={[
            {
            type: "bar",
            x: marimekkoData.x, // Category labels (school-gender combinations)
            y: marimekkoData.y, // Heights (proportions per segment)
            width: marimekkoData.widths, // Widths for each bar
            marker: {
                color: marimekkoData.colors, // Use index-based color mapping
                colorscale: "Viridis", // Choose a color scale
            },
            text: marimekkoData.hoverTexts, // Hover text with detailed info
            hoverinfo: "text",
            orientation: "v", // Vertical bars
            },
        ]}
        layout={{
            title: "Marinekko Chart of Students by Gender and Type of School",
            font: {
                size: 10, // Adjust the font size here
              },
            barmode: "stack", // Stacked bar mode
            width: 450,
            height: 400,
            xaxis: {
            title: "School Type - Gender",
            tickangle: -45, // Rotate labels for readability
            automargin: true, // Adjust margins for long labels
            },
            yaxis: {
            title: "Proportion",
            tickformat: ".0%", // Display percentages
            },
        }}
        />
    </div>


    <div className="pie-chart-filter">
        <label>Select Variable: </label>
        <select value={pieChartVariable} onChange={(e) => setPieChartVariable(e.target.value)} className="filter-dropdown">
            <option value="age">Age</option>
            <option value="sex">Sex</option>
            <option value="ethnic">Ethnicity</option>
            <option value="academic_performance">Academic Performance</option>
            <option value="academic_descrption">Academic Description</option>
            <option value="iq">IQ</option>
            <option value="type_school">Type of School</option>
            <option value="socio_economic_status">Socio-Economic Status</option>
            <option value="study_habit">Study Habit</option>
        </select>
        </div>

        <div className="pie-chart-section">
  <Plot
    data={[
      {
        type: "pie",
        labels: getPieChartData().labels,
        values: getPieChartData().values,
        textinfo: "label+percent",
        hoverinfo: "label+percent+value",
      },
    ]}
    layout={{
      title: `Distribution by ${pieChartVariable.replace("_", " ")}`,
      width: 400,
      height: 400,
    }}
  />
</div>
</div>
<div className="chart-container"> 
<div className="groupedbar">
<Plot
  data={[
    {
      x: groupedBarData.schoolLabels, // School types as x-axis labels
      y: groupedBarData.maleAverages, // Male averages for y-axis
      name: "Male",
      type: "bar",
      marker: { color: "blue" },
    },
    {
      x: groupedBarData.schoolLabels, // Same x-axis labels for female data
      y: groupedBarData.femaleAverages, // Female averages for y-axis
      name: "Female",
      type: "bar",
      marker: { color: "pink" },
    },
  ]}
  layout={{
    title: "Average NAT Results by Gender and School Type",
    font: {
        size: 10, // Adjust the font size here
      },
    barmode: "group", // Group the bars together
    xaxis: {
      title: "School Type",
    },
    yaxis: {
      title: "Average NAT Score",
    },
    width: 420,
    height: 370,
  }}
/>
</div>
<div className="scatter-plot-section">
          <Plot
            data={[
              {
                x: scatterPlotData.academicPerformance, // X-axis: Academic Performance
                y: scatterPlotData.natResults, // Y-axis: NAT Results
                mode: "markers", // Scatter plot mode
                type: "scatter",
                marker: { color: "rgba(93, 164, 214, 0.8)" },
                text: natData.map((data) => `Respondent: ${data.respondent}`), // Optional hover info
              },
            ]}
            layout={{
              title: "Correlation between Academic Performance and NAT Results",
              font: {
                size: 9, // Adjust the font size here
              },
              xaxis: { title: "Academic Performance" },
              yaxis: { title: "NAT Results" },
              width: 420,
              height: 370,
            }}
          />
        </div>
<div className="box-plot-filter">
  <label>Group by: </label>
  <select value={boxPlotGroupBy} onChange={(e) => setBoxPlotGroupBy(e.target.value)} className="filter-dropdown">
    <option value="sex">Sex</option>
    <option value="type_school">School Type</option>
  </select>
</div>
<div className="box-plot-section">
  <Plot
    data={getBoxPlotData()}
    layout={{
      title: `NAT Results by ${boxPlotGroupBy.replace("_", " ")}`,
      yaxis: { title: "NAT Score" },
      width: 620,
      height: 600,
    }}
  />
</div>

</div>
        </div>
      )}
    </div>
  );
};

export default NatDataList;
