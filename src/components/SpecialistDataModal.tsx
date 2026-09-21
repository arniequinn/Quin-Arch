import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Lock,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Linkedin
} from "lucide-react";
import { SpecialistProfile } from "../types";
import {
  OWNER_EMAIL,
  isOwnerPasskeyVerified,
  verifyOwnerPasskey,
  clearOwnerPasskeySession
} from "../services/ownerAuth";

interface SpecialistDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: SpecialistProfile;
  onSaveProfile: (profile: SpecialistProfile) => void;
}

export const SpecialistDataModal: React.FC<SpecialistDataModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<SpecialistProfile>({ ...currentProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState(false);
  const [sessionUnlocked, setSessionUnlocked] = useState(() => isOwnerPasskeyVerified());

  useEffect(() => {
    setFormData({ ...currentProfile });
  }, [currentProfile]);

  if (!isOpen) return null;

  const isAuthorized = sessionUnlocked;

  const handleVerifyPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPasskey(passkeyInput)) {
      setSessionUnlocked(true);
      setPasskeyError(false);
      setPasskeyInput("");
    } else {
      setPasskeyError(true);
    }
  };

  const handleLockSession = () => {
    clearOwnerPasskeySession();
    setSessionUnlocked(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      alert("Access Denied: Only the verified specialist owner (arslan.qaiser1991@gmail.com) can save profile modifications.");
      return;
    }
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 text-neutral-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              {isAuthorized ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Verified Specialist Administration</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Protected Specialist Profile</span>
                </>
              )}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
            {isAuthorized ? "Configure Specialist Profile & Credentials" : "Specialist Profile & Public Identity"}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isAuthorized 
              ? "Update your official rates, contact details, social portfolio links, and architectural credentials."
              : "This verified profile represents Arslan Qaiser / Quintessential Architecture. Only the verified owner can alter rates, contact info, or licensing."}
          </p>
        </div>

        {/* Access Control Guard Screen if NOT Authorized */}
        {!isAuthorized && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-amber-200">
                    Owner Authentication Required to Edit
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    General visitors cannot modify or overwrite the specialist details section. To protect Arslan Qaiser's rates, credentials, and client intake channels, this section requires owner verification.
                  </p>
                </div>
              </div>

              {/* Owner Passkey Unlock */}
              <div className="pt-2 border-t border-amber-500/20">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2 max-w-sm">
                  <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">
                    Owner Master Passkey
                  </div>
                  <p className="text-xs text-neutral-400">
                    Only Arslan Qaiser ({OWNER_EMAIL}) should have this passkey. Enter it to unlock editing.
                  </p>
                  <form onSubmit={handleVerifyPasskey} className="space-y-2">
                    <div className="relative">
                      <input
                        type="password"
                        value={passkeyInput}
                        onChange={(e) => {
                          setPasskeyInput(e.target.value);
                          setPasskeyError(false);
                        }}
                        placeholder="Enter Owner Passcode..."
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                      />
                      <KeyRound className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-2.5" />
                    </div>
                    {passkeyError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Invalid passcode. Access denied.</span>
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={!passkeyInput.trim()}
                      className="w-full py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-200 text-xs font-medium transition-colors"
                    >
                      Unlock Editing Mode
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Read-Only Profile Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>VERIFIED SPECIALIST OVERVIEW (READ-ONLY)</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Publicly Verified</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Architect / Specialist</span>
                    <span className="font-semibold text-neutral-200 text-sm">{currentProfile.name}</span>
                    <span className="text-amber-400 text-xs block">{currentProfile.title}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Brand & Firm</span>
                    <span className="font-semibold text-neutral-200">{currentProfile.brandName || "Quintessential Architecture"}</span>
                    <span className="text-neutral-400 text-[11px] block">{currentProfile.education}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-900 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">Direct Email</span>
                    <span className="font-mono text-neutral-300">{currentProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">WhatsApp / Phone</span>
                    <span className="font-mono text-neutral-300">{currentProfile.whatsapp || currentProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Standard Rate</span>
                    <span className="font-mono text-amber-400 font-bold">${currentProfile.baseHourlyRate}/hr USD</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-900">
                  <span className="text-neutral-500 text-[11px] block mb-1">Executive Summary</span>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    {currentProfile.bio}
                  </p>
                </div>

                {/* Verified Online Links Preview */}
                <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center gap-2">
                  <span className="text-neutral-500 text-[11px] block mr-1">Public Profiles:</span>
                  <a
                    href={currentProfile.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-600/40 text-sky-300 text-[11px] hover:text-sky-200 transition-colors"
                  >
                    <Linkedin className="w-3 h-3 text-sky-400" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                  </a>
                  {currentProfile.socials?.upwork && (
                    <a
                      href={currentProfile.socials.upwork}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 text-[11px] hover:text-emerald-300 transition-colors"
                    >
                      <span>Upwork</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                    </a>
                  )}
                  {currentProfile.socials?.fiverr && (
                    <a
                      href={currentProfile.socials.fiverr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 text-[11px] hover:text-emerald-300 transition-colors"
                    >
                      <span>Fiverr</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authorized Editing Mode */}
        {isAuthorized && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Owner Active Verification Banner */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-200 font-medium">
                  Verified Owner Active: <span className="font-mono text-emerald-300">Owner Passkey Session</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLockSession}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 underline font-mono cursor-pointer"
                title="Lock editing session"
              >
                Lock Session
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Full Name / Firm Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  WhatsApp / Phone (With Country Code)
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value, phone: e.target.value })}
                  placeholder="+923224316477"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Years Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Completed Projects
                </label>
                <input
                  type="number"
                  value={formData.completedProjectsCount}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, completedProjectsCount: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Base Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.baseHourlyRate}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, baseHourlyRate: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Firm / Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brandName || ""}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="Quintessential Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Degree & Education Credentials
                </label>
                <input
                  type="text"
                  value={formData.education || ""}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="B.Arch (Distinction in Design) - National College of Arts (NCA)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Social and Portfolio Links Section */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Online Profiles & Freelance Portals
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-sky-400 font-mono mb-1 text-[11px] font-semibold flex items-center space-x-1">
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn Profile URL (Verified Public Profile)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.socials?.linkedin || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, linkedin: e.target.value }
                    })}
                    placeholder="https://www.linkedin.com/in/arslan-qaiser-947976188/"
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-sky-800/60 text-neutral-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Instagram Profile</label>
                  <input
                    type="text"
                    value={formData.socials?.instagram || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/quin_arch"
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={formData.socials?.youtube || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, youtube: e.target.value }
                    })}
                    placeholder="https://www.youtube.com/@yourchannel"
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Instagram Handle</label>
                  <input
                    type="text"
                    value={formData.socials?.instagramHandle || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagramHandle: e.target.value }
                    })}
                    placeholder="@quin_arch"
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Upwork Profile URL</label>
                  <input
                    type="text"
                    value={formData.socials?.upwork || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, upwork: e.target.value }
                    })}
                    placeholder="https://www.upwork.com/freelancers/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Fiverr Profile / Gig URL</label>
                  <input
                    type="text"
                    value={formData.socials?.fiverr || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, fiverr: e.target.value }
                    })}
                    placeholder="https://www.fiverr.com/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Freelancer.com URL</label>
                  <input
                    type="text"
                    value={formData.socials?.freelancer || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, freelancer: e.target.value }
                    })}
                    placeholder="https://www.freelancer.com/u/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1 text-[11px]">Cad Crowd Profile URL</label>
                  <input
                    type="text"
                    value={formData.socials?.cadcrowd || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      socials: { ...formData.socials, cadcrowd: e.target.value }
                    })}
                    placeholder="https://www.cadcrowd.com/profile/..."
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Studio Location / Timezone Reach
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Bio / Experience Summary
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="pt-3 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Specialist Data</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
