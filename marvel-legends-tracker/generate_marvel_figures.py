import fal_client
import os
import time

# Your FAL API key
FAL_KEY = "abb7c061-3cd0-4ca1-a8b1-d385a8134220:5daa32dc073047d9760094777f5a8096"

# Configure FAL client
os.environ["FAL_KEY"] = FAL_KEY

# Output directory
OUTPUT_DIR = "images/figures"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Marvel Legends figures to generate
figures = [
    {
        "name": "spider-man-classic",
        "prompt": "Marvel Legends Spider-Man action figure, classic red and blue costume with black web pattern, 6-inch scale figure, dynamic pose, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "miles-morales",
        "prompt": "Marvel Legends Miles Morales Spider-Man action figure, black suit with red accents, Spider-Verse style, 6-inch scale figure, dynamic pose, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "spider-gwen",
        "prompt": "Marvel Legends Spider-Gwen action figure, white costume with pink and black web pattern, hood up, 6-inch scale figure, dynamic pose, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "symbiote-spider-man",
        "prompt": "Marvel Legends Symbiote Spider-Man action figure, all black costume with white spider symbol, muscular build, 6-inch scale figure, dynamic pose, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "scarlet-spider",
        "prompt": "Marvel Legends Scarlet Spider Ben Reilly action figure, red bodysuit with blue sleeveless hoodie, 6-inch scale figure, dynamic pose, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "wolverine-yellow-blue",
        "prompt": "Marvel Legends Wolverine action figure, classic yellow and blue X-Men costume, adamantium claws extended, muscular build, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "cyclops-jim-lee",
        "prompt": "Marvel Legends Cyclops action figure, Jim Lee 90s design, blue bodysuit with yellow chest straps and belt, red visor, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "storm-mohawk",
        "prompt": "Marvel Legends Storm action figure, mohawk hairstyle, black leather outfit with cape, lightning effects, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "rogue-90s",
        "prompt": "Marvel Legends Rogue action figure, 90s animated series design, green and yellow bodysuit, brown jacket, white hair streak, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "gambit",
        "prompt": "Marvel Legends Gambit action figure, purple armor with brown trench coat, holding playing cards, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "magneto-classic",
        "prompt": "Marvel Legends Magneto action figure, classic red and purple costume with cape and helmet, magnetic effects, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "beast",
        "prompt": "Marvel Legends Beast action figure, blue fur, muscular build, wearing black and yellow X-Men uniform, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "iron-man-mark-85",
        "prompt": "Marvel Legends Iron Man Mark 85 action figure, Avengers Endgame armor, metallic red and gold, arc reactor glowing, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "captain-america-endgame",
        "prompt": "Marvel Legends Captain America action figure, Avengers Endgame costume, dark blue tactical suit with star emblem, holding shield, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "thor-love-thunder",
        "prompt": "Marvel Legends Thor action figure, Love and Thunder armor design, red cape, holding Stormbreaker, long blonde hair, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "mighty-thor",
        "prompt": "Marvel Legends Mighty Thor Jane Foster action figure, silver armor with red cape, holding Mjolnir, blonde hair, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "black-panther-wakanda",
        "prompt": "Marvel Legends Black Panther action figure, Wakanda Forever suit, black vibranium armor with silver details, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "shuri-black-panther",
        "prompt": "Marvel Legends Shuri Black Panther action figure, purple and black suit with gold accents, sleek design, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "star-lord",
        "prompt": "Marvel Legends Star-Lord action figure, red leather jacket, dual blasters, jet boots, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "groot-rocket",
        "prompt": "Marvel Legends Groot and Rocket 2-pack action figures, Baby Groot on shoulder of Rocket Raccoon in blue uniform, 6-inch scale figures, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "ant-man-quantumania",
        "prompt": "Marvel Legends Ant-Man action figure, Quantumania suit design, red and black with silver details, helmet with ant antennae, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "mr-fantastic",
        "prompt": "Marvel Legends Mr. Fantastic action figure, blue Fantastic Four uniform with number 4 logo, stretching arm pose, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "invisible-woman",
        "prompt": "Marvel Legends Invisible Woman action figure, blue Fantastic Four uniform with number 4 logo, force field effects, blonde hair, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "human-torch",
        "prompt": "Marvel Legends Human Torch action figure, blue Fantastic Four uniform, flame effects on hands, blonde hair, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "the-thing",
        "prompt": "Marvel Legends The Thing action figure, orange rocky skin texture, blue shorts, massive muscular build, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "doctor-doom",
        "prompt": "Marvel Legends Doctor Doom action figure, metal armor with green cape and hood, medieval design, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "deadpool",
        "prompt": "Marvel Legends Deadpool action figure, red and black costume, dual katanas on back, pouches and weapons, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "lady-deadpool",
        "prompt": "Marvel Legends Lady Deadpool action figure, red and black costume, long ponytail, dual pistols, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "wolverine-brown",
        "prompt": "Marvel Legends Wolverine action figure, brown and tan costume, adamantium claws extended, muscular build, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "green-goblin",
        "prompt": "Marvel Legends Green Goblin action figure, purple and green costume, goblin glider, pumpkin bombs, evil grin, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "doctor-octopus",
        "prompt": "Marvel Legends Doctor Octopus action figure, green jumpsuit, four mechanical tentacle arms, sunglasses, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "venom",
        "prompt": "Marvel Legends Venom action figure, massive black symbiote body, white spider symbol, long tongue, sharp teeth, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "carnage",
        "prompt": "Marvel Legends Carnage action figure, red symbiote with black veins, tendrils, sharp claws, menacing pose, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "thanos-infinity",
        "prompt": "Marvel Legends Thanos action figure, Infinity Gauntlet with all stones, purple skin, gold armor, massive build, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "loki-tva",
        "prompt": "Marvel Legends Loki TVA action figure, brown TVA suit with tie, horned crown accessory, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "captain-america-first",
        "prompt": "Marvel Legends Captain America action figure, first appearance design, triangular shield, scale mail chest, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "iron-man-model-70",
        "prompt": "Marvel Legends Iron Man Model 70 armor action figure, classic red and gold design, repulsor rays, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "hulk-classic",
        "prompt": "Marvel Legends Hulk action figure, massive green muscular body, purple torn pants, rage expression, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "black-widow",
        "prompt": "Marvel Legends Black Widow action figure, black tactical suit, red hair, widow bites on wrists, dual pistols, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "hawkeye-classic",
        "prompt": "Marvel Legends Hawkeye action figure, classic purple costume, bow and arrow, quiver on back, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "scarlet-witch",
        "prompt": "Marvel Legends Scarlet Witch WandaVision action figure, red costume with cape, red energy effects, crown, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "vision-wandavision",
        "prompt": "Marvel Legends Vision action figure, green and yellow costume, red synthetic skin, Mind Stone on forehead, cape, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "captain-america-sam",
        "prompt": "Marvel Legends Captain America Sam Wilson action figure, white and blue suit with wings, shield, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "winter-soldier",
        "prompt": "Marvel Legends Winter Soldier action figure, black tactical gear, metal arm, long dark hair, rifle, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "moon-knight",
        "prompt": "Marvel Legends Moon Knight action figure, white costume with hood and cape, crescent darts, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "ms-marvel",
        "prompt": "Marvel Legends Ms. Marvel Kamala Khan action figure, red and blue costume, energy fist effects, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
    },
    {
        "name": "she-hulk",
        "prompt": "Marvel Legends She-Hulk action figure, green skin, purple and white business suit, muscular build, 6-inch scale figure, professional product photography, white background, studio lighting, high detail, Hasbro toy"
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
            return True
        else:
            print(f"[FAILED] Failed to generate {figure['name']}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error generating {figure['name']}: {e}")
        return False

def main():
    print("=" * 50)
    print("MARVEL LEGENDS FIGURE IMAGE GENERATOR")
    print("=" * 50)
    print(f"Generating {len(figures)} action figure images...")
    print()
    
    successful = 0
    failed = []
    
    for i, figure in enumerate(figures, 1):
        print(f"[{i}/{len(figures)}] ", end="")
        if generate_figure(figure):
            successful += 1
        else:
            failed.append(figure['name'])
        
        # Small delay to avoid rate limiting
        if i < len(figures):
            time.sleep(2)
    
    print()
    print("=" * 50)
    print(f"Generation complete!")
    print(f"[SUCCESS] Successfully generated: {successful}/{len(figures)}")
    
    if failed:
        print(f"[FAILED] Failed figures: {', '.join(failed)}")
        print("You can run the script again to retry failed images.")
    
    print(f"\nImages saved to: {os.path.abspath(OUTPUT_DIR)}")

if __name__ == "__main__":
    main()