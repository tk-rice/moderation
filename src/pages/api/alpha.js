import { google } from 'googleapis';
import natural from 'natural';

const API_KEY = process.env.PERSPECTIVE_API_KEY;
const discoveryURL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const language = 'EN';
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
const lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
const ruleSet = new natural.RuleSet('EN');
const tokenizer = new natural.WordPunctTokenizer();
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

export default async function moderateHandler(req, res) {
  const { content } = req.body;
  const client = await google.discoverAPI(discoveryURL);

  const analyzeRequest = {
    comment: {
      text: content,
    },
    requestedAttributes: {
      TOXICITY: {},
    },
  };

  const response = await client.comments.analyze({
    key: API_KEY,
    resource: analyzeRequest,
  });

  // Identify non-functional words using natural
  const words = tokenizer.tokenize(content);
  const taggedWords = tagger.tag(words);
  const nonFunctionalTags = ['CC', 'DT', 'IN', 'TO', 'MD', 'PRP', '!', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/',
    ':', ';', '<', '=', '>', '?', '@', '[', ']', '^', '_', '`', '{', '|', '}',
    '~', `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`];
    
  const taggedArray = Object.values(taggedWords);

  // Filter out non-functional tags
  const filteredTaggedWords = taggedArray[0].filter((word) => !nonFunctionalTags.includes(word.tag));

  const taggedTokens = Object.values(filteredTaggedWords.map(({ token, tag }) => {
    return token
  }))

  const moderationResponse = {
    //LOWER TOX SCORE IS BETTER
    toxicityScore: response.data.attributeScores.TOXICITY.summaryScore.value,
    original: content,
    tagged: taggedTokens
  };

  res.status(200).json(moderationResponse);
}
