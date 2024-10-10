import spacy

# Load the trained model
nlp = spacy.load("./model-best")

# Example text for prediction
text = "Sugatan ang anim na kabataan na sakay ng AUV."

# Process the text with the NER model
doc = nlp(text)

# Extract entities from the processed document
for ent in doc.ents:
    print(ent.text, ent.label_, ent.start_char, ent.end_char)

