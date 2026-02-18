import { cn } from "@/lib/utils";
import { useRef } from "react";

const OTP_PASSWORD_LENGTH = 6;

export default function OtpPassword({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (value: string) => void;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9a-zA-Z]*$/.test(value)) return;

    const newPassword = password.split("");
    newPassword[index] = value;
    const updated = newPassword.join("").slice(0, OTP_PASSWORD_LENGTH);

    setPassword(updated);

    if (value && index < OTP_PASSWORD_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !password[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <label className="block text-sm font-secondary font-medium text-gray-700 mb-2">
        Password
      </label>

      <div className="flex gap-3">
        {Array.from({ length: OTP_PASSWORD_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="password"
            maxLength={1}
            value={password[index] || ""}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold text-dark-black",
              "border border-gray-300 rounded-lg",
              "focus:outline-none focus:ring-0 focus:border-primary/90",
              "transition-all duration-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}
