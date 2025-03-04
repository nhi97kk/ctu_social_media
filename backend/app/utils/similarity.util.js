const natural = require('natural');

exports.cosineSimilarity = (text1, text2) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens1 = tokenizer.tokenize(text1.toLowerCase());
  const tokens2 = tokenizer.tokenize(text2.toLowerCase());

  const tfidf = new natural.TfIdf();
  tfidf.addDocument(tokens1);
  tfidf.addDocument(tokens2);

  const vector1 = tfidf.documents[0];
  const vector2 = tfidf.documents[1];

  const dotProduct = Object.keys(vector1).reduce(
    (sum, key) => sum + (vector1[key] || 0) * (vector2[key] || 0),
    0,
  );

  const magnitude1 = Math.sqrt(
    Object.values(vector1).reduce((sum, val) => sum + val * val, 0),
  );
  const magnitude2 = Math.sqrt(
    Object.values(vector2).reduce((sum, val) => sum + val * val, 0),
  );

  return dotProduct / (magnitude1 * magnitude2 || 1);
};
