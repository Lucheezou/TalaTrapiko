import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from tqdm import tqdm
import os
import json
import time

def scrape_article(url):
    # Send a GET request to the URL
    chrome_options = Options()
    # Run Chrome in headless mode (without GUI)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--ignore-ssl-errors")
    
    request = requests.get(url)

    #driver = webdriver.Chrome(chrome_options)
    #driver.get(request)

   

    #page_source = driver.page_source

    # Create a BeautifulSoup object to parse the HTML content
    soup = BeautifulSoup(request, 'html.parser')

    print(soup)

    # Find the article title
    title = soup.find('div', class_='css-bz0a2f').text.strip()
    source = soup.find('div', class_='css-vldcmf').text.strip()
    published = soup.find('div', class_='css-37gmgr').text.strip()

    # Find the article body
    article_body_elements = soup.find_all('div', class_='fr-view')

    # Extract the text content from the article body
    article_text = ""
    for p in article_body_elements:
        
        for div in p.find_all('div', class_=' ivs-overlay-infobar'):
            div.decompose()
        for div in p.find_all('div', class_='iwantbar'):
            div.decompose()
        for strong in p.find_all('strong'):
            strong.decompose()
        for a in p.find_all('a'):
            a.decompose()
        article_text += p.get_text(strip=True) + "\n\n"
    article_text = article_text.strip()

    #driver.quit()

    return title, source, article_text, published

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        for item in data:
            title, source, article, published = item
            file.write(f"\n{title}\n\n")
            file.write(f"{source}\n\n")
            file.write(f"{published}\n\n")
            file.write(f"{article}\n\n")
            file.write("---")

def save_checkpoint(scraped_data, processed_urls, failed_urls):
    checkpoint_data = {
        'scraped_data': scraped_data,
        'processed_urls': processed_urls,
        'failed_urls': failed_urls
    }
    with open('checkpointa.json', 'w') as checkpoint_file:
        json.dump(checkpoint_data, checkpoint_file)

def load_checkpoint():
    if os.path.exists('checkpointa.json'):
        with open('checkpointa.json', 'r') as checkpoint_file:
            checkpoint_data = json.load(checkpoint_file)
            return checkpoint_data['scraped_data'], checkpoint_data['processed_urls'], checkpoint_data['failed_urls']
    return [], [], []

# Example usage
urls = [
    'https://bicol-u.edu.ph'
]

scraped_data, processed_urls, failed_urls = load_checkpoint()

for url in tqdm(urls, desc="Scraping"):
    if url not in processed_urls:
        try:
            data = scrape_article(url)
            scraped_data.append(data)
            processed_urls.append(url)
            save_checkpoint(scraped_data, processed_urls, failed_urls)
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            failed_urls.append(url)
            save_checkpoint(scraped_data, processed_urls, failed_urls)

# Retry scraping failed URLs
max_retries = 3
retry_delay = 5  # Delay in seconds between retries

for url in failed_urls:
    for retry in range(max_retries):
        try:
            data = scrape_article(url)
            scraped_data.append(data)
            processed_urls.append(url)
            failed_urls.remove(url)
            save_checkpoint(scraped_data, processed_urls, failed_urls)
            print(f"Successfully scraped {url} after {retry + 1} retry(ies)")
            break
        except Exception as e:
            print(f"Error scraping {url} (Retry {retry + 1}): {e}")
            time.sleep(retry_delay)

save_to_file(scraped_data, 'scraped_articles_abs.txt')
print("Scraping done!")