"use client";
import { EmailSettings, EmailTemplate } from "@/type";
import { useState } from "react";

interface EmailSettingsTabProps {
  settings: EmailSettings;
  onSave: (settings: EmailSettings) => void;
}

export default function EmailSettingsTab({
  settings,
  onSave,
}: EmailSettingsTabProps) {
  const [formData, setFormData] = useState<EmailSettings>(settings);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleSenderChange = (
    field: "senderName" | "senderEmail",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleTemplateEdit = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
  };

  const handleTemplateSave = () => {
    if (!editingTemplate) return;

    setFormData((prev) => ({
      ...prev,
      templates: prev.templates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...editingTemplate,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : t
      ),
    }));
    setEditingTemplate(null);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case "welcome":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case "event_assignment":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "event_reminder":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
      case "password_reset":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Sender Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure the default sender for all emails
          </p>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => handleSenderChange("senderName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
              Sender Email
            </label>
            <input
              type="email"
              value={formData.senderEmail}
              onChange={(e) =>
                handleSenderChange("senderEmail", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-primary font-semibold text-gray-900">
            Email Templates
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Customize automated email templates
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {formData.templates.map((template) => (
            <div key={template.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                    {getTemplateIcon(template.id)}
                  </div>
                  <div>
                    <h4 className="font-secondary font-medium text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Subject: {template.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated:{" "}
                      {template.lastUpdated
                        ? new Date(template.lastUpdated).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleTemplateEdit(template)}
                  className="px-3 py-1.5 text-sm font-secondary font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="mt-3 ml-12">
                <p className="text-xs text-gray-500 mb-1">
                  Available variables:
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-600 rounded"
                    >
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <button
            onClick={() => {
              setFormData(settings);
              setHasChanges(false);
            }}
            className="px-4 py-2 text-sm font-secondary font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-secondary font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-700/70 transition-opacity"
              onClick={() => setEditingTemplate(null)}
            />

            <div className="relative inline-block w-full max-w-2xl my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getTemplateIcon(editingTemplate.id)}
                  </div>
                  <div>
                    <h2 className="text-xl font-primary font-bold text-gray-900">
                      Edit {editingTemplate.name}
                    </h2>
                    <p className="text-sm font-secondary text-gray-500">
                      Customize the email template
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) =>
                      setEditingTemplate((prev) =>
                        prev ? { ...prev, subject: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-secondary font-medium text-gray-700 mb-1">
                    Email Body
                  </label>
                  <textarea
                    value={editingTemplate.body}
                    onChange={(e) =>
                      setEditingTemplate((prev) =>
                        prev ? { ...prev, body: e.target.value } : null
                      )
                    }
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-secondary text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-secondary font-medium text-blue-800 mb-2">
                    Available Variables:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {editingTemplate.variables.map((variable) => (
                      <button
                        key={variable}
                        onClick={() => {
                          const textarea = document.querySelector("textarea");
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = editingTemplate.body;
                            const newText =
                              text.substring(0, start) +
                              `{{${variable}}}` +
                              text.substring(end);
                            setEditingTemplate((prev) =>
                              prev ? { ...prev, body: newText } : null
                            );
                          }
                        }}
                        className="px-2 py-1 text-xs font-mono bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        {`{{${variable}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 text-gray-700 font-secondary font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTemplateSave}
                  className="px-4 py-2 bg-primary text-white font-secondary font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
