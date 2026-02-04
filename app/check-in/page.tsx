"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { toastError } from "@/lib/toast";
import {
  CheckInRecord,
  CheckInSession,
  CheckOutSession,
  EventType,
  SessionMode,
  StaffType,
} from "@/type";

// Admin Components
import AdminLoginPage from "@/component/checkin/admin/AdminLoginPage";
import EventSelectionModal from "@/component/checkin/admin/EventSelectionModal";
import EndCheckInModal from "@/component/checkin/admin/EndCheckInModal";

// Staff Components
import StaffPhotoConfirmation from "@/component/checkin/Staff/StaffPhotoConfirmation";
import CameraPreviewScreen from "@/component/checkin/Staff/CameraPreviewScreen";
import FaceVerificationProcessing from "@/component/checkin/Staff/FaceVerificationProcessing";
import ForgotPINFlow from "@/component/checkin/Staff/ForgotPINFlow";
import StaffCheckOutPage from "@/component/checkin/Staff/StaffCheckOutPage";
import StaffCheckInPage from "@/component/checkin/Staff/StaffCheckInPage";

// Screen Components
import CheckInSuccessScreen from "@/component/shared/CheckInSuccessScreen";
import CheckInErrorScreen from "@/component/shared/CheckInErrorScreen";
import AlreadyCheckedInScreen from "@/component/shared/AlreadyCheckedInScreen";
import LateArrivalWarning from "@/component/shared/LateArrivalWarning";
import AdminHelpRequestScreen from "@/component/shared/AdminHelpRequestScreen";
import VerificationDeniedScreen from "@/component/shared/VerificationDeniedScreen";
import CheckInSessionEndedScreen from "@/component/shared/CheckInSessionEndedScreen";
import CheckInCompleteTransition from "@/component/shared/CheckInCompleteTransition";
import CheckOutSuccessScreen from "@/component/shared/CheckOutSuccessScreen";

// Services
import {
  verifyFace,
  submitCheckIn,
  requestAdminHelp,
  adminSendOTP,
  startCheckOutSession,
} from "@/services/api";
import DemoCredentials from "@/demo/Democredentials";
import EndCheckOutModal from "@/component/checkin/admin/EndCheckOutModal";

type AppStep =
  | "adminLogin"
  | "eventSelection"
  | "staffCheckIn"
  | "photoConfirmation"
  | "camera"
  | "faceVerification"
  | "lateArrival"
  | "checkInSuccess"
  | "checkInError"
  | "alreadyCheckedIn"
  | "adminHelp"
  | "verificationDenied"
  | "sessionEnded"
  | "checkInComplete"
  | "forgotPIN"
  | "staffCheckOut"
  | "checkOutSuccess"
  | "adminOTP";

interface AppState {
  step: AppStep;
  mode: SessionMode;

  adminId: string | null;
  adminName: string | null;

  currentEvent: EventType | null;
  checkInSession: CheckInSession | null;
  checkOutSession: CheckOutSession | null;

  currentStaff: StaffType | null;
  capturedPhoto: string | null;
  lastCheckInRecord: CheckInRecord | null;

  errorType: string | null;
  errorMessage: string | null;

  minutesLate: number;

  isOnline: boolean;
  offlineQueueCount: number;

  showEndSessionModal: boolean;
  showEventSelectionModal: boolean;

  otpAction: string;
  maskedAdminPhone: string;
}

const initialState: AppState = {
  step: "adminLogin",
  mode: "checkin",
  adminId: null,
  adminName: null,
  currentEvent: null,
  checkInSession: null,
  checkOutSession: null,
  currentStaff: null,
  capturedPhoto: null,
  lastCheckInRecord: null,
  errorType: null,
  errorMessage: null,
  minutesLate: 0,
  isOnline: true,
  offlineQueueCount: 0,
  showEndSessionModal: false,
  showEventSelectionModal: false,
  otpAction: "",
  maskedAdminPhone: "",
};

