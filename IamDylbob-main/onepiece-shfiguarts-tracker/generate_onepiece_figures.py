import fal_client
import os
import time

# Your FAL API key (using the same key as Marvel tracker)
FAL_KEY = "abb7c061-3cd0-4ca1-a8b1-d385a8134220:5daa32dc073047d9760094777f5a8096"

# Configure FAL client
os.environ["FAL_KEY"] = FAL_KEY

# Output directory
OUTPUT_DIR = "images/figures"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# One Piece SH Figuarts figures to generate
figures = [
    {
        "id": 1,
        "name": "jewelry-bonney-egghead",
        "prompt": "One Piece SH Figuarts Jewelry Bonney Future Island Egghead action figure, pink hair, blue and white futuristic outfit, food accessories, multiple expressions, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 2,
        "name": "usopp-romance-dawn",
        "prompt": "One Piece SH Figuarts Usopp Romance Dawn action figure, slingshot weapon, goggles, ammunition bag, Kabuto, overalls and bandana, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 3,
        "name": "chopper-egghead",
        "prompt": "One Piece SH Figuarts Tony Tony Chopper Future Island Egghead action figure, reindeer doctor, medical bag, futuristic outfit, multiple transformation forms, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 4,
        "name": "luffy-egghead",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Future Island Egghead action figure, straw hat, futuristic island outfit, Gear 5 parts, red vest, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 5,
        "name": "blackbeard-four-emperors",
        "prompt": "One Piece SH Figuarts Marshall D. Teach Blackbeard Four Emperors action figure, black beard, dark coat, Dark Dark Fruit effects, emperor cloak, multiple expressions, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 6,
        "name": "luffy-romance-dawn",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Romance Dawn action figure, iconic straw hat, red vest, blue shorts, Gomu Gomu effects, multiple hands, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 7,
        "name": "zoro-romance-dawn",
        "prompt": "One Piece SH Figuarts Roronoa Zoro Romance Dawn action figure, three swords (Wado Ichimonji, Sandai Kitetsu, Yubashiri), green bandana, sword poses, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 8,
        "name": "nami-romance-dawn",
        "prompt": "One Piece SH Figuarts Nami Romance Dawn action figure, orange hair, Clima-Tact weather staff, weather effects, map accessories, navigation tools, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 9,
        "name": "sanji-romance-dawn",
        "prompt": "One Piece SH Figuarts Sanji Romance Dawn action figure, blonde hair, black suit, cigarette, flame effects, cooking utensils, kicked pose, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 10,
        "name": "robin-romance-dawn",
        "prompt": "One Piece SH Figuarts Nico Robin Romance Dawn action figure, black hair, purple outfit, Hana Hana no Mi effects, books, multiple hands, archaeologist, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 11,
        "name": "brook-romance-dawn",
        "prompt": "One Piece SH Figuarts Brook Romance Dawn action figure, skeleton musician, Soul Solid sword, violin, afro hair, top hat, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 12,
        "name": "franky-romance-dawn",
        "prompt": "One Piece SH Figuarts Franky Romance Dawn action figure, cyborg shipwright, blue hair, Coup de Vent effects, cola bottle, sunglasses, muscular build, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 13,
        "name": "jinbe-romance-dawn",
        "prompt": "One Piece SH Figuarts Jinbe Romance Dawn action figure, fish-man, blue skin, kimono, Fish-Man Karate effects, water splash effects, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 14,
        "name": "ace-marineford",
        "prompt": "One Piece SH Figuarts Portgas D. Ace action figure, fire fist, orange hat, freckles, flame effects, fire powers, shirtless with shorts, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 15,
        "name": "shanks-four-emperors",
        "prompt": "One Piece SH Figuarts Red-Haired Shanks Four Emperors action figure, red hair, Gryphon sword, emperor cloak, sake bottle, missing left arm, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 16,
        "name": "whitebeard-four-emperors",
        "prompt": "One Piece SH Figuarts Edward Newgate Whitebeard Four Emperors action figure, massive build, white mustache, Murakumogiri naginata, quake effects, emperor coat, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 17,
        "name": "kaido-wano",
        "prompt": "One Piece SH Figuarts Kaidou King of the Beasts Wano action figure, massive build, horns, Kanabo club, flame effects, dragon transformation parts, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 18,
        "name": "yamato-wano",
        "prompt": "One Piece SH Figuarts Yamato Wano action figure, white hair with horns, Takeru kanabo, ice effects, Oden's journal, oni mask, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 19,
        "name": "law-supernovas",
        "prompt": "One Piece SH Figuarts Trafalgar Law Supernovas action figure, Kikoku sword, spotted hat, Room effects, surgeon outfit, tattoos, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 20,
        "name": "kid-supernovas",
        "prompt": "One Piece SH Figuarts Eustass Kid Supernovas action figure, red hair, magnetic metal arm, metal effects, goggles, punk rock style, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 21,
        "name": "mihawk-shichibukai",
        "prompt": "One Piece SH Figuarts Dracule Mihawk Shichibukai action figure, Yoru black blade, cross necklace, long coat, mustache, world's greatest swordsman, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 22,
        "name": "hancock-shichibukai",
        "prompt": "One Piece SH Figuarts Boa Hancock Shichibukai action figure, Love-Love Beam effects, Salome snake, empress dress, long black hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 23,
        "name": "crocodile-shichibukai",
        "prompt": "One Piece SH Figuarts Crocodile Shichibukai action figure, sand effects, cigar, hook hand, baroque coat, slicked back hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 24,
        "name": "doflamingo-shichibukai",
        "prompt": "One Piece SH Figuarts Donquixote Doflamingo Shichibukai action figure, string effects, sunglasses, pink feather coat, blonde hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 25,
        "name": "sabo-revolutionary",
        "prompt": "One Piece SH Figuarts Sabo Revolutionary Army action figure, Dragon Claw effects, pipe weapon, top hat, flame powers, blonde hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 26,
        "name": "luffy-gear5",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Gear 5 action figure, white hair transformation, Nika effects, liberation pose, rubber powers, laughing expression, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 27,
        "name": "luffy-gear4-boundman",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Gear 4 Boundman action figure, inflated muscular form, haki steam, bounce effects, red vest, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 28,
        "name": "luffy-gear4-snakeman",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Gear 4 Snakeman action figure, streamlined form, python culverin arms, speed lines, haki effects, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 29,
        "name": "katakuri-wholecake",
        "prompt": "One Piece SH Figuarts Charlotte Katakuri Whole Cake Island action figure, massive build, mochi effects, trident, scarf covering mouth, future sight pose, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 30,
        "name": "bigmom-four-emperors",
        "prompt": "One Piece SH Figuarts Big Mom Charlotte Linlin Four Emperors action figure, massive build, Napoleon sword, Zeus cloud, Prometheus sun, soul powers, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 31,
        "name": "oden-wano",
        "prompt": "One Piece SH Figuarts Kozuki Oden Wano action figure, samurai, Ame no Habakiri and Enma swords, legendary pose, topknot hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 32,
        "name": "marco-marineford",
        "prompt": "One Piece SH Figuarts Marco the Phoenix Marineford action figure, phoenix flames, blue fire effects, regeneration wings, pineapple hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 33,
        "name": "buggy-eastblue",
        "prompt": "One Piece SH Figuarts Buggy the Clown East Blue action figure, detachable parts, throwing knives, red clown nose, captain hat, blue hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 34,
        "name": "hawkins-supernovas",
        "prompt": "One Piece SH Figuarts Basil Hawkins Supernovas action figure, straw voodoo dolls, tarot cards, cursed sword, blonde hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 35,
        "name": "carrot-sulong",
        "prompt": "One Piece SH Figuarts Carrot Sulong Form Whole Cake Island action figure, white fur transformation, electro effects, moon gaze pose, rabbit mink, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 36,
        "name": "shanks-luffy-childhood",
        "prompt": "One Piece SH Figuarts Shanks and Monkey D. Luffy childhood Special Edition action figure set, straw hat passing scene, childhood Luffy figure, mentor moment base, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 37,
        "name": "luffy-netflix",
        "prompt": "One Piece SH Figuarts Monkey D. Luffy Netflix Live Action action figure, realistic straw hat, Netflix series costume, live-action design, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 38,
        "name": "zoro-netflix",
        "prompt": "One Piece SH Figuarts Roronoa Zoro Netflix Live Action action figure, three sword style, Netflix series outfit, realistic design, green hair, product photography, white background, studio lighting, high detail, Bandai figure"
    },
    {
        "id": 39,
        "name": "nami-netflix",
        "prompt": "One Piece SH Figuarts Nami Netflix Live Action action figure, Climate Tact staff, Netflix series costume, realistic design, orange hair, map accessories, product photography, white background, studio lighting, high detail, Bandai figure"
    }
]

