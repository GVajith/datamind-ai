export const sampleRows = [
  { month: "January", short: "Jan", revenue: 18200, orders: 142 },
  { month: "February", short: "Feb", revenue: 24600, orders: 183 },
  { month: "March", short: "Mar", revenue: 21700, orders: 166 },
  { month: "April", short: "Apr", revenue: 31400, orders: 228 },
  { month: "May", short: "May", revenue: 28800, orders: 211 },
  { month: "June", short: "Jun", revenue: 38600, orders: 274 },
];

export const formatAmount = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);

export function downloadSampleCsv() {
  const csv = ["Month,Revenue (INR),Orders", ...sampleRows.map((row) => `${row.month},${row.revenue},${row.orders}`)].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "datamind-sample-sales.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
