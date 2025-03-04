const natural = require('natural');
const tfidf = new natural.TfIdf();
const PdfContent = require('../models/pdfContent.model');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upload PDF và lưu nội dung
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No file uploaded' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path); // Đọc file PDF
    const pdfData = await pdfParse(pdfBuffer); // Trích xuất nội dung PDF

    await PdfContent.deleteMany({});

    // Lưu nội dung PDF vào MongoDB
    const pdfContent = await PdfContent.create({
      filename: req.file.originalname, // Tên file
      content: pdfData.text, // Toàn bộ nội dung văn bản
    });

    fs.unlinkSync(req.file.path); // Xóa file sau khi xử lý

    res.status(200).json({
      status: 'success',
      data: pdfContent,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Hàm tính cosine similarity
function cosineSimilarity(text1, text2) {
  const tokenizer = new natural.WordTokenizer();

  // Tokenize và tính TF-IDF
  const tokens1 = tokenizer.tokenize(text1.toLowerCase());
  const tokens2 = tokenizer.tokenize(text2.toLowerCase());

  const tfidf = new natural.TfIdf();
  tfidf.addDocument(tokens1.join(' '));
  tfidf.addDocument(tokens2.join(' '));

  // Lấy vector trọng số TF-IDF
  const vector1 = getTfidfVector(tfidf, 0); // Vector cho tài liệu 1
  const vector2 = getTfidfVector(tfidf, 1); // Vector cho tài liệu 2

  // Tính cosine similarity
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(
    vector1.reduce((sum, val) => sum + val * val, 0),
  );
  const magnitude2 = Math.sqrt(
    vector2.reduce((sum, val) => sum + val * val, 0),
  );

  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

// Hàm tạo vector TF-IDF từ tài liệu
function getTfidfVector(tfidf, docIndex) {
  const terms = tfidf.listTerms(docIndex); // Lấy danh sách từ và trọng số TF-IDF
  const vector = [];

  // Duyệt qua danh sách từ và lưu trọng số vào vector
  terms.forEach(term => {
    vector.push(term.tfidf);
  });

  return vector;
}

// Xử lý câu hỏi
exports.handleQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No question provided' });
    }

    // Lấy nội dung PDF từ DB
    const pdfContent = await PdfContent.findOne();
    if (!pdfContent) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'No PDF content found' });
    }

    // Tách nội dung PDF thành các đoạn nhỏ (ví dụ: tách theo dấu chấm hoặc xuống dòng)
    const paragraphs = pdfContent.content
      .split(/\n|\.\s/)
      .filter(p => p.trim());

    // Tính cosine similarity giữa câu hỏi và từng đoạn
    const similarities = paragraphs.map(paragraph => ({
      paragraph,
      similarity: cosineSimilarity(paragraph, question),
    }));

    // Tìm đoạn có độ tương đồng cao nhất
    const bestMatch = similarities.reduce((max, curr) =>
      curr.similarity > max.similarity ? curr : max,
    );

    const prompt = `
Đây là một đoạn trích từ tài liệu:
"${bestMatch.paragraph}"

Người dùng có câu hỏi sau:
"${question}"

Hãy trả lời câu hỏi trên một cách chính xác và phù hợp, sử dụng thông tin từ đoạn trích trên. Lưu ý, vui lòng trả lời bằng tiếng Việt.
    `;

    // Gọi OpenAI API để lấy câu trả lời cho câu hỏi
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Sử dụng GPT-3.5 hoặc GPT-4 nếu cần
      messages: [
        {
          role: 'system',
          content:
            'Bạn là một trợ lý AI thông minh giúp giải đáp các câu hỏi liên quan đến nội quy học vụ trường Đại học Cần Thơ.',
        },
        {
          role: 'user',
          content: question, // Câu hỏi của người dùng
        },
      ],
    });

    // Lấy câu trả lời từ API
    const answer = response.choices[0].message.content;

    res.status(200).json({
      status: 'success',
      data: {
        answer,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all PDFs
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfContents = await PdfContent.find();
    res.status(200).json({ status: 'success', data: pdfContents[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

//update
exports.updateContent = async (req, res) => {
  try {
    const pdfContent = await PdfContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json({ status: 'success', data: pdfContent });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
