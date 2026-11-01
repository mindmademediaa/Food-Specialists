import React, { useState, useRef } from 'react';
import {
  Upload,
  Printer,
  Download,
  Plus,
  Trash2,
  Lock,
  Check,
  Sparkles,
  FileText
} from 'lucide-react';
import { UserProfile, CvTemplateId } from '../types';
import { DEFAULT_AVATAR_SVG } from '../data/initialData';
import { triggerCvPdfPrint, downloadCvStandaloneFile } from '../utils/cvExport';

interface ProfileCvModuleProps {
  profile: UserProfile;
  isPaidMember: boolean;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpgradeToPro: () => void;
}

type EditorSection =
  | 'personal'
  | 'certifications'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills';

export const ProfileCvModule: React.FC<ProfileCvModuleProps> = ({
  profile,
  isPaidMember,
  onUpdateProfile,
  onUpgradeToPro
}) => {
  const [activeEditorSection, setActiveEditorSection] = useState<EditorSection>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplateId>('modern-clean');
  const [newSkill, setNewSkill] = useState('');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    onUpdateProfile({
      ...profile,
      [field]: value
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateProfile({
          ...profile,
          avatarUrl: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (!profile.skills.includes(trimmed)) {
      onUpdateProfile({
        ...profile,
        skills: [...profile.skills, trimmed]
      });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdateProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Certifications handlers
  const handleAddCertification = () => {
    onUpdateProfile({
      ...profile,
      certifications: [
        {
          id: `cert-${Date.now()}`,
          name: 'HACCP Level 3 Award in Food Safety',
          issuingBody: 'Highfield / RSPH',
          year: '2026',
          credentialId: 'FS-CERT-2026'
        },
        ...profile.certifications
      ]
    });
  };

  const handleUpdateCertification = (
    id: string,
    field: 'name' | 'issuingBody' | 'year' | 'credentialId',
    value: string
  ) => {
    onUpdateProfile({
      ...profile,
      certifications: profile.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    });
  };

  const handleRemoveCertification = (id: string) => {
    onUpdateProfile({
      ...profile,
      certifications: profile.certifications.filter((c) => c.id !== id)
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    onUpdateProfile({
      ...profile,
      experience: [
        {
          id: `exp-${Date.now()}`,
          jobTitle: 'Food Safety & QA Officer',
          company: 'Food Manufacturing Co.',
          sector: 'Dairy / Beverage / FMCG',
          duration: '2025 – Present',
          responsibilities:
            'Supervised daily CCP logs, conducted internal GMP audits, and verified CIP sanitation logs across production lines.'
        },
        ...profile.experience
      ]
    });
  };

  const handleUpdateExperience = (
    id: string,
    field: 'jobTitle' | 'company' | 'sector' | 'duration' | 'responsibilities',
    value: string
  ) => {
    onUpdateProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const handleRemoveExperience = (id: string) => {
    onUpdateProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id)
    });
  };

  // Education handlers
  const handleAddEducation = () => {
    onUpdateProfile({
      ...profile,
      education: [
        {
          id: `edu-${Date.now()}`,
          degree: 'BS (Hons.) Food Science & Technology',
          institution: 'University of Agriculture / Food Institute',
          graduationYear: '2024',
          cgpa: '3.70 / 4.00'
        },
        ...profile.education
      ]
    });
  };

  const handleUpdateEducation = (
    id: string,
    field: 'degree' | 'institution' | 'graduationYear' | 'cgpa',
    value: string
  ) => {
    onUpdateProfile({
      ...profile,
      education: profile.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const handleRemoveEducation = (id: string) => {
    onUpdateProfile({
      ...profile,
      education: profile.education.filter((edu) => edu.id !== id)
    });
  };

  // Projects handlers
  const handleAddProject = () => {
    onUpdateProfile({
      ...profile,
      projects: [
        {
          id: `proj-${Date.now()}`,
          title: 'Shelf-Life Extension & Packaging Barrier Trial',
          role: 'Lead Food Technologist',
          year: '2026',
          outcomes:
            'Extended ambient stability by 45 days and validated zero microbial spoilage across accelerated storage.'
        },
        ...profile.projects
      ]
    });
  };

  const handleUpdateProject = (
    id: string,
    field: 'title' | 'role' | 'year' | 'outcomes',
    value: string
  ) => {
    onUpdateProfile({
      ...profile,
      projects: profile.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    });
  };

  const handleRemoveProject = (id: string) => {
    onUpdateProfile({
      ...profile,
      projects: profile.projects.filter((p) => p.id !== id)
    });
  };

  const isTemplateLocked =
    !isPaidMember &&
    (selectedTemplate === 'ats-standard' || selectedTemplate === 'executive-specialist');

  const handlePrintPdf = () => {
    if (isTemplateLocked) {
      onUpgradeToPro();
      return;
    }
    triggerCvPdfPrint(profile, selectedTemplate);
    setExportFeedback('Prepared A4 PDF print view for ' + selectedTemplate);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  const handleDownloadFile = () => {
    if (isTemplateLocked) {
      onUpgradeToPro();
      return;
    }
    downloadCvStandaloneFile(profile, selectedTemplate);
    setExportFeedback('Downloaded printable CV file (' + selectedTemplate + ')');
    setTimeout(() => setExportFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            Food Industry Profile & Dynamic Multi-Template Resume Engine
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Profile & CV Builder
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Maintain your Food Safety certifications, QA/QC lab experience, industrial projects, and academic records. Switch between 3 industry CV formats and export as PDF.
          </p>
        </div>

        {/* CV Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate CV (Print / Save PDF)</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadFile}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CV File</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{exportFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportFeedback(null)}
            className="text-emerald-700 hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 2-Column Workspace: Left = Profile Editor, Right = Live Multi-Template CV Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Structured Profile Editor (5 cols) */}
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {(
              [
                { id: 'personal', label: 'Personal' },
                { id: 'certifications', label: `Certifications (${profile.certifications.length})` },
                { id: 'experience', label: `Experience (${profile.experience.length})` },
                { id: 'projects', label: `Projects (${profile.projects.length})` },
                { id: 'education', label: `Education (${profile.education.length})` },
                { id: 'skills', label: 'Skills' }
              ] as { id: EditorSection; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveEditorSection(tab.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeEditorSection === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Personal Details & Photo Upload */}
          {activeEditorSection === 'personal' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={profile.avatarUrl || DEFAULT_AVATAR_SVG}
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                  }}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-900 shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-900">
                    Specialist Profile Photograph
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    {profile.avatarUrl !== DEFAULT_AVATAR_SVG && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange('avatarUrl', DEFAULT_AVATAR_SVG)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name & Credentials
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Title / Specialization
                  </label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) => handleFieldChange('professionalTitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location & Mobility
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LinkedIn / Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Executive Summary
                  </label>
                  <textarea
                    rows={4}
                    value={profile.summary}
                    onChange={(e) => handleFieldChange('summary', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Certifications (Crucial for Food Sector) */}
          {activeEditorSection === 'certifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Food Safety & Quality Certifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    ISO 22000, FSSC 22000, HACCP Level 3/4, BRCGS, Halal, Six Sigma
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {profile.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) =>
                          handleUpdateCertification(cert.id, 'name', e.target.value)
                        }
                        placeholder="Certification Name (e.g., Lead Auditor ISO 22000)"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(cert.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md shrink-0"
                        aria-label="Delete certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={cert.issuingBody}
                        onChange={(e) =>
                          handleUpdateCertification(cert.id, 'issuingBody', e.target.value)
                        }
                        placeholder="Issuing Body"
                        className="col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) =>
                          handleUpdateCertification(cert.id, 'year', e.target.value)
                        }
                        placeholder="Year"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 tabular-nums"
                      />
                    </div>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) =>
                        handleUpdateCertification(cert.id, 'credentialId', e.target.value)
                      }
                      placeholder="Certificate / IRCA ID"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Work Experience */}
          {activeEditorSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Food Industry Work Experience
                  </h3>
                  <p className="text-xs text-slate-500">
                    QA/QC, Food Safety Auditing, R&D, Production & Lab Roles
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, 'jobTitle', e.target.value)
                        }
                        placeholder="Job Title"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md shrink-0"
                        aria-label="Delete experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, 'company', e.target.value)
                        }
                        placeholder="Company Name"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                      />
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, 'duration', e.target.value)
                        }
                        placeholder="Duration (e.g. 2023 – Present)"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                      />
                    </div>
                    <input
                      type="text"
                      value={exp.sector}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, 'sector', e.target.value)
                      }
                      placeholder="Food Industry Sector (e.g., Dairy, Beverage, Meat, Confectionery)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                    />
                    <textarea
                      rows={3}
                      value={exp.responsibilities}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, 'responsibilities', e.target.value)
                      }
                      placeholder="Key responsibilities, audit results, and quality improvements..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Industrial & Research Projects */}
          {activeEditorSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Industrial & Academic Research Projects
                  </h3>
                  <p className="text-xs text-slate-500">
                    CIP optimization, shelf-life trials, HACCP validation, thesis work
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {profile.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) =>
                          handleUpdateProject(proj.id, 'title', e.target.value)
                        }
                        placeholder="Project Title"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md shrink-0"
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) =>
                          handleUpdateProject(proj.id, 'role', e.target.value)
                        }
                        placeholder="Role"
                        className="col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                      />
                      <input
                        type="text"
                        value={proj.year}
                        onChange={(e) =>
                          handleUpdateProject(proj.id, 'year', e.target.value)
                        }
                        placeholder="Year"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 tabular-nums"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={proj.outcomes}
                      onChange={(e) =>
                        handleUpdateProject(proj.id, 'outcomes', e.target.value)
                      }
                      placeholder="Measurable outcomes..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Education */}
          {activeEditorSection === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Academic Education</h3>
                  <p className="text-xs text-slate-500">
                    BS / MS / PhD in Food Science, Food Technology, Nutrition, Microbiology
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, 'degree', e.target.value)
                        }
                        placeholder="Degree Title"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md shrink-0"
                        aria-label="Delete degree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, 'institution', e.target.value)
                      }
                      placeholder="University / Institution"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, 'graduationYear', e.target.value)
                        }
                        placeholder="Graduation Year"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 tabular-nums"
                      />
                      <input
                        type="text"
                        value={edu.cgpa}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, 'cgpa', e.target.value)
                        }
                        placeholder="CGPA / Grade"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 tabular-nums"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Core Food Industry Skills */}
          {activeEditorSection === 'skills' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Core Technical & Regulatory Competencies
                </h3>
                <p className="text-xs text-slate-500">
                  Add food safety standards, lab instrumentation, and quality tools
                </p>
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., Gas Chromatography, Halal MS 1500, SAP QM..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Add Skill
                </button>
              </form>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-slate-50">
                {profile.skills.map((skill) => (
                  <div
                    key={skill}
                    className="px-3 py-2 flex items-center justify-between text-xs text-slate-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      aria-label={`Remove ${skill}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Template Selector & Live A4 CV Preview (7 cols) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Template Selector Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select CV Template Layout</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Switch templates in real-time before generating your PDF
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedTemplate('modern-clean')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedTemplate === 'modern-clean'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Modern Clean (Free)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('ats-standard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTemplate === 'ats-standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {!isPaidMember && <Lock className="w-3 h-3 text-amber-600" />}
                <span>2. ATS-Standard (Pro)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('executive-specialist')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  selectedTemplate === 'executive-specialist'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {!isPaidMember && <Lock className="w-3 h-3 text-amber-600" />}
                <span>3. Executive Specialist (Pro)</span>
              </button>
            </div>
          </div>

          {/* Pro Template Gate Banner if Free user selects Template 2 or 3 */}
          {isTemplateLocked && (
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Premium Food Industry Resume Template</span>
                </div>
                <p className="text-xs text-slate-300">
                  Free members have full access to the Modern Clean CV template. Upgrade to Pro to export ATS-Standard and Executive Specialist formats.
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgradeToPro}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Unlock Pro Templates
              </button>
            </div>
          )}

          {/* Live CV Document Sheet */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            {/* TEMPLATE 1: MODERN CLEAN (Two-column with profile picture and competencies) */}
            {selectedTemplate === 'modern-clean' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Dark Slate Column */}
                <div className="md:col-span-4 bg-slate-800 text-slate-100 rounded-lg p-5 space-y-5">
                  <div className="flex flex-col items-start">
                    <img
                      src={profile.avatarUrl || DEFAULT_AVATAR_SVG}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                      }}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-400 bg-slate-900 mb-3"
                    />
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-700 pb-1 w-full">
                      Contact Details
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-slate-300 break-all">
                      <div>{profile.email}</div>
                      <div>{profile.phone}</div>
                      <div>{profile.location}</div>
                      <div>{profile.linkedin}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-700 pb-1">
                      Core Competencies
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-200">
                      {profile.skills.map((skill) => (
                        <li key={skill} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">·</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-700 pb-1">
                      Academic Education
                    </div>
                    <div className="mt-2 space-y-3">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="text-xs">
                          <div className="font-semibold text-white">{edu.degree}</div>
                          <div className="text-slate-300">{edu.institution}</div>
                          <div className="text-emerald-400 tabular-nums">
                            {edu.graduationYear} · CGPA {edu.cgpa}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="md:col-span-8 space-y-5">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {profile.fullName}
                    </h2>
                    <div className="text-sm font-semibold text-emerald-700 mt-0.5">
                      {profile.professionalTitle}
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {profile.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                      Food Industry Experience
                    </h3>
                    <div className="space-y-4">
                      {profile.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {exp.jobTitle}
                            </span>
                            <span className="text-xs text-slate-500 tabular-nums shrink-0">
                              {exp.duration}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-emerald-700">
                            {exp.company} · {exp.sector}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {exp.responsibilities}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                      Accredited Certifications & Licenses
                    </h3>
                    <div className="space-y-2">
                      {profile.certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">
                              {cert.name}
                            </span>{' '}
                            <span className="text-slate-500">· {cert.issuingBody}</span>
                          </div>
                          <span className="text-slate-500 font-mono tabular-nums shrink-0">
                            {cert.year} ({cert.credentialId})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
                      Industrial & Research Projects
                    </h3>
                    <div className="space-y-3">
                      {profile.projects.map((proj) => (
                        <div key={proj.id}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {proj.title}
                            </span>
                            <span className="text-xs text-slate-500 tabular-nums">
                              {proj.year}
                            </span>
                          </div>
                          <div className="text-xs text-emerald-700 font-medium">
                            {proj.role}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {proj.outcomes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 2: ATS-STANDARD (Single-column corporate layout) */}
            {selectedTemplate === 'ats-standard' && (
              <div className={isTemplateLocked ? 'opacity-75' : ''}>
                <div className="border-b-2 border-slate-900 pb-3 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {profile.fullName}
                  </h2>
                  <div className="text-sm font-semibold text-slate-700 mt-0.5">
                    {profile.professionalTitle}
                  </div>
                  <div className="text-xs text-slate-600 mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span>{profile.email}</span>
                    <span>·</span>
                    <span>{profile.phone}</span>
                    <span>·</span>
                    <span>{profile.location}</span>
                    <span>·</span>
                    <span>{profile.linkedin}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {profile.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                      Core Food Safety & Quality Competencies
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {profile.skills.join(' · ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Certifications & Auditor Credentials
                    </h3>
                    <div className="space-y-1.5">
                      {profile.certifications.map((c) => (
                        <div
                          key={c.id}
                          className="flex flex-wrap justify-between text-xs text-slate-800"
                        >
                          <span>
                            <strong>{c.name}</strong> — {c.issuingBody}
                          </span>
                          <span className="font-mono tabular-nums text-slate-600">
                            {c.year} · ID: {c.credentialId}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Professional Experience
                    </h3>
                    <div className="space-y-3">
                      {profile.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between text-xs font-bold text-slate-900">
                            <span>
                              {exp.jobTitle} — {exp.company}
                            </span>
                            <span className="tabular-nums">{exp.duration}</span>
                          </div>
                          <div className="text-xs font-medium text-slate-600">
                            Sector: {exp.sector}
                          </div>
                          <p className="text-xs text-slate-700 mt-1">
                            {exp.responsibilities}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Industrial & Research Projects
                    </h3>
                    <div className="space-y-2.5">
                      {profile.projects.map((p) => (
                        <div key={p.id}>
                          <div className="flex justify-between text-xs font-bold text-slate-900">
                            <span>
                              {p.title} ({p.role})
                            </span>
                            <span className="tabular-nums">{p.year}</span>
                          </div>
                          <p className="text-xs text-slate-700 mt-0.5">{p.outcomes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      Education
                    </h3>
                    <div className="space-y-1.5">
                      {profile.education.map((e) => (
                        <div
                          key={e.id}
                          className="flex justify-between text-xs text-slate-800"
                        >
                          <span>
                            <strong>{e.degree}</strong> — {e.institution}
                          </span>
                          <span className="tabular-nums">
                            {e.graduationYear} · CGPA {e.cgpa}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: EXECUTIVE SPECIALIST (Certifications & Audit Experience at Top) */}
            {selectedTemplate === 'executive-specialist' && (
              <div className={`space-y-5 ${isTemplateLocked ? 'opacity-75' : ''}`}>
                <div className="bg-slate-900 text-white p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {profile.fullName}
                    </h2>
                    <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                      {profile.professionalTitle}
                    </div>
                    <div className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-1.5">
                      <span>{profile.email}</span>
                      <span>·</span>
                      <span>{profile.phone}</span>
                      <span>·</span>
                      <span>{profile.location}</span>
                    </div>
                  </div>
                  <img
                    src={profile.avatarUrl || DEFAULT_AVATAR_SVG}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover border border-emerald-400 shrink-0"
                  />
                </div>

                {/* Highlighted Certifications Box at Top */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5">
                    Accredited Food Safety & Quality Auditor Licenses
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {profile.certifications.map((c) => (
                      <div key={c.id} className="text-xs border-b border-slate-200/70 pb-1.5">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-slate-600 tabular-nums">
                          {c.issuingBody} · {c.year} · <span className="font-mono">{c.credentialId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-200 pb-1 mb-2">
                    Executive Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {profile.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-slate-200 pb-1 mb-2.5">
                    Leadership & Plant Audit Experience
                  </h3>
                  <div className="space-y-3.5">
                    {profile.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                          <span>
                            {exp.jobTitle} — {exp.company}
                          </span>
                          <span className="tabular-nums text-slate-500">{exp.duration}</span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-700">
                          {exp.sector}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {exp.responsibilities}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                      Academic Credentials
                    </h3>
                    <div className="space-y-2">
                      {profile.education.map((e) => (
                        <div key={e.id} className="text-xs">
                          <div className="font-bold text-slate-900">{e.degree}</div>
                          <div className="text-slate-600">{e.institution}</div>
                          <div className="text-slate-500 tabular-nums">
                            {e.graduationYear} · CGPA {e.cgpa}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                      Key Industrial Projects
                    </h3>
                    <div className="space-y-2">
                      {profile.projects.map((p) => (
                        <div key={p.id} className="text-xs">
                          <div className="font-bold text-slate-900">
                            {p.title} ({p.year})
                          </div>
                          <div className="text-slate-600">{p.outcomes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
