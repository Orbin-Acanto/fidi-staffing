"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown({
  initialSeconds,
  onComplete,
  autoStart = true,
}: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      setSeconds(newSeconds ?? initialSeconds);
      setIsRunning(false);
    },
    [initialSeconds],
  );

  const restart = useCallback(
    (newSeconds?: number) => {
      setSeconds(newSeconds ?? initialSeconds);
      setIsRunning(true);
    },
    [initialSeconds],
  );

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      onComplete?.();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, onComplete]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    restart,
    isComplete: seconds === 0,
  };
}

interface UseCameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  stream: MediaStream | null;
  permission: "granted" | "denied" | "pending" | "error";
  isReady: boolean;
  error: string | null;
  capturedImage: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  retakePhoto: () => void;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const { facingMode = "user", width = 640, height = 480 } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permission, setPermission] = useState<
    "granted" | "denied" | "pending" | "error"
  >("pending");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setPermission("pending");
    setError(null);
    setIsReady(false);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsReady(true);
      }

      setPermission("granted");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera";

      if (
        errorMessage.includes("Permission denied") ||
        errorMessage.includes("NotAllowedError")
      ) {
        setPermission("denied");
        setError("Camera permission denied. Please allow camera access.");
      } else {
        setPermission("error");
        setError(errorMessage);
      }
    }
  }, [facingMode, width, height]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsReady(false);
  }, []);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !isReady) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);

    return imageData;
  }, [isReady, facingMode]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    stream: streamRef.current,
    permission,
    isReady,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto,
  };
}

interface UseOfflineQueueOptions {
  syncFn: (queue: unknown[]) => Promise<{ synced: number; failed: number }>;
  onSyncComplete?: (result: { synced: number; failed: number }) => void;
  onSyncError?: (error: Error) => void;
}

export function useOfflineQueue<T extends { id: string; synced?: boolean }>(
  options: UseOfflineQueueOptions,
) {
  const { syncFn, onSyncComplete, onSyncError } = options;

  const [queue, setQueue] = useState<T[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedQueue = localStorage.getItem("checkInOfflineQueue");
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse offline queue:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkInOfflineQueue", JSON.stringify(queue));
  }, [queue]);

  const addToQueue = useCallback((item: T) => {
    setQueue((prev) => [...prev, { ...item, synced: false }]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem("checkInOfflineQueue");
  }, []);

  const syncQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0 || isSyncing) return;

    setIsSyncing(true);

    try {
      const unsyncedItems = queue.filter((item) => !item.synced);
      const result = await syncFn(unsyncedItems);

      setQueue((prev) =>
        prev.map((item) => ({
          ...item,
          synced: true,
        })),
      );

      setQueue((prev) => prev.filter((item) => !item.synced));

      onSyncComplete?.(result);
    } catch (err) {
      onSyncError?.(err instanceof Error ? err : new Error("Sync failed"));
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, queue, isSyncing, syncFn, onSyncComplete, onSyncError]);

  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      syncQueue();
    }
  }, [isOnline, queue.length, isSyncing, syncQueue]);

  return {
    queue,
    queueCount: queue.length,
    isOnline,
    isSyncing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    syncQueue,
  };
}

interface UseSMSOptions {
  cooldownSeconds?: number;
}

export function useSMS(options: UseSMSOptions = {}) {
  const { cooldownSeconds = 30 } = options;

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [canResend, setCanResend] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [cooldown]);

  const sendSMS = useCallback(
    async (sendFn: () => Promise<void>) => {
      if (!canResend) return;

      setStatus("sending");
      setError(null);
      setCanResend(false);

      try {
        await sendFn();
        setStatus("sent");
        setCooldown(cooldownSeconds);
      } catch (err) {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Failed to send SMS");
        setCanResend(true);
      }
    },
    [canResend, cooldownSeconds],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setCanResend(true);
    setCooldown(0);
    setError(null);
  }, []);

  return {
    status,
    canResend,
    cooldown,
    error,
    sendSMS,
    reset,
  };
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      try {
        const audioContext = getAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (e) {
        console.error("Failed to play sound:", e);
      }
    },
    [getAudioContext],
  );

  const playSuccess = useCallback(() => {
    playTone(880, 0.1);
    setTimeout(() => playTone(1108.73, 0.15), 100);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(200, 0.15, "square");
    setTimeout(() => playTone(150, 0.2, "square"), 150);
  }, [playTone]);

  const playNotification = useCallback(() => {
    playTone(523.25, 0.1);
    setTimeout(() => playTone(659.25, 0.1), 100);
    setTimeout(() => playTone(783.99, 0.15), 200);
  }, [playTone]);

  return {
    playSuccess,
    playError,
    playNotification,
    playTone,
  };
}

export function useFlash() {
  const [flashClass, setFlashClass] = useState<string | null>(null);

  const triggerFlash = useCallback(
    (type: "success" | "error", count: number = 2) => {
      const baseClass = type === "success" ? "flash-green" : "flash-red";

      let flashes = 0;
      const interval = setInterval(() => {
        setFlashClass(baseClass);
        setTimeout(() => setFlashClass(null), 150);

        flashes++;
        if (flashes >= count) {
          clearInterval(interval);
        }
      }, 300);
    },
    [],
  );

  const flashSuccess = useCallback(
    (count?: number) => triggerFlash("success", count),
    [triggerFlash],
  );

  const flashError = useCallback(
    (count?: number) => triggerFlash("error", count),
    [triggerFlash],
  );

  return {
    flashClass,
    flashSuccess,
    flashError,
  };
}
