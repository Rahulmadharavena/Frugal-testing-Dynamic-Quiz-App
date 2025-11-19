# selenium_quiz_test.py - uses webdriver-manager to avoid manual chromedriver download
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time, sys, os

url = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8000/index.php'
# setup driver
options = webdriver.ChromeOptions()
options.add_argument('--start-maximized')
# options.add_argument('--headless')  # comment out to record video
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
wait = WebDriverWait(driver, 10)

try:
    driver.get(url)
    print('Page title:', driver.title)
    # Verify landing
    print('URL:', driver.current_url)
    # Start quiz
    start = wait.until(EC.element_to_be_clickable((By.ID, 'start-quiz-btn')))
    start.click()
    time.sleep(1)
    total = int(driver.find_element(By.ID, 'total').text)
    for i in range(total):
        q_text = wait.until(EC.visibility_of_element_located((By.ID, 'question-text'))).text
        print(f'Question {i+1}:', q_text)
        opts = driver.find_elements(By.CSS_SELECTOR, '.option-btn')
        # select third option if exists else first (index 2 corresponds to option "3")
        index_to_click = 2 if len(opts) > 2 else 0
        opts[index_to_click].click()
        driver.save_screenshot(f'automation_step_{i+1}.png')
        if i < total-1:
            driver.find_element(By.ID, 'next-btn').click()
            time.sleep(1)
    # Submit and verify results
    driver.find_element(By.ID, 'submit-quiz-btn').click()
    score = wait.until(EC.visibility_of_element_located((By.ID, 'score-summary'))).text
    print('Score summary:', score)
    driver.save_screenshot('result.png')
    # Save logs
    with open('selenium_run_log.txt', 'w') as f:
        f.write('Run completed. URL: ' + driver.current_url + '\n' + 'Score: ' + score + '\n')
finally:
    driver.quit()
