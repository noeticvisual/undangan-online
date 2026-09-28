import React, { useState } from 'react';
import { WeddingConfig, RSVPRecord } from '../types/wedding';
import { Users, MessageSquare, Share2, ArrowLeft } from 'lucide-react';

interface ClientDashboardProps {
  rsvps: RSVPRecord[];
  config: WeddingConfig;
  onNavigateHome: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ rsvps, config, onNavigateHome }) => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'wishes'>('all');

  // Separate RSVPs and wishes
  const rsvpList = rsvps.filter(r => !r.isWish);
  const wishes = rsvps.filter(r => r.isWish);

  // Filter logic
  const getDisplayList = () => {
    if (filter === 'wishes') return wishes;
    if (filter === 'recent') return rsvpList.slice(0, 10);
    return rsvpList;
  };

  const displayList = getDisplayList();

  // Calculate stats
  const stats = {
    total: rsvpList.length,
    confirmed: rsvpList.filter(r => r.status === 'confirmed').length,
    guests: rsvpList.reduce((sum, r) => sum + (r.numberOfGuests || 1), 0),
    wishes: wishes.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8E0D5] dark:from-[#121615] dark:to-[#1a1d1c]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2C2724] dark:text-white">Tamu kami</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{config.coupleNames}</p>
            </div>
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 bg-[#B89047] hover:bg-[#8B7038] text-white px-4 py-2 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Konfirmasi</p>
                <p className="text-2xl font-bold text-[#2C2724] dark:text-white">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tamu</p>
                <p className="text-2xl font-bold text-[#2C2724] dark:text-white">{stats.guests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-pink-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Ucapan</p>
                <p className="text-2xl font-bold text-[#2C2724] dark:text-white">{stats.wishes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <Share2 className="w-10 h-10 text-purple-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Persentase</p>
                <p className="text-2xl font-bold text-[#2C2724] dark:text-white">
                  {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-[#B89047] text-white'
                : 'bg-white dark:bg-gray-800 text-[#2C2724] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Semua ({rsvpList.length})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'recent'
                ? 'bg-[#B89047] text-white'
                : 'bg-white dark:bg-gray-800 text-[#2C2724] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setFilter('wishes')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'wishes'
                ? 'bg-[#B89047] text-white'
                : 'bg-white dark:bg-gray-800 text-[#2C2724] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Ucapan ({wishes.length})
          </button>
        </div>

        {/* Guest List */}
        <div className="space-y-4">
          {displayList.length > 0 ? (
            displayList.map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition hover:scale-102 border-l-4 border-[#B89047]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-[#B89047]">{index + 1}.</span>
                      <div>
                        <h3 className="text-lg font-bold text-[#2C2724] dark:text-white">{item.name}</h3>
                        {item.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <span>✉</span>
                            {item.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.isWish ? (
                      <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{item.specialRequest}"
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            item.status === 'declined' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {item.status === 'confirmed' ? '✓ Hadir' :
                             item.status === 'declined' ? '✗ Tidak Hadir' :
                             '? Tertunda'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Jumlah Tamu:</span>
                          <span className="text-sm font-bold text-[#2C2724] dark:text-white">{item.numberOfGuests || 1}</span>
                        </div>
                      </div>
                    )}

                    {item.specialRequest && !item.isWish && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">Catatan:</p>
                        <p className="text-sm text-blue-800 dark:text-blue-300">{item.specialRequest}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold">
                {filter === 'wishes' ? 'Belum ada ucapan' : 'Belum ada RSVP'}
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-[#B89047] to-[#D4AF37] rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">📊 Ringkasan Acara</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Total Tamu Undangan</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Telah Konfirmasi</p>
              <p className="text-3xl font-bold">{stats.confirmed}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Tamu Hadir</p>
              <p className="text-3xl font-bold">{stats.guests}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Tingkat Konfirmasi</p>
              <p className="text-3xl font-bold">{stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
