import os
import asyncio
from supabase import create_client, Client
from playwright.async_api import async_playwright
from dotenv import load_dotenv

# Load environment variables (for local testing)
load_dotenv()

# Connect to Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase: Client = create_client(url, key)

async def check_stock(page, product):
    print(f"Checking {product['name']} at {product['retailer']}...")
    
    try:
        # Go to the product page
        await page.goto(product['buy_url'], timeout=30000)
        await page.wait_for_load_state("domcontentloaded")
        
        # Get page text to search for keywords
        content = await page.content()
        content_lower = content.lower()
        
        status = "OUT_OF_STOCK" # Default to OOS
        
        # --- LOGIC PER RETAILER ---
        if "lego.com" in product['buy_url']:
            if "add to bag" in content_lower:
                status = "IN_STOCK"
            elif "backorder" in content_lower:
                status = "IN_STOCK" # Treat backorder as buyable
            elif "coming soon" in content_lower:
                status = "COMING_SOON"
                
        elif "amazon" in product['buy_url']:
            if "add to cart" in content_lower and "currently unavailable" not in content_lower:
                status = "IN_STOCK"
                
        elif "target" in product['buy_url']:
            if "ship it" in content_lower or "add to cart" in content_lower:
                status = "IN_STOCK"
        
        # Use generic fallback if specific retailer logic fails but "add to cart" is visible
        elif "add to cart" in content_lower or "add to bag" in content_lower:
            status = "IN_STOCK"

        print(f"--> Status found: {status}")
        return status

    except Exception as e:
        print(f"Error checking {product['name']}: {e}")
        return None

async def main():
    print("--- Starting BrickMon Scraper ---")
    
    # 1. Fetch all products from Supabase
    response = supabase.table("products").select("*").execute()
    products = response.data
    
    if not products:
        print("No products found in database.")
        return

    # 2. Launch Browser (Headless)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a real user agent so we don't get blocked
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        page = await context.new_page()

        # 3. Loop through products
        for product in products:
            new_status = await check_stock(page, product)
            
            # 4. Update Database if status changed
            if new_status and new_status != product['status']:
                print(f"*** UPDATE: {product['name']} changed from {product['status']} to {new_status} ***")
                supabase.table("products").update({
                    "status": new_status, 
                    "last_checked": "now()"
                }).eq("id", product['id']).execute()
            else:
                # Still update 'last_checked' timestamp even if status is same
                supabase.table("products").update({"last_checked": "now()"}).eq("id", product['id']).execute()

        await browser.close()
    print("--- Scraper Finished ---")

if __name__ == "__main__":
    asyncio.run(main())