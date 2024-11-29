// DashboardPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = ({ token }) => {
  const [openCases, setOpenCases] = useState(0);
  const [closedCases, setClosedCases] = useState(0);
  const [topComplaints, setTopComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Token ${token}` };

        const openResponse = await axios.get('http://localhost:8000/api/complaints/openCases/', { headers });
        setOpenCases(openResponse.data.length);

        const closedResponse = await axios.get('http://localhost:8000/api/complaints/closedCases/', { headers });
        setClosedCases(closedResponse.data.length);

        const topResponse = await axios.get('http://localhost:8000/api/complaints/topComplaints/', { headers });
        setTopComplaints(topResponse.data);

        const allResponse = await axios.get('http://localhost:8000/api/complaints/allComplaints/', { headers });
        setComplaints(allResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const fetchComplaintsByConstituents = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Token ${token}` };

      const response = await axios.get('http://localhost:8000/api/complaints/constituentsComplaints/', { headers });
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints by constituents');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>DASHBOARD</h2>

      <h3>Case Counts</h3>
      <p>Open Cases: {openCases}</p>
      <p>Closed Cases: {closedCases}</p>

      <hr />

      <h3>Top Complaints</h3>
      <ul>
        {topComplaints.map((complaint, index) => (
          <li key={index}>{complaint.complaint_type} - {complaint.count} complaints</li>
        ))}
      </ul>

      <hr />

      <h3>All Complaints 
        <button 
            style={{marginLeft: "20px"}}
            onClick={fetchComplaintsByConstituents} 
            disabled={loading}
          >
            Complaints by My Constituents
        </button>
      </h3>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th align="left">No.</th>
            <th align="left">Complaint Type</th>
            <th align="left">Descriptor</th>
            <th align="left">Open Date</th>
            <th align="left">Close Date</th>
          </tr>
        </thead>
        <tbody>
          {
            complaints && complaints.length > 0 ?
              complaints.map((complaint, index) => (
                <tr key={complaint.unique_key}>
                  <td align="left">{index + 1}</td>
                  <td align="left">{complaint.complaint_type}</td>
                  <td align="left">{complaint.descriptor}</td>
                  <td align="left">{complaint.opendate}</td>
                  <td align="left">{complaint.closedate}</td>
                </tr>
              )) : 
              <tr><td>No complaints</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
