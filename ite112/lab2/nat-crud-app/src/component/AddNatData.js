import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./AddNatData.css";

const AddNatData = () => {
    const [respondent, setRespondents] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [ethnic, setEthnic] = useState("");
    const [academic_performance, setAcademicPerformance] = useState("");
    const [academic_descrption, setAcademicDescription] = useState("");
    const [iq, setIq] = useState("");
    const [type_school, setTypeSchool] = useState("");
    const [socio_economic_status, setSocioEconomicStatus] = useState("");
    const [study_habit, setStudyHabit] = useState("");
    const [nat_result, setNatResults] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "natData"), {
                respondent,
                age: Number(age),
                sex,
                ethnic,
                academic_performance: Number(academic_performance),
                academic_descrption,
                iq,
                type_school,
                socio_economic_status,
                study_habit,
                nat_result: Number(nat_result),
            });
            setRespondents("");
            setAge("");
            setSex("");
            setEthnic("");
            setAcademicPerformance("");
            setAcademicDescription("");
            setIq("");
            setTypeSchool("");
            setSocioEconomicStatus("");
            setStudyHabit("");
            setNatResults("");
            window.location.reload();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <div className="add-nat-data">
            
            <form className="form" onSubmit={handleSubmit}>
            <h2 className="he">Add NAT Data</h2>
                <label>
                    Respondent:
                    <div className="input-container">
                        <input
                            className="inputs"
                            type="text"
                            value={respondent}
                            onChange={(e) => setRespondents(e.target.value)}
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
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
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
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
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
                            value={ethnic}
                            onChange={(e) => setEthnic(e.target.value)}
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
                            value={academic_performance}
                            onChange={(e) => setAcademicPerformance(e.target.value)}
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
                            value={academic_descrption}
                            onChange={(e) => setAcademicDescription(e.target.value)}
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
                            value={iq}
                            onChange={(e) => setIq(e.target.value)}
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
                            value={type_school}
                            onChange={(e) => setTypeSchool(e.target.value)}
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
                            value={socio_economic_status}
                            onChange={(e) => setSocioEconomicStatus(e.target.value)}
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
                            value={study_habit}
                            onChange={(e) => setStudyHabit(e.target.value)}
                            required
                        />
                    </div>
                </label>

                <label>
                    NAT Results:
                    <div className="input-container">
                        <input
                            className="inputs"
                            type="number"
                            value={nat_result}
                            onChange={(e) => setNatResults(e.target.value)}
                            required
                        />
                    </div>
                </label>

                <button type="submit" className="rawr">Add Data</button>
            </form>
        </div>
    );
};

export default AddNatData;
