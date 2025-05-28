import { ethers } from "ethers";

export const formatFuelBalance = (balance: string) =>
  parseFloat(ethers.utils.formatUnits(balance, 9));
