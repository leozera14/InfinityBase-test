export const handleAmountInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  const val = e.target.value;
  if (/^\d*\.?\d*$/.test(val)) {
    setState(val);
  }
};
