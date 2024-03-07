import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function PinInput({
  onInsertedPin,
}: {
  onInsertedPin: (value: string) => void;
}) {
  const [firstDigit, setFirstDigit] = useState<string>("");
  const [secondDigit, setSecondDigit] = useState<string>("");
  const [thirdDigit, setThirdDigit] = useState<string>("");
  const [fourthDigit, setFourthDigit] = useState<string>("");

  const validate = (str: string) => {
    if (str.length > 1) {
      return str.charAt(1);
    }
    return str;
  };

  const updateField = (index: number, value: string) => {
    switch (index) {
      case 0:
        setFirstDigit(value);
        // focus next field
        value && document.getElementById("pin-input-2")?.focus();
        break;
      case 1:
        setSecondDigit(value);
        // focus next field
        value && document.getElementById("pin-input-3")?.focus();
        break;
      case 2:
        setThirdDigit(value);
        // focus next field
        value && document.getElementById("pin-input-4")?.focus();
        break;
      case 3:
        setFourthDigit(value);
        onInsertedPin(`${firstDigit}${secondDigit}${thirdDigit}${value}`);
        break;
    }
    if (firstDigit && secondDigit && thirdDigit && fourthDigit) {
      onInsertedPin(`${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}`);
    }
  };

  return (
    <div className="flex flex-row items-center justify-items-center justify-center space-x-2">
      <Input
        type="number"
        id="pin-input-1"
        className="pin-input text-2xl w-[3rem] text-center"
        value={firstDigit}
        size="lg"
        onValueChange={(e) => updateField(0, validate(e))}
        maxLength={1}
        min={0}
        max={9}
      />
      <Input
        type="number"
        id="pin-input-2"
        className="pin-input text-2xl w-[3rem] text-center"
        value={secondDigit}
        size="lg"
        onValueChange={(e) => updateField(1, validate(e))}
        maxLength={1}
        min={0}
        max={9}
      />
      <Input
        type="number"
        id="pin-input-3"
        className="pin-input text-2xl w-[3rem] text-center"
        value={thirdDigit}
        size="lg"
        onValueChange={(e) => updateField(2, validate(e))}
        maxLength={1}
        min={0}
        max={9}
      />
      <Input
        type="number"
        id="pin-input-4"
        className="pin-input text-2xl w-[3rem] text-center"
        value={fourthDigit}
        size="lg"
        onValueChange={(e) => updateField(3, validate(e))}
        maxLength={1}
        min={0}
        max={9}
      />
    </div>
  );
}
