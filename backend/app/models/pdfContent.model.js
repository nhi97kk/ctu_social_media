const mongoose = require('mongoose');

const pdfContentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    content: { type: String }, // Nội dung đoạn
  },
  { timestamps: true },
);

module.exports = mongoose.model('PdfContent', pdfContentSchema);
