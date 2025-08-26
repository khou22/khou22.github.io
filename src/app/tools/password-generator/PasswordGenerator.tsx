"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?/";
const PASSWORD_LENGTH = 16;

export const PasswordGenerator = () => {
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [mixedCase, setMixedCase] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = useCallback(() => {
    let chars = "";
    if (includeLetters) {
      chars += mixedCase ? LOWERCASE + UPPERCASE : LOWERCASE;
    }
    if (includeNumbers) {
      chars += NUMBERS;
    }
    if (includeSymbols) {
      chars += SYMBOLS;
    }
    if (!chars) {
      setPassword("");
      return;
    }
    let raw = "";
    for (let i = 0; i < PASSWORD_LENGTH; i++) {
      raw += chars[Math.floor(Math.random() * chars.length)];
    }
    const formatted = includeHyphens
      ? raw.match(/.{1,4}/g)?.join("-") || raw
      : raw;
    setPassword(formatted);
  }, [
    includeLetters,
    includeNumbers,
    includeSymbols,
    includeHyphens,
    mixedCase,
  ]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast("Copied to clipboard");
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="letters"
            checked={includeLetters}
            onCheckedChange={(v) => setIncludeLetters(!!v)}
          />
          <Label htmlFor="letters">Letters</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={(v) => setIncludeNumbers(!!v)}
          />
          <Label htmlFor="numbers">Numbers</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="symbols"
            checked={includeSymbols}
            onCheckedChange={(v) => setIncludeSymbols(!!v)}
          />
          <Label htmlFor="symbols">Symbols</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="hyphens"
            checked={includeHyphens}
            onCheckedChange={(v) => setIncludeHyphens(!!v)}
          />
          <Label htmlFor="hyphens">Hyphens</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="mixed"
            checked={mixedCase}
            onCheckedChange={(v) => setMixedCase(!!v)}
            disabled={!includeLetters}
          />
          <Label htmlFor="mixed">Mixed Case</Label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Input value={password} readOnly className="min-w-[250px] flex-1" />
        <Button onClick={copyPassword} type="button">
          Copy
        </Button>
        <Button onClick={generatePassword} type="button">
          Regenerate
        </Button>
      </div>
    </div>
  );
};