def generate_figure(figure):
    """Generate a single figure image using FAL API"""
    try:
        print(f"Generating {figure['name']}...")
        
        handler = fal_client.submit(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": figure["prompt"],
                "image_size": "square",
                "num_inference_steps": 4,
                "num_images": 1,
                "enable_safety_checker": False
            }
        )
        
        result = handler.get()
        
        if result and "images" in result and len(result["images"]) > 0:
            image_url = result["images"][0]["url"]
            
            # Download the image
            import requests
            response = requests.get(image_url)
            
            # Save the image
            output_path = os.path.join(OUTPUT_DIR, f"{figure['name']}.jpg")
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"[SUCCESS] Saved {figure['name']}.jpg")
            return image_url
        else:
            print(f"[FAILED] Failed to generate {figure['name']}")
            return None
            
    except Exception as e:
        print(f"[ERROR] Error generating {figure['name']}: {e}")
        return None

def main():
    print("=" * 60)
    print("ONE PIECE SH FIGUARTS FIGURE IMAGE GENERATOR")
    print("=" * 60)
    print(f"Generating {len(figures)} One Piece action figure images...")
    print()
    
    successful = 0
    failed = []
    generated_urls = {}
    
    for i, figure in enumerate(figures, 1):
        print(f"[{i}/{len(figures)}] ", end="")
        image_url = generate_figure(figure)
        if image_url:
            successful += 1
            generated_urls[figure['id']] = image_url
        else:
            failed.append(figure['name'])
        
        # Small delay to avoid rate limiting
        if i < len(figures):
            time.sleep(2)
    
    print()
    print("=" * 60)
    print(f"Generation complete!")
    print(f"[SUCCESS] Successfully generated: {successful}/{len(figures)}")
    
    if failed:
        print(f"[FAILED] Failed figures: {', '.join(failed)}")
        print("You can run the script again to retry failed images.")
    
    print(f"\nImages saved to: {os.path.abspath(OUTPUT_DIR)}")
    
    # Save generated URLs to a file for updating the fetchFigures.js
    import json
    with open('generated_urls.json', 'w') as f:
        json.dump(generated_urls, f, indent=2)
    
    print(f"Generated URLs saved to: generated_urls.json")

if __name__ == "__main__":
    main()