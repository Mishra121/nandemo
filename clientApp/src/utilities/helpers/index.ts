export const getActiveAppName = (pathName: string): string => {
  if (pathName.includes("journal-app")) return "Journal";
  if (pathName.includes("expense-manager")) return "BudgetMod";

  return "";
};


export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
