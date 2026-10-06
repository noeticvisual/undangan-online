import React, { useState } from 'react';
import {
  Plus,
  FolderOpen,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Users,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  CopyCheck,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
} from 'lucide-react';
import { WeddingProject, InvitationTemplateId } from '../types/wedding';
import { INVITATION_TEMPLATES } from '../data/templateThemes';
import { projectManager } from '../services/projectManager';

interface ProjectManagerTabProps {
  projects: WeddingProject[];
  activeSlug: string;
  onSelectProject: (slug: string) => void;
  onOpenNewProjectModal: () => void;
  onRefreshProjects: () => void;
}

export const ProjectManagerTab: React.FC<ProjectManagerTabProps> = ({
  projects,
  activeSlug,
  onSelectProject,
  onOpenNewProjectModal,
  onRefreshProjects,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedClientMsgSlug, setCopiedClientMsgSlug] = useState<string | null>(null);
  const [showPasscodeSlug, setShowPasscodeSlug] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://undangan.domain';

  const totalGuests = projects.reduce((acc, p) => acc + (p.guests?.length || 0), 0);
  const totalRsvps = projects.reduce((acc, p) => acc + (p.rsvps?.length || 0), 0);

  const handleCopyGuestLink = (slug: string) => {
    const link = `${originUrl}/?u=${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleCopyClientMessage = (project: WeddingProject) => {
    const clientUrl = `${originUrl}/?u=${project.slug}&portal=client`;
    const passcode = project.config.clientPasscode || 'mayaarya2026';
    const groomNick = project.config.groom.nickName || 'Pengantin';
    const brideNick = project.config.bride.nickName || 'Pengantin';

    const msg = `Halo ${groomNick} & ${brideNick}!\n\nBerikut tautan portal khusus untuk mengelola daftar tamu undangan, membuat tautan personal per-tamu, dan memantau konfirmasi RSVP pernikahan kalian:\n👉 ${clientUrl}\n\n🔑 Kode Sandi Akses Masuk: ${passcode}\n\n(Mohon simpan dan jaga kerahasiaan kode akses ini agar tidak tersebar ke tamu umum).`;

    navigator.clipboard.writeText(msg);
    setCopiedClientMsgSlug(project.slug);
    setTimeout(() => setCopiedClientMsgSlug(null), 2500);
  };

  const handleDuplicate = (project: WeddingProject) => {
    const newSlug = projectManager.generateUniqueSlug(
      project.config.groom.nickName,
      `${project.config.bride.nickName}-salinan`
    );
    const duplicated = projectManager.duplicateProject(
      project.id,
      newSlug,
      `${project.title} (Salinan)`
    );
    if (duplicated) {
      onRefreshProjects();
      onSelectProject(duplicated.slug);
    }
  };

  const handleDelete = (project: WeddingProject) => {
    setDeleteError(null);
    if (projects.length <= 1) {
      setDeleteError('Tidak dapat menghapus satu-satunya projek yang tersisa.');
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus projek "${project.title}" (Link: ?u=${project.slug})?\n\nSemua data tamu dan RSVP projek ini akan dihapus permanen.`
    );
    if (confirmed) {
      const res = projectManager.deleteProject(project.id);
      if (res.success) {
        onRefreshProjects();
        if (activeSlug === project.slug) {
          const remaining = projects.filter((p) => p.id !== project.id);
          if (remaining.length > 0) {
            onSelectProject(remaining[0].slug);
          }
        }
      } else {
        setDeleteError(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-[#FAF7F2] dark:bg-[#1A221F] p-6 rounded-2xl border border-[#E8DFD3] dark:border-[#2C3833] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD3] dark:border-[#2C3833]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-[#B89047]/10 text-[#B89047]">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="font-serif-luxury text-xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
                Manajemen Projek Klien Undangan
              </h2>
            </div>
            <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
              Kelola banyak klien sekaligus. Setiap klien memiliki tautan unik (<code className="font-mono bg-[#EFE8DD] dark:bg-[#2A3530] px-1.5 py-0.5 rounded text-[#25201C] dark:text-[#FAF7F2]">?u=[slug]</code>), template desain pilihan, kode sandi, dan daftar tamu terisolasi tanpa saling bertabrakan.
            </p>
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#B89047] to-[#A37E38] hover:from-[#A88239] hover:to-[#916E2E] rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Projek Undangan Baru</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141A17] border border-[#E8DFD3] dark:border-[#2C3833] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] uppercase font-semibold block">
                Total Projek Klien
              </span>
              <span className="font-serif-luxury text-xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
                {projects.length} Projek
              </span>
            </div>
            <FolderOpen className="w-5 h-5 text-[#B89047]" />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141A17] border border-[#E8DFD3] dark:border-[#2C3833] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] uppercase font-semibold block">
                Total Tamu Terdata
              </span>
              <span className="font-serif-luxury text-xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
                {totalGuests} Tamu
              </span>
            </div>
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141A17] border border-[#E8DFD3] dark:border-[#2C3833] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] uppercase font-semibold block">
                Total Konfirmasi RSVP
              </span>
              <span className="font-serif-luxury text-xl font-bold text-[#25201C] dark:text-[#FAF7F2]">
                {totalRsvps} Pesan Doa
              </span>
            </div>
            <MessageSquare className="w-5 h-5 text-[#B89047]" />
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
          {deleteError}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => {
          const isActive = project.slug === activeSlug;
          const templateInfo = INVITATION_TEMPLATES[project.templateId as InvitationTemplateId] || INVITATION_TEMPLATES['javanese-royal'];
          const guestCount = project.guests?.length || 0;
          const rsvpCount = project.rsvps?.length || 0;
          const isShowPass = showPasscodeSlug === project.slug;

          return (
            <div
              key={project.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-[#141A17] border-2 border-[#B89047] shadow-md ring-1 ring-[#B89047]/30'
                  : 'bg-[#FAF7F2] dark:bg-[#1A221F] border-[#E8DFD3] dark:border-[#2C3833] hover:border-[#B89047]/60'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#B89047] text-white flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Sedang Dikelola di Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectProject(project.slug)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EFE8DD] dark:bg-[#25302B] text-[#736458] dark:text-[#A79D93] hover:text-[#B89047] cursor-pointer"
                        >
                          Klik untuk Kelola
                        </button>
                      )}

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF7F2] dark:bg-[#202925] border border-[#E8DFD3] dark:border-[#2C3833] text-[#8C7A6B] dark:text-[#A89E94]">
                        {templateInfo.badge}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-lg font-bold text-[#25201C] dark:text-[#FAF7F2]">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#8C7A6B] dark:text-[#A89E94]">
                      {project.config.groom.fullName || project.config.groom.nickName} &amp; {project.config.bride.fullName || project.config.bride.nickName}
                    </p>
                  </div>

                  {/* Template color dot */}
                  <div
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                    title={`Template: ${templateInfo.name}`}
                    style={{ backgroundColor: templateInfo.accentColor }}
                  />
                </div>

                {/* Info Pills & Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 my-2 border-y border-[#E8DFD3] dark:border-[#2C3833] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] block">Link Slug</span>
                    <strong className="font-mono text-[11px] text-[#B89047] block truncate">
                      ?u={project.slug}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] block">Tanggal Acara</span>
                    <span className="font-medium text-[11px] text-[#25201C] dark:text-[#FAF7F2] block truncate">
                      {project.config.events[0]?.dateFormatted || '24 Okt 2026'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#8C7A6B] dark:text-[#A89E94] block">Tamu &amp; RSVP</span>
                    <span className="font-medium text-[11px] text-[#25201C] dark:text-[#FAF7F2] block">
                      {guestCount} Tamu · {rsvpCount} RSVP
                    </span>
                  </div>
                </div>

                {/* Client Passcode Box */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-[#141A17] border border-[#E8DFD3] dark:border-[#2C3833] mb-4 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3.5 h-3.5 text-[#B89047] shrink-0" />
                    <span className="text-[11px] text-[#8C7A6B] dark:text-[#A89E94]">Sandi Klien:</span>
                    <strong className="font-mono text-[11px] text-[#25201C] dark:text-[#FAF7F2]">
                      {isShowPass ? (project.config.clientPasscode || 'mayaarya2026') : '••••••••••••'}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasscodeSlug(isShowPass ? null : project.slug)}
                    className="p-1 text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white cursor-pointer"
                    title={isShowPass ? 'Sembunyikan' : 'Lihat Sandi'}
                  >
                    {isShowPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Primary Quick Links */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`${originUrl}/?u=${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] hover:border-[#B89047] text-[#25201C] dark:text-[#FAF7F2] font-medium transition-colors cursor-pointer text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#B89047]" />
                    <span>Lihat Tamu</span>
                  </a>

                  <a
                    href={`${originUrl}/?u=${project.slug}&portal=client`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#D9CEBF] dark:border-[#2F3D36] bg-white dark:bg-[#141A17] hover:border-[#B89047] text-[#25201C] dark:text-[#FAF7F2] font-medium transition-colors cursor-pointer text-center"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#B89047]" />
                    <span>Portal Klien</span>
                  </a>
                </div>

                {/* Share Link Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleCopyGuestLink(project.slug)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-[#D9CEBF] dark:border-[#2F3D36] bg-[#FAF7F2] dark:bg-[#202925] hover:border-[#B89047] text-[11px] font-medium text-[#736458] dark:text-[#A79D93] transition-colors cursor-pointer"
                  >
                    {copiedSlug === project.slug ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#B89047]" />
                    )}
                    <span>{copiedSlug === project.slug ? 'Link Tersalin!' : 'Salin Link Tamu'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyClientMessage(project)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-[#B89047] to-[#A37E38] text-white text-[11px] font-medium hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    {copiedClientMsgSlug === project.slug ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <CopyCheck className="w-3 h-3" />
                    )}
                    <span>{copiedClientMsgSlug === project.slug ? 'WA Tersalin!' : 'Salin Pesan WA Klien'}</span>
                  </button>
                </div>

                {/* Edit active project & secondary actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD3]/60 dark:border-[#2C3833]/60 text-xs">
                  {!isActive ? (
                    <button
                      onClick={() => onSelectProject(project.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B89047] hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Buka &amp; Edit di Tab Admin</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Workspace Aktif
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDuplicate(project)}
                      className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#25201C] dark:hover:text-white transition-colors cursor-pointer"
                      title="Duplikasi sebagai projek baru"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => handleDelete(project)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Hapus projek ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
