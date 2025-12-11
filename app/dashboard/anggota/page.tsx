"use client";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  nomortelepon: string;
  alamat: string;
  role: string;
  last_pay?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Fetch Data
  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/users");
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter & Search
  useEffect(() => {
    let temp = [...users];

    // Filter by role
    if (roleFilter) {
      temp = temp.filter((u) => u.role === roleFilter);
    }

    // Search by name or email
    if (search) {
      temp = temp.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(temp);
  }, [search, roleFilter, users]);

  // Open Edit Modal
  const handleEdit = async (id: number): Promise<void> => {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`);
    const data = await res.json();
    setSelectedUser(data);
    setShowEditModal(true);
  };

  // Save Edit
  const handleSave = async (): Promise<void> => {
    if (!selectedUser) return;

    await fetch(`http://127.0.0.1:8000/api/users/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUser),
    });

    setShowEditModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  // Open Delete Modal
  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Delete User
  const handleDelete = async (): Promise<void> => {
    if (!userToDelete) return;

    await fetch(`http://127.0.0.1:8000/api/users/${userToDelete.id}`, {
      method: "DELETE",
    });

    setShowDeleteModal(false);
    setUserToDelete(null);
    fetchUsers();
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 p-10">
      <main className="flex-1">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="border rounded p-2 flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border rounded p-2"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="anggota">Anggota</option>
              <option value="umum">Umum</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="font-semibold text-gray-700 border-b">
                <th className="pb-3">Nama</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Telepon</th>
                <th className="pb-3">Alamat</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item: User) => (
                <tr key={item.id} className="border-b text-gray-700">
                  <td className="py-4 flex items-center gap-3">{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.nomortelepon}</td>
                  <td>{item.alamat}</td>
                  <td>{item.role}</td>
                  <td className="flex gap-3 text-lg">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-yellow-500"
                    >
                      <img src="/icons/pen.png" alt="" />
                    </button>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="text-red-500"
                    >
                      <img src="/icons/trash.png" alt="" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>

              <input
                className="w-full border p-2 rounded mb-3"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mb-3"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />

              <input
                className="w-full border p-2 rounded mb-3"
                value={selectedUser.nomortelepon}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    nomortelepon: e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-2 rounded mb-3"
                value={selectedUser.alamat}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, alamat: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80 shadow-lg text-center">
              <p className="mb-4 text-gray-800">
                Apakah Anda yakin ingin menghapus <b>{userToDelete.name}</b>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
