
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    department: "",
    email: "",
    cgpa: ""
  });

  const [editId, setEditId] = useState(null);
  const API = "http://localhost:5000/students";

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = {
        ...formData,
        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa)
      };

      if (editId) {
        await axios.put(`${API}/${editId}`, data);
        setEditId(null);
      } else {
        await axios.post(API, data);
      }

      setFormData({
        regNo: "",
        name: "",
        department: "",
        email: "",
        cgpa: ""
      });

      await fetchStudents();
      alert("Student saved successfully!");
    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.response?.data?.message || "Could not save student. Check the backend.");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      email: student.email || "",
      cgpa: student.cgpa ?? ""
    });

    setEditId(student._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      await fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Could not delete student. Check the backend.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      regNo: "",
      name: "",
      department: "",
      email: "",
      cgpa: ""
    });
  };

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="regNo"
          placeholder="Register Number"
          value={formData.regNo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="number"
          name="cgpa"
          placeholder="CGPA"
          min="0"
          max="10"
          step="0.01"
          value={formData.cgpa}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Student List</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Register No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.regNo}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.email}</td>
                <td>{student.cgpa}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="6">No students found. Add your first student.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
