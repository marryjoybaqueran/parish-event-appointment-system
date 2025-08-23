<script setup>
import { ref } from 'vue'

// Key para sa localStorage
const LOCAL_PDF_KEY = 'wedding_selected_pdf'

// Track selected PDF title (show previous selection if available)
const selectedPdf = ref(
  typeof window !== 'undefined' ? window.localStorage.getItem(LOCAL_PDF_KEY) || '' : ''
)

// PDF download functions; also save selected PDF title to localStorage
const downloadPDF = (pdfName, pdfTitle) => {
  // Save the chosen PDF title so it can be included in the payload later
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_PDF_KEY, pdfTitle || pdfName)
    }
    selectedPdf.value = pdfTitle || pdfName
  } catch (e) {
    // ignore localStorage errors (private mode, quota, etc.)
    console.warn('Could not save selected PDF to localStorage', e)
  }

  const link = document.createElement('a')
  link.href = `/pdf/${pdfName}`
  link.download = pdfName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Available PDFs para sa wedding
const weddingPDFs = [
  { 
    name: 'Marriage Interview', 
    filename: 'marriage_interview.pdf', 
    description: 'Interview form para sa mag-asawa' 
  },
  { 
    name: 'Marriage Banns', 
    filename: 'marriage_banns.pdf', 
    description: 'Banns announcement form' 
  },
  { 
    name: 'Jurisdiction for Marriage', 
    filename: 'jurisdiction_for_marriage.pdf', 
    description: 'Jurisdiction requirements' 
  }
]
</script>

<template>
  <v-card class="pa-6 mb-4" rounded="lg" elevation="2">
    <v-card-title class="text-h5 text-primary mb-4">
      <v-icon start>mdi-file-download</v-icon>
      Step 2: Download Required Documents
    </v-card-title>

    <v-card-text>
      <v-alert type="info" variant="outlined" class="mb-4">
        <v-icon start>mdi-information</v-icon>
        Please download and fill out the required forms. Upload the completed forms in the next step.
      </v-alert>
    </v-card-text>
  </v-card>

  <!-- PDF list moved below the card so users see the download buttons directly -->
  <v-list>
    <v-list-item
      v-for="pdf in weddingPDFs"
      :key="pdf.filename"
      class="mb-2"
      link
  @click="downloadPDF(pdf.filename, pdf.name)"
    >
      <template #prepend>
        <v-avatar color="primary" variant="outlined">
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        {{ pdf.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ pdf.description }}
      </v-list-item-subtitle>

  <!-- download happens when user touches/clicks the list item -->
    </v-list-item>
  </v-list>

  <!-- show currently selected pdf title -->
  <div v-if="selectedPdf" class="mt-3">
    <v-chip color="primary" variant="tonal" class="ma-0">
      Selected document: {{ selectedPdf }}
    </v-chip>
  </div>
</template>

<style scoped>
.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments para sa mobile */
@media (max-width: 600px) {
  .v-card {
    margin: 0 !important;
  }
  
  .v-list-item-title {
    font-size: 0.9rem;
  }
  
  .v-list-item-subtitle {
    font-size: 0.8rem;
  }
}
</style>
