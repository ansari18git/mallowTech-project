import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function UserListPage() {
  const users = useSelector(state => state.users);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: ""
  });

  // Fetch users from API via saga on mount
  useEffect(() => {
    setLoading(true);
    dispatch({ type: "users/FETCH_USERS" });
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Filtered users for search
  const filteredUsers = users.filter(
    user =>
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Open modal for create
  const openCreateModal = () => {
    setModalMode("create");
    setForm({ first_name: "", last_name: "", email: "", avatar: "" });
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (user) => {
    setModalMode("edit");
    setEditingUser(user);
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar
    });
    setShowModal(true);
  };

  // Handle form input
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit create or edit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.avatar) return;

    if (modalMode === "create") {
      dispatch({ type: "users/ADD_USER_SAGA", payload: { ...form } });
    } else if (modalMode === "edit" && editingUser) {
      dispatch({ type: "users/UPDATE_USER_SAGA", payload: { ...editingUser, ...form } });
    }
    setShowModal(false);
    setEditingUser(null);
    setForm({ first_name: "", last_name: "", email: "", avatar: "" });
  };

  // Delete user
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch({ type: "users/DELETE_USER_SAGA", payload: id });
    }
  };

  if (loading) {
    return (
      <div className="userlist-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="loader"></div>
          <div style={{ marginTop: 16, color: "#1976d2", fontWeight: 500 }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="userlist-bg">
      <div className="userlist-header">
        <div className="userlist-header-left">
          <h2>Users</h2>
          <div className="view-toggle">
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              <span role="img" aria-label="table">📋</span> Table
            </button>
            <button
              className={view === "card" ? "active" : ""}
              onClick={() => setView("card")}
            >
              <span role="img" aria-label="card">📇</span> Card
            </button>
          </div>
        </div>
        <div className="userlist-header-right">
          <input
            className="userlist-search"
            type="text"
            placeholder="input search text"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="create-user-btn" onClick={openCreateModal}>
            Create User
          </button>
        </div>
      </div>

      {/* Modal for Create/Edit User */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{marginBottom: 24}}>
              {modalMode === "create" ? "Create New User" : "Edit User"}
            </h3>
            <form onSubmit={handleFormSubmit}>
              <label>
                <span style={{ color: "#f44336" }}>*</span> First Name
                <input
                  name="first_name"
                  type="text"
                  placeholder="Please enter first name"
                  value={form.first_name}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span style={{ color: "#f44336" }}>*</span> Last Name
                <input
                  name="last_name"
                  type="text"
                  placeholder="Please enter last name"
                  value={form.last_name}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span style={{ color: "#f44336" }}>*</span> Email
                <input
                  name="email"
                  type="email"
                  placeholder="Please enter email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span style={{ color: "#f44336" }}>*</span> Profile Image Link
                <input
                  name="avatar"
                  type="text"
                  placeholder="Please enter profile image link"
                  value={form.avatar}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setShowModal(false)}
                  style={{ minWidth: 90 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-user-btn"
                  style={{ minWidth: 90 }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === "table" ? (
        <div className="userlist-table-container">
          <table className="userlist-table">
            <thead>
              <tr>
                <th></th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <img src={user.avatar} alt={user.first_name} className="user-avatar" />
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`} className="user-email-link">{user.email}</a>
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-view-container">
          {filteredUsers.map(user => (
            <div className="user-card" key={user.id}>
              <img src={user.avatar} alt={user.first_name} className="user-avatar" />
              <div className="user-card-info">
                <div className="user-card-name">{user.first_name} {user.last_name}</div>
                <div className="user-card-email">{user.email}</div>
                <div style={{ marginTop: 12 }}>
                  <button className="edit-btn" onClick={() => openEditModal(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="pagination-btn">&lt;</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">&gt;</button>
      </div>
    </div>
  );
}

export default UserListPage;