import { RefObject } from "react";

export const handlePrint = (printRef: RefObject<HTMLDivElement>) => {
  const content = printRef.current;

  if (!content) return;

  const printWindow = window.open("", "", "width=800,height=1000");

  printWindow!.document.write(`
<html>
<head>
<title>Data Capture Details</title>

<style>
@page {
  size: A4;
  margin: 10mm;
  @bottom-right {
    content: "Page " counter(page) " of " counter(pages);
  }
}

body {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #000;
}


.print-header {
  position: fixed;
  top: 0;
}

 .print-first-page-header {
    display: flex;              /* keep flex */
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .print-first-page-header img {
    width: 140px;               /* stable size for print */
    object-fit: contain;
  }

  .print-first-page-header p {
    margin: 0;
    line-height: 1.4;
  }

/* Headings */
h2 {
  color: #ea580c;
  text-align: center;
  margin-bottom: 12px;
}
h3 {
  color: #ea580c;
  margin-top: 16px; 

}

/* Label */
.print-label {
  font-size: 11px;
  color: #555;
  margin-bottom: 3px;
}

/* Value box (THIS FIXES BORDERS) */
.print-box {
  border: 1px solid #999;
  padding: 8px;
  border-radius: 4px;
  background: #f9fafb;
}

  .print-grid-3 {
    grid-template-columns: repeat(3, 1fr) !important;
  }

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.radio-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #000;
  position: relative;
  flex-shrink: 0;
}

.print-radio-selected .radio-circle::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
}

.radio-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

.print-radio-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


/* Radio option (PRINT ONLY) */
.print-radio {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  border: 2px solid #666;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 11px;
  background: #fff;
}

/* Selected option */
.print-radio-selected {
  border: 3px solid #000;
  background: #e6e6e6;
  font-weight: 700;
  color: #000;
}


/* Avoid cut */
.section {
  page-break-inside: avoid;
}

.page-break {
  page-break-before: always;
}

/* =========================
   BEHAVIOURAL TABLE (PRINT)
   ========================= */

/* Section container */
.print-behavioural {
  page-break-inside: avoid;
  margin-top: 16px;
}

/* Table base */
.print-behavioural table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

/* Header */
.print-behavioural th {
  border: 1px solid #000;
  padding: 6px;
  background: #f0f0f0;
  font-weight: 700;
  text-align: center;
}

/* Body cells */
.print-behavioural td {
  border: 1px solid #000;
  padding: 6px;
  vertical-align: middle;
}

/* Behaviour label column */
.print-behavioural td:first-child {
  font-weight: 600;
  width: 26%;
}

/* Notes column */
.print-behavioural td:last-child {
  width: 22%;
  font-size: 10px;
}



/* =========================
   PAGE CONTROL
   ========================= */

.print-page-break {
  page-break-before: always;
}

@media print {
  body {
    font-size: 11px;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}

.print-other-addiction table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  .print-other-addiction th,
  .print-other-addiction td {
    border: 1px solid #000;
    padding: 6px;
    vertical-align: top;
  }

  .print-other-addiction th {
    background: #f2f2f2;
    font-weight: 700;
    text-align: center;
  }

  .print-other-addiction .status-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 600;
    color: #000;
  }


  .print-other-addiction tr {
    page-break-inside: avoid;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

@media print {
  .no-print {
    display: none !important;
  }

  body * {
    background: none !important;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}

@media print {
  .print-underline {
    text-decoration: underline;
    margin-bottom: 4px;
  }
}

  .print-break-before {
    break-before: page;
    page-break-before: always;
  }

  .print-break-after {
    break-after: page;
    page-break-after: always;
  }

  .print-keep-together {
    break-inside: avoid;
    page-break-inside: avoid;
  }


</style>
</head>

<body>
${content.innerHTML}
</body>
</html>
`);

  printWindow!.document.close();
  printWindow!.focus();

  setTimeout(() => {
    printWindow!.print();
    printWindow!.close();
  }, 500);
};
