import React, { useState, useEffect } from 'react';
import { WeddingConfig, RSVPRecord } from '../types/wedding';
import { BarChart3, LogOut, Lock, User, Mail, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  rsvps: RSVPRecord[];
  config: WeddingConfig;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ rsvps, config, onNavigateHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [filteredRsvps, setFilteredRsvps] = useState(rsvps);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');

  // Load password from localStorage (for demo - in production use backend)
  useEffect(() => {
    const savedPassword = localStorage.getItem('niskala_admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
    } else {
      // Default password for first login
      const defaultPass = 'admin123';
      localStorage.setItem('niskala_admin_password', defaultPass);
      setPassword(defaultPass);
    }
  }, []);

  const handleLogin = () => {
    if (passwordInput === password) {
      setIsAuthenticated(true);
      setPasswordInput('');
      localStorage.setItem('niskala_admin_authenticated', 'true');
    } else {
      alert('Password salah! Default password: admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    localStorage.removeItem('niskala_admin_authenticated');
  };

  // Check if already authenticated from localStorage
  useEffect(() => {
    if (localStorage.getItem('niskala_admin_authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Filter and sort RSVPs
  useEffect(() => {
    let filtered = rsvps;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // Search by name or email
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRsvps(filtered);
  }, [rsvps, filterStatus, searchTerm, sortBy]);

  // Calculate statistics
  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter(r => r.status === 'confirmed').length,
    declined: rsvps.filter(r => r.status === 'declined').length,
    pending: rsvps.filter(r => r.status === 'pending').length,
  };

  const confirmationRate = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Nama', 'Email', 'Status', 'Jumlah Tamu', 'Pesan', 'Tanggal RSVP'];
    const data = filteredRsvps.map(r => [
      r.name,
      r.email || '-',
      r.status,
      r.numberOfGuests || 1,
      r.specialRequest || '-',
      new Date(r.createdAt).toLocaleDateString('id-ID'),
    ]);

    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Clear all RSVPs
  const handleClearAll = () => {
    if (confirm('Hapus semua RSVP? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('niskala_wedding_rsvps');
      window.location.reload();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B89047] to-[#8B7038] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-[#B89047]" />
          </div>
          <h1 className="text-3xl font-bold text-center text-[#2C2724] mb-2">Admin Panel</h1>
          <p className="text-center text-gray-600 mb-6">Masukkan password untuk akses</p>
          
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#B89047]"
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-[#B89047] hover:bg-[#8B7038] text-white font-bold py-2 px-4 rounded-lg transition mb-3"
          >
            Login
          </button>
          
          <button
            onClick={onNavigateHome}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
          >
            Kembali ke Home
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">Default password: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-[#B89047]" />
            <h1 className="text-2xl font-bold text-[#2C2724] dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Wedding: {config.coupleNames}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total RSVP</p>
                <p className="text-3xl font-bold text-[#2C2724] dark:text-white">{stats.total}</p>
              </div>
              <User className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Konfirmasi</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Ditolak</p>
                <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Tingkat Konfirmasi</p>
                <p className="text-3xl font-bold text-[#B89047]">{confirmationRate}%</p>
              </div>
              <BarChart3 className="w-12 h-12 text-[#B89047] opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B89047]"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B89047]"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Konfirmasi</option>
              <option value="declined">Ditolak</option>
              <option value="pending">Tertunda</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B89047]"
            >
              <option value="date">Urutkan: Tanggal (Terbaru)</option>
              <option value="name">Urutkan: Nama</option>
              <option value="status">Urutkan: Status</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex-1"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* RSVP Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Jumlah</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Pesan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredRsvps.length > 0 ? (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{rsvp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rsvp.email || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvp.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          rsvp.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rsvp.status === 'confirmed' ? 'Konfirmasi' :
                           rsvp.status === 'declined' ? 'Ditolak' :
                           'Tertunda'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rsvp.numberOfGuests || 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(rsvp.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {rsvp.specialRequest || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Tidak ada RSVP yang sesuai dengan filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onNavigateHome}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Kembali ke Home
          </button>
          <button
            onClick={handleClearAll}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua RSVP
          </button>
        </div>
      </main>
    </div>
  );
};
