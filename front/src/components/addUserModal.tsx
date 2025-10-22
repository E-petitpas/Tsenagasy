// front/src/components/addUserModal.tsx

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AddUserModal = ({ onClose, onUserAdded }: { onClose: () => void, onUserAdded: (user: any) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'client' | 'vendor' | 'admin'>('client');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/addUser`, { nom: name, email, role });
      // Ajouter l'utilisateur dans l'état parent
      onUserAdded({
        id: data.id, // supposons que le backend renvoie l'ID
        name,
        email,
        role,
        status: 'pending',
        joinDate: new Date().toLocaleDateString()
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1">
          <X size={18} />
        </button>
        <h3 className="text-lg font-bold mb-4">Ajouter un utilisateur</h3>
        <div className="space-y-3">
            
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'client' | 'vendor' | 'admin')}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2D8A47]"
          >
            <option value="client">Client</option>
            <option value="vendor">Vendeur</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-[#2D8A47] text-white px-4 py-2 rounded hover:bg-[#245A35] w-full"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
