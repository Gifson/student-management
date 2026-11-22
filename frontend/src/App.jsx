import { useEffect, useState } from "react";

const API = "/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    course: "MERN Stack",
    status: "Active"
  });

  const [editId, setEditId] = useState(null);

  // GET STUDENTS
  const fetchStudents = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // INSERT AND UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age)
      })
    });

    setForm({
      name: "",
      age: "",
      course: "MERN Stack",
      status: "Active"
    });

    setEditId(null);
    fetchStudents();
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      course: student.course,
      status: student.status
    });

    setEditId(student._id);
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    fetchStudents();
  };

  // SEARCH
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-slate-800">
          Student Management System
        </h1>

        <p className="mt-2 text-slate-500">
          Manage students using MongoDB CRUD operations
        </p>

        {/* STATISTICS */}
        <div className="my-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-slate-500">Total Students</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {students.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-slate-500">Active Students</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {students.filter(s => s.status === "Active").length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-slate-500">Completed</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {students.filter(s => s.status === "Completed").length}
            </h2>
          </div>

        </div>

        {/* ADD STUDENT FORM */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold">
            {editId ? "Update Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <input
              className="rounded-lg border p-3"
              placeholder="Student Name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />

            <input
              className="rounded-lg border p-3"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={e => setForm({...form, age: e.target.value})}
              required
            />

            <select
              className="rounded-lg border p-3"
              value={form.course}
              onChange={e => setForm({...form, course: e.target.value})}
            >
              <option>MERN Stack</option>
              <option>Java</option>
              <option>Python</option>
              <option>Frontend Development</option>
            </select>

            <select
              className="rounded-lg border p-3"
              value={form.status}
              onChange={e => setForm({...form, status: e.target.value})}
            >
              <option>Active</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>

            <button className="rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 md:col-span-4">
              {editId ? "Update Student" : "Add Student"}
            </button>

          </form>
        </div>

        {/* SEARCH AND TABLE */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row">

            <h2 className="text-xl font-bold">
              Student List
            </h2>

            <input
              className="rounded-lg border p-3"
              placeholder="Search student or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map(student => (

                  <tr key={student._id} className="border-b">

                    <td className="p-4 font-medium">
                      {student.name}
                    </td>

                    <td className="p-4">{student.age}</td>

                    <td className="p-4">{student.course}</td>

                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {student.status}
                      </span>
                    </td>

                    <td className="space-x-3 p-4">

                      <button
                        onClick={() => handleEdit(student)}
                        className="font-semibold text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(student._id)}
                        className="font-semibold text-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">
                      No students found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
