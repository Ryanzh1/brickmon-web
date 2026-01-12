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
    print(f"SUPABASE_URL: {'Set' if url else 'Missing'}")
    print(f"SUPABASE_KEY: {'Set' if key else 'Missing'}")
    exit(1)

try:
    supabase: Client = create_client(url, key)
    print(f"✓ Connected to Supabase: {url[:30]}...")
except Exception as e:
    print(f"Error creating Supabase client: {e}")
    exit(1)

async def check_stock(page, product):
    retailer = product.get('retailer', 'Unknown')
    print(f"Checking {product['name']} at {retailer}...")
    
    # Skip products without buy_url
    if not product.get('buy_url'):
        print(f"  ⚠️  Skipping {product['name']} - no buy_url provided")
        return None
    
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
    try:
        response = supabase.table("products").select("*").execute()
        products = response.data
        
        if not products:
            print("No products found in database.")
            return
        
        print(f"Found {len(products)} products to check")
    except Exception as e:
        print(f"Error fetching products from Supabase: {e}")
        print(f"Supabase URL: {url[:20]}..." if url else "No URL")
        return

    # 2. Launch Browser (Headless)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a real user agent so we don't get blocked
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        page = await context.new_page()

        # 3. Loop through products
        for product in products:
            # Skip products without buy_url (can't check stock without a URL)
            if not product.get('buy_url'):
                print(f"Skipping {product.get('name', 'Unknown')} - no buy_url")
                continue
                
            new_status = await check_stock(page, product)
            
            # 4. Update Database if status changed
            if new_status:
                try:
                    if new_status != product.get('status'):
                        print(f"*** UPDATE: {product['name']} changed from {product.get('status')} to {new_status} ***")
                        supabase.table("products").update({
                            "status": new_status
                        }).eq("id", product['id']).execute()
                    else:
                        print(f"✓ {product['name']} - status unchanged ({new_status})")
                except Exception as e:
                    print(f"Error updating {product['name']}: {e}")

        await browser.close()
    print("--- Scraper Finished ---")

if __name__ == "__main__":
    asyncio.run(main())