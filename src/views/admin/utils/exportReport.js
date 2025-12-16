import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  Packer,
} from 'docx'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// Column mappings for different event types
const columnMapping = {
  baptism: {
    'Child Name': (item) => `${item.child_firstname || ''} ${item.child_lastname || ''}`,
    Date: (item) => formatDate(item.baptism_date),
    Time: (item) => formatTimeRange(item.starting_time, item.ending_time),
    Status: (item) => getStatus(item),
  },
  wedding: {
    Couple: (item) => `${item.bride_firstname || ''} & ${item.groom_firstname || ''}`,
    Date: (item) => formatDate(item.wedding_date),
    Time: (item) => formatTimeRange(item.starting_time),
    Status: (item) => getStatus(item),
  },
  funeral: {
    Deceased: (item) => `${item.deceased_firstname || ''} ${item.deceased_lastname || ''}`,
    Date: (item) => formatDate(item.funeral_date),
    Time: (item) => formatTimeRange(item.starting_time, item.ending_time),
    Status: (item) => getStatus(item),
  },
  thanksgiving: {
    Title: (item) => item.title || '',
    Organizer: (item) => item.organizer || '',
    Date: (item) => formatDate(item.thanksgiving_date),
    Time: (item) => formatTimeRange(item.starting_time, item.ending_time),
    Status: (item) => getStatus(item),
  },
  others: {
    Title: (item) => item.title || '',
    Date: (item) => formatDate(item.date),
    Time: (item) => formatTimeRange(item.starting_time, item.ending_time),
    Status: (item) => getStatus(item),
  },
}