export default function CheckInApp() {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }));

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleAdminLogin = useCallback((adminId: string, adminName: string) => {
    setState((prev) => ({
      ...prev,
      adminId,
      adminName,
      step: "eventSelection",
      showEventSelectionModal: true,
    }));
  }, []);

  const handleSessionStart = useCallback(
    (sessionId: string, event: EventType) => {
      const session: CheckInSession = {
        id: sessionId,
        eventId: event.id,
        event,
        startedAt: new Date().toISOString(),
        startedBy: state.adminId || "",
        status: "active",
        totalCheckedIn: 0,
        autoCloseAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };

      setState((prev) => ({
        ...prev,
        currentEvent: event,
        checkInSession: session,
        step: "staffCheckIn",
        showEventSelectionModal: false,
      }));
    },
    [state.adminId],
  );

  const handleStaffValidated = useCallback(
    (staff: StaffType) => {
      const eventStartTime = state.currentEvent?.startTime;
      if (eventStartTime) {
        const now = new Date();
        const [hours, minutes] = eventStartTime.split(":").map(Number);
        const eventStart = new Date();
        eventStart.setHours(hours, minutes, 0, 0);

        const diffMinutes = Math.floor(
          (now.getTime() - eventStart.getTime()) / 60000,
        );

        if (diffMinutes > 15) {
          setState((prev) => ({
            ...prev,
            currentStaff: staff,
            minutesLate: diffMinutes,
            step: "lateArrival",
          }));
          return;
        }
      }

      setState((prev) => ({
        ...prev,
        currentStaff: staff,
        step: "photoConfirmation",
      }));
    },
    [state.currentEvent],
  );

  const handlePhotoConfirm = useCallback(() => {
    setState((prev) => ({ ...prev, step: "camera" }));
  }, []);

  const handlePhotoReject = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      step: "staffCheckIn",
    }));
  }, []);

  const handlePhotoCapture = useCallback(
    async (imageData: string) => {
      setState((prev) => ({
        ...prev,
        capturedPhoto: imageData,
        step: "faceVerification",
      }));

      try {
        const response = await verifyFace(state.currentStaff!.id, imageData);

        if (response.success && response.data?.verified) {
          const checkInResponse = await submitCheckIn(
            state.checkInSession!.id,
            state.currentStaff!.id,
            imageData,
            "face",
          );

          if (checkInResponse.success && checkInResponse.data) {
            setState((prev) => ({
              ...prev,
              lastCheckInRecord: checkInResponse.data!,
              checkInSession: prev.checkInSession
                ? {
                    ...prev.checkInSession,
                    totalCheckedIn: prev.checkInSession.totalCheckedIn + 1,
                  }
                : null,
              step: "checkInSuccess",
            }));
          } else {
            throw new Error(checkInResponse.error || "Check-in failed");
          }
        } else {
          setState((prev) => ({
            ...prev,
            errorType: "faceVerificationFailed",
            errorMessage:
              "Face verification failed. Please try again or get admin help.",
            step: "checkInError",
          }));
        }
      } catch (err) {
        toastError(err, "Verification failed");
        setState((prev) => ({
          ...prev,
          errorType: "unknown",
          errorMessage:
            err instanceof Error ? err.message : "An error occurred",
          step: "checkInError",
        }));
      }
    },
    [state.currentStaff, state.checkInSession],
  );

  const handleCameraError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "adminHelp",
    }));
  }, []);

  const handleTryAgain = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      capturedPhoto: null,
      errorType: null,
      errorMessage: null,
      step: "staffCheckIn",
    }));
  }, []);

  const handleRetakePhoto = useCallback(() => {
    setState((prev) => ({
      ...prev,
      capturedPhoto: null,
      step: "camera",
    }));
  }, []);

  const handleGetHelp = useCallback(async () => {
    if (!state.currentStaff || !state.checkInSession) return;

    try {
      await requestAdminHelp(
        state.checkInSession.id,
        state.currentStaff.id,
        "Verification assistance needed",
      );
      setState((prev) => ({ ...prev, step: "adminHelp" }));
    } catch (err) {
      toastError(err, "Failed to request help");
    }
  }, [state.currentStaff, state.checkInSession]);

  const handleAdminHelpCancel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      step: "staffCheckIn",
    }));
  }, []);

  const handleAdminHelpTimeout = useCallback(() => {
    toast.warning("Admin help request timed out");
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      step: "staffCheckIn",
    }));
  }, []);

  const handleAlreadyCheckedIn = useCallback(
    (staff: StaffType, checkInTime: string) => {
      setState((prev) => ({
        ...prev,
        currentStaff: staff,
        lastCheckInRecord: { checkInTime } as CheckInRecord,
        step: "alreadyCheckedIn",
      }));
    },
    [],
  );

  const handleCheckInSuccessComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      capturedPhoto: null,
      lastCheckInRecord: null,
      step: "staffCheckIn",
    }));
  }, []);

  const handleEndSession = useCallback(async () => {
    if (!state.adminId) return;

    try {
      const response = await adminSendOTP(state.adminId, "end_session");
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          showEndSessionModal: true,
        }));
      }
    } catch (err) {
      toastError(err, "Failed to initiate session end");
    }
  }, [state.adminId]);

  const handleSessionEnded = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showEndSessionModal: false,
      step: "checkInComplete",
    }));
  }, []);

  const handleStartCheckOut = useCallback(async () => {
    if (!state.currentEvent || !state.adminId) return;

    try {
      const response = await startCheckOutSession(
        state.currentEvent.id,
        state.adminId,
      );
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          mode: "checkout",
          checkOutSession: response.data || null,
          step: "staffCheckOut",
        }));
      } else {
        toastError(response.error, "Failed to start check-out session");
      }
    } catch (err) {
      toastError(err, "Failed to start check-out session");
    }
  }, [state.currentEvent, state.adminId]);

  const handleCheckOutSuccess = useCallback(
    (staff: StaffType, record: CheckInRecord) => {
      setState((prev) => ({
        ...prev,
        currentStaff: staff,
        lastCheckInRecord: record,
        checkOutSession: prev.checkOutSession
          ? {
              ...prev.checkOutSession,
              totalCheckedOut: prev.checkOutSession.totalCheckedOut + 1,
            }
          : null,
        step: "checkOutSuccess",
      }));
    },
    [],
  );

  const handleCheckOutSuccessComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStaff: null,
      lastCheckInRecord: null,
      step: "staffCheckOut",
    }));
  }, []);

  const handleLateArrivalContinue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "photoConfirmation",
    }));
  }, []);

  const handleForgotPIN = useCallback(() => {
    setState((prev) => ({ ...prev, step: "forgotPIN" }));
  }, []);

  const handleForgotPINBack = useCallback(() => {
    setState((prev) => ({ ...prev, step: "staffCheckIn" }));
  }, []);

  const handleContactAdmin = useCallback(async () => {
    if (!state.checkInSession) {
      toast.info("Please contact the event administrator directly.");
      return;
    }

    try {
      await requestAdminHelp(
        state.checkInSession.id,
        state.currentStaff?.id || "unknown",
        "General assistance requested",
      );
      setState((prev) => ({ ...prev, step: "adminHelp" }));
    } catch (err) {
      toastError(err, "Failed to contact admin");
    }
  }, [state.checkInSession, state.currentStaff]);

  const renderCurrentStep = () => {
    switch (state.step) {
      case "adminLogin":
        return <AdminLoginPage onLoginSuccess={handleAdminLogin} />;

      case "eventSelection":
        return (
          <EventSelectionModal
            isOpen={state.showEventSelectionModal}
            onClose={() =>
              setState((prev) => ({ ...prev, showEventSelectionModal: false }))
            }
            adminId={state.adminId || ""}
            onSessionStart={handleSessionStart}
          />
        );

      case "staffCheckIn":
        return (
          <>
            <StaffCheckInPage
              event={state.currentEvent!}
              session={state.checkInSession!}
              onStaffValidated={handleStaffValidated}
              onForgotPIN={handleForgotPIN}
              onContactAdmin={handleContactAdmin}
              onEndSession={() =>
                setState((prev) => ({ ...prev, showEndSessionModal: true }))
              }
              isOnline={state.isOnline}
              offlineQueueCount={state.offlineQueueCount}
              onAlreadyCheckedIn={handleAlreadyCheckedIn}
            />
            <EndCheckInModal
              isOpen={state.showEndSessionModal}
              onClose={() =>
                setState((prev) => ({ ...prev, showEndSessionModal: false }))
              }
              sessionId={state.checkInSession?.id || ""}
              adminId={state.adminId || ""}
              checkedInCount={state.checkInSession?.totalCheckedIn || 0}
              expectedCount={state.currentEvent?.expectedStaffCount || 0}
              onSessionEnded={handleSessionEnded}
            />
          </>
        );

      case "photoConfirmation":
        return (
          <StaffPhotoConfirmation
            staff={state.currentStaff!}
            onConfirm={handlePhotoConfirm}
            onReject={handlePhotoReject}
          />
        );

      case "camera":
        return (
          <CameraPreviewScreen
            onCapture={handlePhotoCapture}
            onCancel={handlePhotoReject}
            onCameraError={handleCameraError}
          />
        );

      case "faceVerification":
        return (
          <FaceVerificationProcessing
            capturedPhoto={state.capturedPhoto!}
            onTimeout={handleGetHelp}
          />
        );

      case "lateArrival":
        return (
          <LateArrivalWarning
            minutesLate={state.minutesLate}
            eventStartTime={state.currentEvent?.startTime || ""}
            onContinue={handleLateArrivalContinue}
          />
        );

      case "checkInSuccess":
        return (
          <CheckInSuccessScreen
            staffName={`${state.currentStaff?.firstName}`}
            checkInTime={new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            onComplete={handleCheckInSuccessComplete}
          />
        );

      case "checkInError":
        return (
          <CheckInErrorScreen
            errorType={(state.errorType as any) || "unknown"}
            errorMessage={state.errorMessage || "An error occurred"}
            onTryAgain={handleTryAgain}
            onRetakePhoto={handleRetakePhoto}
            onGetHelp={handleGetHelp}
            onAutoReturn={handleTryAgain}
          />
        );

      case "alreadyCheckedIn":
        return (
          <AlreadyCheckedInScreen
            staffName={`${state.currentStaff?.firstName} ${state.currentStaff?.lastName}`}
            originalCheckInTime={state.lastCheckInRecord?.checkInTime || ""}
            onAutoReturn={handleTryAgain}
            onContactAdmin={handleContactAdmin}
            countdownSeconds={30}
          />
        );

      case "adminHelp":
        return (
          <AdminHelpRequestScreen
            onCancel={handleAdminHelpCancel}
            onTimeout={handleAdminHelpTimeout}
          />
        );

      case "verificationDenied":
        return <VerificationDeniedScreen onAutoReturn={handleTryAgain} />;

      case "sessionEnded":
        return (
          <CheckInSessionEndedScreen
            endReason="manual"
            totalCheckedIn={state.checkInSession?.totalCheckedIn || 0}
            onContactAdmin={handleContactAdmin}
          />
        );

      case "checkInComplete":
        return (
          <CheckInCompleteTransition
            checkedInCount={state.checkInSession?.totalCheckedIn || 0}
            expectedCount={state.currentEvent?.expectedStaffCount || 0}
            onTimeArrivals={state.checkInSession?.totalCheckedIn || 0}
            lateArrivals={0}
            noShows={
              (state.currentEvent?.expectedStaffCount || 0) -
              (state.checkInSession?.totalCheckedIn || 0)
            }
            sessionDuration="1h 0m"
            onStartCheckOut={handleStartCheckOut}
            onReturnToDashboard={() =>
              (window.location.href = "/admin/dashboard")
            }
          />
        );

      case "forgotPIN":
        return <ForgotPINFlow onBack={handleForgotPINBack} />;

      case "staffCheckOut":
        return (
          <>
            <StaffCheckOutPage
              event={state.currentEvent!}
              session={state.checkOutSession!}
              checkInCount={state.checkInSession?.totalCheckedIn || 0}
              onCheckOutSuccess={handleCheckOutSuccess}
              onContactAdmin={handleContactAdmin}
              onEndSession={() =>
                setState((prev) => ({ ...prev, showEndSessionModal: true }))
              }
              isOnline={state.isOnline}
            />
            <EndCheckOutModal
              isOpen={state.showEndSessionModal}
              onClose={() =>
                setState((prev) => ({ ...prev, showEndSessionModal: false }))
              }
              sessionId={state.checkOutSession?.id || ""}
              adminId={state.adminId || ""}
              checkedOutCount={state.checkOutSession?.totalCheckedOut || 0}
              expectedCount={state.checkInSession?.totalCheckedIn || 0}
              onSessionEnded={() => {
                setState((prev) => ({
                  ...prev,
                  showEndSessionModal: false,
                  step: "sessionEnded",
                }));
              }}
            />
          </>
        );

      case "checkOutSuccess":
        return (
          <CheckOutSuccessScreen
            staffName={state.currentStaff?.firstName || ""}
            checkInTime={state.lastCheckInRecord?.checkInTime || ""}
            checkOutTime={new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            totalHours="8h 0m"
            onComplete={handleCheckOutSuccessComplete}
          />
        );

      default:
        return <AdminLoginPage onLoginSuccess={handleAdminLogin} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
      <DemoCredentials />
    </div>
  );
}
