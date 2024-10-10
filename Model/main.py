from fastapi import FastAPI
from pydantic import BaseModel
from spacy import displacy
from fastapi.middleware.cors import CORSMiddleware
import spacy
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

origins = [
    "*"
]


nlp = spacy.load('./model-best')


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

class ScrapeRequest(BaseModel):
    urls: list[str]

def scrape_article(url):
    # Send a GET request to the URL
    chrome_options = Options()
    # Run Chrome in headless mode (without GUI)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--ignore-ssl-errors")
    
    driver = webdriver.Chrome(chrome_options)
    driver.get(url)
    page_source = driver.page_source

    try:

        soup = BeautifulSoup(page_source, 'html.parser')

        # Find the article title
        if "news.abs-cbn.com" in url: 
            title = soup.find('div', class_='css-bz0a2f').text.strip()
            source = soup.find('div', class_='css-vldcmf').text.strip()
            published = soup.find('div', class_='css-37gmgr').text.strip()

            # Find the article body
            article_body_elements = soup.find_all('div', class_='fr-view')

            # Extract the text content from the article body
            article_text = ""
            for p in article_body_elements:
                # Remove <strong> and <a> elements from each <p> element
                for div in p.find_all('ivs-player'):
                    div.decompose()
                for div in p.find_all('div', class_='iwantbar'):
                    div.decompose()
                for strong in p.find_all('strong'):
                    strong.decompose()
                for a in p.find_all('a'):
                    a.decompose()
                article_text += p.get_text(strip=True) + "\n\n"
            article_text = article_text.strip()
            return title, source, article_text, published
        
        if "www.gmanetwork.com" in url:
            title = soup.find('h1').text.strip()
            source = soup.find('div', class_='article-date')
            
            if source:
                source = source.text.strip()
            else:
                source = soup.find('div', class_='article-time').text.strip()
            
            published = soup.find('div', class_='article-author')
            
            if published:
                published = published.text.strip()
            else:
                published = ""
            
            article_body_elements = soup.find('div', class_='article-body')
            
            if article_body_elements:
                article_body_elements = article_body_elements
            else:
                article_body_elements = soup.find('div', class_='story_main')
                

            article_text = ""
            for p in article_body_elements.find_all('p'):
                for strong in p.find_all('strong'):
                    strong.decompose()
                for a in p.find_all('a'):
                    a.decompose()
                for span in p.find_all('span'):
                    span.decompose()
                            
                article_text += p.get_text(strip=True) + "\n\n"
                        
            article_text = article_text.strip()


        
            return title, source, article_text, published
        
        if "www.philstar.com" in url:
            title = soup.find('h1').text.strip()
            source = soup.find('div', class_='article__credits-author-pub').text.strip()
            published = soup.find('div', class_='article__date-published').text.strip()

            article_body_elements = soup.find('div', class_='article__writeup')

            article_text = ""
            for p in article_body_elements.find_all('p'):
                for strong in p.find_all('strong'):
                    strong.decompose()
                for a in p.find_all('a'):
                    a.decompose()
                for span in p.find_all('span'):
                    span.decompose()
                article_text += p.get_text(strip=True) + "\n\n"

            article_text = article_text.strip()

            return title, source, article_text, published

    finally:
        driver.quit()

    

@app.post("/ner")
async def process_text(text: TextInput):

    list = []
    
    colors = {'PER': "#FFCCCC", "LOC": "#FFD699", "DATE": " #FFFFCC", "TIME": "#99FF99","VEH": "#CCCCFF","INJ": "#E6CCFF", "INJCOUNT": "#FFEBEB", "DAY": "#CCFFFF", "ACC": "#CCFFCC", "CAUSE": "#FFCCFF", "GEND": "#B2B2CC", "AGE": "#F0F0FF"}
    options = {"ents": ['PER', 'LOC', 'DATE', 'TIME', 'VEH', 'INJ', 'INJCOUNT', 'DAY', 'ACC', 'CAUSE', 'GEND', 'AGE'], "colors": colors}

    class ner:
        def __init__(self, ent, label):
         self.ent = ent
         self.label = label

    doc = nlp(text.text)
    html = displacy.render(doc, style="ent", options=options)
    for ent in doc.ents:
        list.append(ner(ent.text, ent.label_))
        print(ent.text, ent.label_)
    print(list)
   

    return {"ents": list,
            "html": html}

@app.post("/scrape")
async def scrape_articles(request: ScrapeRequest):
    urls = request.urls
    scraped_data = []

    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(scrape_article, url) for url in urls]
        with tqdm(total=len(urls), desc="Scraping progress") as pbar:
            for future in as_completed(futures):
                result = future.result()
                scraped_data.append(result)
                pbar.update(1)

    # Format the scraped data as a string
    formatted_data = ""
    for item in scraped_data:
        title, source, article, published = item
        formatted_data += f"{title}\n\n"
        formatted_data += f"{source}\n\n"
        formatted_data += f"{published}\n\n"
        formatted_data += f"{article}\n\n"
        formatted_data += "---\n\n"
    
    print(formatted_data)
    return formatted_data