// Helper functions
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeRange(start, end) {
  if (!start) return ''
  const formatTime = (t) => {
    const [h, m] = t.split(':')
    const date = new Date()
    date.setHours(h, m)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  if (!end) return formatTime(start)
  return `${formatTime(start)} - ${formatTime(end)}`
}

function getStatus(item) {
  if (item.is_approved) return 'Approved'
  if (item.is_denied) return 'Denied'
  return 'Pending'
}

/**
 * Generate and export booking trends report as Excel
 */
export async function exportBookingTrendsExcel(
  trendData,
  currentMonthCounts,
  detailedBookings = {},
) {
  const now = new Date()
  const wb = XLSX.utils.book_new()

  // We will build an array of arrays (AOA) representing the whole sheet
  let wsData = []

  // 1. Title
  wsData.push([
    `Booking Trends Report - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
  ])
  wsData.push([]) // spacing

  // 2. Current Month Summary
  wsData.push([`Current Month Summary`])
  wsData.push(['Booking Type', 'Count'])
  const currentTotal = Object.values(currentMonthCounts).reduce((sum, count) => sum + count, 0)
  wsData.push(['Baptism', currentMonthCounts.baptism])
  wsData.push(['Wedding', currentMonthCounts.wedding])
  wsData.push(['Funeral', currentMonthCounts.funeral])
  wsData.push(['Thanksgiving', currentMonthCounts.thanksgiving])
  wsData.push(['Others', currentMonthCounts.others])
  wsData.push(['Total', currentTotal])
  wsData.push([]) // spacing
  wsData.push([]) // spacing

  // 3. Historical Trends
  wsData.push(['Historical Booking Trends'])
  const trendsHeaders = [
    'Month',
    'Baptism',
    'Wedding',
    'Funeral',
    'Thanksgiving',
    'Others',
    'Total',
  ]
  wsData.push(trendsHeaders)

  trendData.forEach((monthData) => {
    wsData.push([
      monthData.month,
      monthData.baptism,
      monthData.wedding,
      monthData.funeral,
      monthData.thanksgiving,
      monthData.others,
      monthData.baptism +
        monthData.wedding +
        monthData.funeral +
        monthData.thanksgiving +
        monthData.others,
    ])
  })

  // Totals row for trends
  const totals = trendData.reduce(
    (acc, month) => {
      acc.baptism += month.baptism
      acc.wedding += month.wedding
      acc.funeral += month.funeral
      acc.thanksgiving += month.thanksgiving
      acc.others += month.others
      return acc
    },
    { baptism: 0, wedding: 0, funeral: 0, thanksgiving: 0, others: 0 },
  )

  wsData.push([
    'TOTAL',
    totals.baptism,
    totals.wedding,
    totals.funeral,
    totals.thanksgiving,
    totals.others,
    totals.baptism + totals.wedding + totals.funeral + totals.thanksgiving + totals.others,
  ])
  wsData.push([]) // spacing
  wsData.push([]) // spacing

  // 4. Detailed Sections
  if (detailedBookings) {
    Object.entries(detailedBookings).forEach(([type, data]) => {
      if (data && data.length > 0) {
        wsData.push([`${type.charAt(0).toUpperCase() + type.slice(1)} Details`])

        const mapping = columnMapping[type]
        if (mapping) {
          const headers = Object.keys(mapping)
          wsData.push(headers)

          data.forEach((item) => {
            const row = headers.map((header) => mapping[header](item))
            wsData.push(row)
          })
        } else {
          // Fallback
          if (data.length > 0) {
            const headers = Object.keys(data[0])
            wsData.push(headers)
            data.forEach((item) => {
              wsData.push(headers.map((h) => item[h]))
            })
          }
        }
        wsData.push([]) // spacing
      }
    })
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths - make them wide enough to accommodate most data
  ws['!cols'] = [
    { wch: 25 }, // Col A
    { wch: 20 }, // Col B
    { wch: 20 }, // Col C
    { wch: 20 }, // Col D
    { wch: 20 }, // Col E
    { wch: 20 }, // Col F
    { wch: 20 }, // Col G
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Booking Report')

  // Generate and save
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileName = `Booking_Trends_Report_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`
  saveAs(blob, fileName)

  return fileName
}

/**
 * Generate and export booking trends report as DOCX
 */
export async function exportBookingTrendsReport(
  trendData,
  currentMonthCounts,
  detailedBookings = {},
) {
  const now = new Date()
  const reportTitle = `Booking Trends Report - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`

  // Calculate totals
  const currentTotal = Object.values(currentMonthCounts).reduce((sum, count) => sum + count, 0)

  // Create table rows for historical trends
  const trendTableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Month', bold: true, alignment: AlignmentType.CENTER })],
          shading: { fill: '4A5568' },
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Baptism', bold: true, alignment: AlignmentType.CENTER }),
          ],
          shading: { fill: '667eea' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Wedding', bold: true, alignment: AlignmentType.CENTER }),
          ],
          shading: { fill: 'f093fb' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Funeral', bold: true, alignment: AlignmentType.CENTER }),
          ],
          shading: { fill: '4facfe' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Thanksgiving', bold: true, alignment: AlignmentType.CENTER }),
          ],
          shading: { fill: '43e97b' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({ text: 'Others', bold: true, alignment: AlignmentType.CENTER }),
          ],
          shading: { fill: 'fa709a' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Total', bold: true, alignment: AlignmentType.CENTER })],
          shading: { fill: '2D3748' },
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    // Data rows
    ...trendData.map((monthData) => {
      const total =
        monthData.baptism +
        monthData.wedding +
        monthData.funeral +
        monthData.thanksgiving +
        monthData.others
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: monthData.month, alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [
              new Paragraph({ text: String(monthData.baptism), alignment: AlignmentType.CENTER }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ text: String(monthData.wedding), alignment: AlignmentType.CENTER }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ text: String(monthData.funeral), alignment: AlignmentType.CENTER }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(monthData.thanksgiving),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ text: String(monthData.others), alignment: AlignmentType.CENTER }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({ text: String(total), alignment: AlignmentType.CENTER, bold: true }),
            ],
          }),
        ],
      })
    }),
  ]

  // Calculate column totals
  const columnTotals = trendData.reduce(
    (acc, month) => {
      acc.baptism += month.baptism
      acc.wedding += month.wedding
      acc.funeral += month.funeral
      acc.thanksgiving += month.thanksgiving
      acc.others += month.others
      return acc
    },
    { baptism: 0, wedding: 0, funeral: 0, thanksgiving: 0, others: 0 },
  )

  const grandTotal =
    columnTotals.baptism +
    columnTotals.wedding +
    columnTotals.funeral +
    columnTotals.thanksgiving +
    columnTotals.others

  // Add totals row
  trendTableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'TOTAL', bold: true, alignment: AlignmentType.CENTER })],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(columnTotals.baptism),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(columnTotals.wedding),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(columnTotals.funeral),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(columnTotals.thanksgiving),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(columnTotals.others),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: String(grandTotal),
              bold: true,
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: 'E2E8F0' },
        }),
      ],
    }),
  )

  // Create current month summary table
  const currentMonthTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({ text: 'Booking Type', bold: true, alignment: AlignmentType.CENTER }),
            ],
            shading: { fill: '4A5568' },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({ text: 'Count', bold: true, alignment: AlignmentType.CENTER }),
            ],
            shading: { fill: '4A5568' },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Baptism', alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentMonthCounts.baptism),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Wedding', alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentMonthCounts.wedding),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Funeral', alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentMonthCounts.funeral),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Thanksgiving', alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentMonthCounts.thanksgiving),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Others', alignment: AlignmentType.LEFT })],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentMonthCounts.others),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Total', bold: true, alignment: AlignmentType.LEFT })],
            shading: { fill: 'E2E8F0' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: String(currentTotal),
                bold: true,
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { fill: 'E2E8F0' },
          }),
        ],
      }),
    ],
  })

  // Create trends table
  const trendsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: trendTableRows,
  })

  // Prepare detailed sections
  const detailedSections = []
  if (detailedBookings) {
    Object.entries(detailedBookings).forEach(([type, data]) => {
      if (data && data.length > 0 && columnMapping[type]) {
        detailedSections.push(
          new Paragraph({
            text: `${type.charAt(0).toUpperCase() + type.slice(1)} Details`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
        )

        // Get columns for this type
        const columns = columnMapping[type]
        const headers = Object.keys(columns)

        // Create header row
        const headerRow = new TableRow({
          children: headers.map(
            (header) =>
              new TableCell({
                children: [new Paragraph({ text: header, bold: true, size: 20 })],
                shading: { fill: 'E2E8F0' },
                width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
              }),
          ),
        })

        // Create data rows
        const dataRows = data.map(
          (item) =>
            new TableRow({
              children: headers.map(
                (header) =>
                  new TableCell({
                    children: [new Paragraph({ text: String(columns[header](item)), size: 20 })],
                    width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
                  }),
              ),
            }),
        )

        detailedSections.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        )
      }
    })
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: reportTitle,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Current Month Section
          new Paragraph({
            text: `Current Month Summary (${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),

          currentMonthTable,

          // Spacing
          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Historical Trends Section
          new Paragraph({
            text: 'Historical Booking Trends',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),

          trendsTable,

          // Detailed Sections
          ...detailedSections,

          // Footer
          new Paragraph({
            text: `Report generated on ${now.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
          }),
        ],
      },
    ],
  })

  // Generate and save the document
  const blob = await Packer.toBlob(doc)
  const fileName = `Booking_Trends_Report_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.docx`
  saveAs(blob, fileName)

  return fileName
}
