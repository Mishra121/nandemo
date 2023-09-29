export const getActiveAppName = (pathName: string): string => {
  if (pathName.includes("journal-app")) return "Journal";
  if (pathName.includes("expense-manager")) return "BudgetMod";

  return "";
};
