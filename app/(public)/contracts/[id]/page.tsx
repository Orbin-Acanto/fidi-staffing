"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/apiFetch";
import { toastError, toastSuccess } from "@/lib/toast";
import { useParams } from "next/navigation";

type Contract = {
  id: string;
  contract_number: string;
  status: string;
  party_type: "staff" | "vendor";
  company_name: string;
  event_name: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_location: string;
  party_name: string;
  party_email: string;
  party_phone: string;
  role_or_service: string;
  pay_type: string;
  pay_rate: string;
  estimated_hours: string;
  estimated_pay: string;
  dress_code: string;
  additional_details: string;
  terms_and_conditions: string;
  created_at: string;
  staff_signed_at?: string;
};

export default function ContractSigningPage() {
  const params = useParams();
  const contractId = params?.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/contracts/${contractId}/public`);
      setContract(res.contract);
    } catch (error: any) {
      toastError(error?.message || "Failed to load contract");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const downloadPDF = async () => {
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const element = contractRef.current;
      if (!element) return;

      toastSuccess("Generating PDF...");

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const img = document.createElement("img");
      img.src = dataUrl;
      await img.decode();

      const marginTop = 10;
      const marginBottom = 10;
      const marginLeft = 0;
      const marginRight = 0;

      const pageWidth = 210;
      const pageHeight = 297;
      const usableWidth = pageWidth - marginLeft - marginRight;
      const usableHeight = pageHeight - marginTop - marginBottom;

      const imgWidth = usableWidth;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        dataUrl,
        "PNG",
        marginLeft,
        marginTop + position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          "PNG",
          marginLeft,
          marginTop + position,
          imgWidth,
          imgHeight,
        );
        heightLeft -= usableHeight;
      }

      pdf.save(`Contract_${contract?.contract_number}.pdf`);
      toastSuccess("PDF downloaded successfully");
    } catch (error) {
      console.error("Download PDF error:", error);
      toastError("Failed to download PDF");
    }
  };

  const generateSignedPDF = async (): Promise<Blob | null> => {
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const element = contractRef.current;
      if (!element) return null;

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "-9999px";
      wrapper.style.width = element.offsetWidth + "px";
      document.body.appendChild(wrapper);

      const clone = element.cloneNode(true) as HTMLElement;

      const signatureSection = document.createElement("div");
      signatureSection.className = "mt-8 pt-6 border-t-2 border-gray-200";
      signatureSection.innerHTML = `
      <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <h3 class="font-bold text-green-900 mb-4 text-lg">Digitally Signed</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Signed By:</span>
            <span class="text-gray-900 font-serif text-xl italic">${signatureName}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Date & Time:</span>
            <span class="text-gray-900">${new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Status:</span>
            <span class="text-green-600 font-bold text-lg">SIGNED</span>
          </div>
        </div>
      </div>
    `;

      clone.appendChild(signatureSection);
      wrapper.appendChild(clone);

      const dataUrl = await toPng(clone, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      document.body.removeChild(wrapper);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const img = document.createElement("img");
      img.src = dataUrl;
      await img.decode();

      const marginTop = 10;
      const marginBottom = 10;
      const marginLeft = 0;
      const marginRight = 0;

      const pageWidth = 210;
      const pageHeight = 297;
      const usableWidth = pageWidth - marginLeft - marginRight;
      const usableHeight = pageHeight - marginTop - marginBottom;

      const imgWidth = usableWidth;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        dataUrl,
        "PNG",
        marginLeft,
        marginTop + position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          "PNG",
          marginLeft,
          marginTop + position,
          imgWidth,
          imgHeight,
        );
        heightLeft -= usableHeight;
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const getLocationData = async () => {
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const locationResponse = await fetch(
        `https://ipapi.co/${ipData.ip}/json/`,
      );
      const locationData = await locationResponse.json();

      return {
        ip: ipData.ip,
        location: `${locationData.city}, ${locationData.region}, ${locationData.country_name}`,
      };
    } catch (error) {
      return {
        ip: "Unknown",
        location: "Unknown",
      };
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureName.trim()) {
      toastError("Please enter your full name");
      return;
    }

    if (!agreedToTerms) {
      toastError("Please agree to the terms and conditions");
      return;
    }

    setSigning(true);

    try {
      const locationData = await getLocationData();

      toastSuccess("Generating signed contract...");
      const pdfBlob = await generateSignedPDF();

      if (!pdfBlob) {
        throw new Error("Failed to generate signed PDF");
      }

      const formData = new FormData();
      formData.append(
        "signed_contract_pdf",
        pdfBlob,
        `contract_${contractId}_signed.pdf`,
      );
      formData.append("signature_name", signatureName.trim());
      formData.append("signed_at", new Date().toISOString());
      formData.append("ip_address", locationData.ip);
      formData.append("location", locationData.location);
      formData.append("user_agent", navigator.userAgent);

      const response = await fetch(`/api/contracts/${contractId}/public/sign`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign contract");
      }

      toastSuccess("Contract signed successfully!");

      await fetchContract();

      setTimeout(() => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Contract_${contract?.contract_number}_Signed.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 500);
    } catch (error: any) {
      if (
        error.message?.includes("429") ||
        error.message?.includes("throttled") ||
        error.message?.includes("Rate limit")
      ) {
        toastError("Too many signing attempts. Please try again in an hour.");
      } else {
        toastError(error?.message || "Failed to sign contract");
      }
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium text-lg">Contract not found</p>
        </div>
      </div>
    );
  }

  const isSigned = contract.status === "signed";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-end gap-3">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 cursor-pointer bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
        </div>

        <div
          ref={contractRef}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12"
        >
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                SERVICE CONTRACT
              </h1>
              <p className="text-sm text-gray-600">
                Contract #: {contract.contract_number}
              </p>
              <p className="text-sm text-gray-600">
                Date: {formatDate(contract.created_at)}
              </p>
            </div>
          </div>

          {isSigned && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-800 font-semibold">
                  Contract Signed
                </span>
                {contract.staff_signed_at && (
                  <span className="text-green-700 text-sm ml-2">
                    on {formatDate(contract.staff_signed_at)}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              PARTIES TO THIS AGREEMENT
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Service Provider (Company)
                </h3>
                <p className="text-gray-700">{contract.company_name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {contract.party_type === "staff" ? "Staff Member" : "Vendor"}
                </h3>
                <p className="text-gray-700 font-medium">
                  {contract.party_name}
                </p>
                <p className="text-gray-600 text-sm">{contract.party_email}</p>
                <p className="text-gray-600 text-sm">{contract.party_phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              EVENT DETAILS
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 w-48">
                  Event Name:
                </span>
                <span className="text-gray-900">{contract.event_name}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 w-48">Date:</span>
                <span className="text-gray-900">
                  {formatDate(contract.event_date)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 w-48">Time:</span>
                <span className="text-gray-900">
                  {formatTime(contract.event_start_time)} -{" "}
                  {formatTime(contract.event_end_time)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 w-48">
                  Location:
                </span>
                <span className="text-gray-900">{contract.event_location}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold text-gray-700 w-48">
                  Role/Service:
                </span>
                <span className="text-gray-900">
                  {contract.role_or_service}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              COMPENSATION
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Pay Type:</span>
                <span className="text-gray-900 capitalize">
                  {contract.pay_type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Pay Rate:</span>
                <span className="text-gray-900">
                  {formatCurrency(contract.pay_rate)}
                  {contract.pay_type === "hourly" && "/hour"}
                </span>
              </div>
              {contract.estimated_hours && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Estimated Hours:
                  </span>
                  <span className="text-gray-900">
                    {contract.estimated_hours} hours
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-bold text-gray-900">
                  Total Estimated Pay:
                </span>
                <span className="font-bold text-blue-600 text-xl">
                  {formatCurrency(contract.estimated_pay)}
                </span>
              </div>
            </div>
          </div>

          {(contract.dress_code || contract.additional_details) && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                ADDITIONAL REQUIREMENTS
              </h2>
              <div className="space-y-3">
                {contract.dress_code && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Dress Code:
                    </span>
                    <p className="text-gray-900 mt-1 capitalize">
                      {contract.dress_code.replace(/_/g, " ")}
                    </p>
                  </div>
                )}
                {contract.additional_details && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Special Instructions:
                    </span>
                    <p className="text-gray-900 mt-1">
                      {contract.additional_details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              TERMS AND CONDITIONS
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
              {contract.terms_and_conditions ? (
                <p className="whitespace-pre-wrap">
                  {contract.terms_and_conditions}
                </p>
              ) : (
                <>
                  <p>
                    1. The {contract.party_type} agrees to provide services as
                    described above for the specified event.
                  </p>
                  <p>
                    2. Payment will be processed according to the company's
                    standard payroll schedule following completion of services.
                  </p>
                  <p>
                    3. The {contract.party_type} must arrive on time and adhere
                    to all specified requirements including dress code.
                  </p>
                  <p>
                    4. Either party may cancel this agreement with at least 48
                    hours notice. Cancellations with less notice may result in
                    penalties.
                  </p>
                  <p>
                    5. The {contract.party_type} agrees to maintain
                    confidentiality regarding client information and event
                    details.
                  </p>
                  <p>
                    6. This agreement is governed by the laws of the state of
                    New York.
                  </p>
                </>
              )}
            </div>
          </div>

          {!isSigned && (
            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                DIGITAL SIGNATURE
              </h2>
              <form onSubmit={handleSign} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name (Digital Signature) *
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Enter your full legal name"
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-serif text-lg italic"
                    required
                    disabled={signing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    By typing your name, you agree that this constitutes your
                    legal signature
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5"
                    required
                    disabled={signing}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I have read and agree to the terms and conditions outlined
                    in this contract. I understand that by signing this
                    contract, I am legally bound to fulfill the obligations
                    described herein.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={signing || !signatureName.trim() || !agreedToTerms}
                  className="w-full bg-primary cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {signing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing Contract...
                    </>
                  ) : (
                    "Sign Contract"
                  )}
                </button>
              </form>
            </div>
          )}

          {isSigned && (
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-3">
                  Contract Signed
                </h3>
                <p className="text-green-800">
                  This contract has been digitally signed and is legally
                  binding.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This is a legally binding contract. Please read carefully before
            signing.
          </p>
          <p className="mt-1">For questions, contact {contract.company_name}</p>
        </div>
      </div>
    </div>
  );
}
